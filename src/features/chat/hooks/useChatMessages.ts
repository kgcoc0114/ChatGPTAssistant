import { useState, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';

import { Message } from '../models/Message';
import { useFirestoreMessages } from './useFirestoreMessages';
import ChatGPTService from '../../../services/ChatGPTService';

export interface UseChatMessagesReturn {
  // State
  messages: Message[];
  isLoading: boolean;
  firestoreLoading: boolean;
  error: Error | null;
  isAIResponding: boolean;
  
  // Actions
  sendMessage: (text: string, modelId?: string) => Promise<void>;
  clearMessages: () => Promise<void>;
}

export const useChatMessages = (chatId: string | null): UseChatMessagesReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAIResponding, setIsAIResponding] = useState<boolean>(false);

  // Firestore hook
  const {
    messages: firestoreMessages,
    loading: firestoreLoading,
    error,
    addMessage,
    clearMessages: clearFirestoreMessages,
  } = useFirestoreMessages(chatId);

  // welcome message
  const welcomeMessage: Message = useMemo(() => ({
    id: 'welcome_message',
    text: '你好，我是 ChatGPT AI 助手，有什麼可以幫助你的嗎？',
    isUser: false,
    isLoading: false,
    timestamp: new Date(),
  }), []);

  // combine welcome message & Firestore message
  const messages = useMemo(() => {
    const result: Message[] = [];
    // welcome message
    result.push(welcomeMessage);

    result.push(...firestoreMessages);
    
    return result;
  }, [firestoreMessages, firestoreLoading, chatId, welcomeMessage]);

  const clearMessages = useCallback(async () => {
    try {
      await clearFirestoreMessages();
      setIsAIResponding(false);
    } catch (error) {
      console.error('Failed to clear messages:', error);
      Alert.alert('錯誤', '清除訊息失敗');
    }
  }, [clearFirestoreMessages]);

  // create history
  const buildMessageHistory = useCallback((currentMessages: Message[]) => {
    return currentMessages
      .filter(msg => msg.id !== welcomeMessage.id) // 排除 welcome message
      .map(msg => ({
        role: msg.isUser ? 'user' as const : 'assistant' as const,
        content: msg.text
      }));
  }, [welcomeMessage.id]);

  const sendMessage = useCallback(async (text: string, modelId: string = 'gpt-3.5-turbo') => {
    if (!text.trim() || !chatId) {
      console.warn('Cannot send message: empty text or missing chatId');
      return;
    }

    setIsLoading(true);
    setIsAIResponding(true);

    try {
      // 1. add user message to firestore
      await addMessage(text.trim(), true);

      // 2. generate history
      const messageHistory = buildMessageHistory(firestoreMessages);
      messageHistory.push({
        role: 'user',
        content: text.trim()
      });

      // 3. fetch ChatGPT api
      const response = await ChatGPTService.sendMessage(messageHistory, modelId);

      // 4. add AI response to firestore
      await addMessage(response, false);
      
    } catch (error) {
      console.error('Failed to send message:', error);
      Alert.alert('錯誤', '訊息傳送失敗，請稍後再試');
    } finally {
      setIsLoading(false);
      setIsAIResponding(false);
    }
  }, [chatId, firestoreMessages, addMessage, buildMessageHistory]);

  return {
    // State
    messages,
    isLoading,
    firestoreLoading,
    error,
    isAIResponding,
    
    // Actions
    sendMessage,
    clearMessages,
  };
};