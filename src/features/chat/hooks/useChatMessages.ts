import { useState, useCallback, useRef } from 'react';
import { Alert } from 'react-native';

import { Message } from '../models/Message';
import ChatGPTService from '../../../services/ChatGPTService';

export interface UseChatMessagesReturn {
  // State
  messages: Message[];
  isLoading: boolean;
  
  // Actions
  addMessage: (message: Message) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  clearMessages: () => void;
  sendMessage: (text: string, modelId?: string) => Promise<void>;
  initializeWithWelcome: () => void;
}

export const useChatMessages = (): UseChatMessagesReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const updateMessage = useCallback((id: string, updates: Partial<Message>) => {
    setMessages(prev => 
      prev.map(msg => msg.id === id ? { ...msg, ...updates } : msg)
    );
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const initializeWithWelcome = useCallback(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      text: '你好，我是 ChatGPT AI 助手，有什麼可以幫助你的嗎？',
      isUser: false,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

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

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    // add loading message
    const aiLoadingMessage: Message = {
      id: `ai_${Date.now()}`,
      text: '',
      isUser: false,
      timestamp: new Date(),
      isLoading: true,
    };

    // update messages state
    setMessages(prev => {
      const newMessages = [...prev, userMessage, aiLoadingMessage];
      
      // fetch api
      (async () => {
        setIsLoading(true);
        
        try {
          // message history (不包含當前的載入訊息)
          const messageHistory = buildMessageHistory([...prev, userMessage]);
          
          const response = await ChatGPTService.sendMessage(messageHistory, modelId);
          
          setMessages(currentMessages => 
            currentMessages.map(msg => 
              msg.id === aiLoadingMessage.id 
                ? { ...msg, text: response, isLoading: false }
                : msg
            )
          );
        } catch (error) {
          console.error('Failed to send message:', error);
          
          // remove loading message and show error
          setMessages(currentMessages => 
            currentMessages.filter(msg => msg.id !== aiLoadingMessage.id)
          );
          
          Alert.alert('錯誤', '訊息傳送失敗，請稍後再試');
        } finally {
          setIsLoading(false);
        }
      })();
      
      return newMessages;
    });
  }, [buildMessageHistory]);

  return {
    // State
    messages,
    isLoading,
    
    // Actions
    addMessage,
    updateMessage,
    clearMessages,
    sendMessage,
    initializeWithWelcome,
  };
};