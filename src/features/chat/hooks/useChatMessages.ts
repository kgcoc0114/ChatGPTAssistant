import { useState, useCallback } from 'react';
import { Alert } from 'react-native';

import { Message } from '../models/Message';
import { useFirestoreMessages } from './useFirestoreMessages';
import ChatGPTService from '../../../services/ChatGPTService';

export interface UseChatMessagesReturn {
  // State
  messages: Message[];
  isLoading: boolean;
  chatId: string;
  firestoreLoading: boolean;
  error: Error | null;
  
  // Actions
  sendMessage: (text: string, modelId?: string) => Promise<void>;
  clearMessages: () => Promise<void>;
  initializeWithWelcome: () => Promise<void>;
  setChatId: (id: string) => void;
}

export const useChatMessages = (initialChatId?: string): UseChatMessagesReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chatId, setChatId] = useState<string>(initialChatId || `chat_${Date.now()}`);

  // Firestore hook
  const {
    messages,
    loading: firestoreLoading,
    error,
    addMessage,
    updateMessage,
    clearMessages: clearFirestoreMessages,
  } = useFirestoreMessages(chatId);

  const clearMessages = useCallback(async () => {
    try {
      await clearFirestoreMessages();
    } catch (error) {
      console.error('Failed to clear messages:', error);
      Alert.alert('錯誤', '清除訊息失敗');
    }
  }, [clearFirestoreMessages]);

  const initializeWithWelcome = useCallback(async () => {
    try {
      // is new chat
      if (messages.length === 0 && !firestoreLoading) {
        await addMessage(
          '你好，我是 ChatGPT AI 助手，有什麼可以幫助你的嗎？',
          false, // isUser
          false  // isLoading
        );
      }
    } catch (error) {
      console.error('Failed to initialize welcome message:', error);
    }
  }, [messages.length, firestoreLoading, addMessage]);

  // message history helper
  const buildMessageHistory = useCallback((currentMessages: Message[]) => {
    return currentMessages
      .filter(msg => !msg.isLoading) // 過濾掉載入中的訊息
      .map(msg => ({
        role: msg.isUser ? 'user' as const : 'assistant' as const,
        content: msg.text
      }));
  }, []);

  const sendMessage = useCallback(async (text: string, modelId: string = 'gpt-3.5-turbo') => {
    if (!text.trim()) return;

    setIsLoading(true);

    try {
      // 1. add user message to firestore
      await addMessage(text.trim(), true, false);

      // 2. add loading message
      const aiMessageId = await addMessage('', false, true);

      // 3. generate history
      const messageHistory = buildMessageHistory(messages);
      messageHistory.push({
        role: 'user',
        content: text.trim()
      });

      // 4. fetch ChatGPT api
      const response = await ChatGPTService.sendMessage(messageHistory, modelId);

      // 5. update ai message to firestore
      await updateMessage(aiMessageId, {
        text: response,
        isLoading: false
      });

    } catch (error) {
      console.error('Failed to send message:', error);
      Alert.alert('錯誤', '訊息傳送失敗，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  }, [messages, addMessage, updateMessage, buildMessageHistory]);

  return {
    // State
    messages,
    isLoading,
    chatId,
    firestoreLoading,
    error,
    
    // Actions
    sendMessage,
    clearMessages,
    initializeWithWelcome,
    setChatId,
  };
};