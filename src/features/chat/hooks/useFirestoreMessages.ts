import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Message } from '../models/Message';
import { useAuth } from '../../../context/AuthContext';
import { FirestoreService, MessageData } from '../../../services/FirestoreService';

export interface UseFirestoreMessagesReturn {
  // State
  messages: Message[];
  loading: boolean;
  error: Error | null;
  
  // Actions
  addMessage: (text: string, isUser: boolean) => Promise<string>;
  updateMessage: (messageId: string, updates: Partial<Pick<Message, 'text'>>) => Promise<void>;
  clearMessages: () => Promise<void>;
}

export const useFirestoreMessages = (chatId: string | null): UseFirestoreMessagesReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const { user } = useAuth();
  const userId = user?.id;
  const isReady = !!userId && !!chatId;

  const addMessage = useCallback(async (text: string, isUser: boolean): Promise<string> => {
    if (!userId || !chatId) {
      throw new Error('Missing userId or chatId');
    }
    return FirestoreService.addMessage(userId, chatId, text, isUser);
  }, [userId, chatId]);

  const updateMessage = useCallback(async (
    messageId: string,
    updates: Partial<Pick<Message, 'text'>>
  ): Promise<void> => {
    if (!userId || !chatId) {
      throw new Error('Missing userId or chatId');
    }
    return FirestoreService.updateMessage(userId, chatId, messageId, updates);
  }, [userId, chatId]);

  const clearMessages = useCallback(async (): Promise<void> => {
    if (!userId || !chatId) {
      throw new Error('Missing userId or chatId');
    }
    return FirestoreService.clearMessages(userId, chatId);
  }, [userId, chatId]);

  // message listener
  useEffect(() => {
    // reset listener
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    // reset data
    setMessages([]);
    setError(null);

    if (!isReady) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = FirestoreService.subscribeToMessages(
      userId!,
      chatId!,
      (messageData: MessageData[]) => {
        const transformedMessages: Message[] = messageData.map(data => ({
          id: data.id,
          text: data.text,
          isUser: data.isUser,
          timestamp: FirestoreService.safeToDate(data.timestamp),
          isLoading: false,
        }));
        setMessages(transformedMessages);
        setLoading(false);
        setError(null);
      },
      (error: Error) => {
        setError(error);
        setLoading(false);
      }
    );

    unsubscribeRef.current = unsubscribe;

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [isReady, userId, chatId]);

  return {
    // State
    messages,
    loading,
    error,
    
    // Actions
    addMessage,
    updateMessage,
    clearMessages,
  };
};