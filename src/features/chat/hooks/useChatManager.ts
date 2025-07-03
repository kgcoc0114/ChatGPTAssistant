import { useState, useCallback, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { FirestoreService } from '../../../services/FirestoreService';
import { useErrorHandling } from '../../../services/ErrorHandlingService';

export interface UseChatManagerReturn {
  // State
  currentChatId: string | null;
  isInitializing: boolean;
  error: Error | null;
  
  // Actions
  initializeChat: () => Promise<void>;
  createNewChat: () => Promise<string>;
  switchToChat: (chatId?: string) => void;
  clearError: () => void;
}

export const useChatManager = (initialChatId?: string): UseChatManagerReturn => {
  const [currentChatId, setCurrentChatId] = useState<string | null>(initialChatId || null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const initializePromiseRef = useRef<Promise<void> | null>(null);
  
  const { user } = useAuth();
  const userId = user?.id;

  const checkChatExists = useCallback(async (chatId: string): Promise<boolean> => {
    if (!userId || !chatId) return false;
    
    try {
      return await FirestoreService.checkChatExists(userId, chatId);
    } catch (err) {
      console.error('Error checking chat existence:', err);
      return false;
    }
  }, [userId]);

  const createNewChat = useCallback(async (): Promise<string> => {
    if (!userId) {
      throw new Error('用戶未登入');
    }

    try {
      // 使用 FirestoreService 建聊天
      const newChatId = await FirestoreService.createChat(userId);
      
      console.log('[SUCCESS] Created new chat:', newChatId);
      setCurrentChatId(newChatId);
      setError(null);
      
      return newChatId;
    } catch (err) {
      const error = err as Error;
      console.error('Error creating new chat:', error);
      setError(error);
      throw error;
    }
  }, [userId]);

  const initializeChat = useCallback(async (): Promise<void> => {
    // 避免重複初始化
    if (initializePromiseRef.current) {
      return initializePromiseRef.current;
    }

    if (!userId) {
      setError(new Error('用戶未登入'));
      return;
    }

    const initPromise = (async () => {
      setIsInitializing(true);
      setError(null);

      try {
        // 1: 沒有 chatId
        if (!currentChatId) {
          console.log('No chatId, creating new chat');
          await createNewChat();
          return;
        }

        // 2: 有 chatId，檢查是否存在
        const exists = await checkChatExists(currentChatId);
        
        if (exists) {
          console.log('[SUCCESS] Chat exists:', currentChatId);
          // Chat 存在，不需要做任何事
        } else {
          console.log('[Error] Chat does not exist, creating new chat');
          // Chat 不存在，建新的
          await createNewChat();
        }
      } catch (err) {
        const error = err as Error;
        console.error('Error initializing chat:', error);
        setError(error);
      } finally {
        setIsInitializing(false);
        initializePromiseRef.current = null;
      }
    })();

    initializePromiseRef.current = initPromise;
    return initPromise;
  }, [currentChatId, userId, checkChatExists, createNewChat]);

  // 切換到指定的 chat
  const switchToChat = useCallback((chatId?: string) => {
    if (chatId !== currentChatId) {
      setCurrentChatId(chatId || null);
      setError(null);
      // 清除之前的初始化 promise
      initializePromiseRef.current = null;
    }
  }, [currentChatId]);

  // 清除錯誤
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    currentChatId,
    isInitializing,
    error,
    
    // Actions
    initializeChat,
    createNewChat,
    switchToChat,
    clearError,
  };
};