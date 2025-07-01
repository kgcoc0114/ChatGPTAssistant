import { useState, useEffect, useCallback, useRef } from 'react';
import firestore from '@react-native-firebase/firestore';
import { Message } from '../models/Message';

export interface UseFirestoreMessagesReturn {
  // State
  messages: Message[];
  loading: boolean;
  error: Error | null;
  
  // Actions
  addMessage: (text: string, isUser: boolean, isLoading?: boolean) => Promise<string>;
  updateMessage: (messageId: string, updates: Partial<Pick<Message, 'text' | 'isLoading'>>) => Promise<void>;
  clearMessages: () => Promise<void>;
  createChatIfNotExists: () => Promise<void>;
}

export const useFirestoreMessages = (chatId: string): UseFirestoreMessagesReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const COLLECTION_CHATS = 'chats';
  const COLLECTION_MESSAGES = 'messages';

  // create chat room if needed
  const createChatIfNotExists = useCallback(async () => {
    try {
      const chatRef = firestore()
        .collection(COLLECTION_CHATS)
        .doc(chatId);
      
      const chatDoc = await chatRef.get();
      
      if (!chatDoc.exists()) {
        await chatRef.set({
          createdAt: firestore.FieldValue.serverTimestamp(),
          lastActivity: firestore.FieldValue.serverTimestamp(),
        });
      }
    } catch (err) {
      console.error('Error creating chat:', err);
      setError(err as Error);
    }
  }, [chatId]);

  const addMessage = useCallback(async (
    text: string,
    isUser: boolean,
    isLoading: boolean = false
  ): Promise<string> => {
    try {
      const messageRef = await firestore()
        .collection(COLLECTION_CHATS)
        .doc(chatId)
        .collection(COLLECTION_MESSAGES)
        .add({
          text,
          isUser,
          isLoading,
          timestamp: firestore.FieldValue.serverTimestamp(),
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
      
      return messageRef.id;
    } catch (err) {
      console.error('Error adding message:', err);
      setError(err as Error);
      throw err;
    }
  }, [chatId]);

  const updateMessage = useCallback(async (
    messageId: string,
    updates: Partial<Pick<Message, 'text' | 'isLoading'>>
  ): Promise<void> => {
    try {
      await firestore()
        .collection(COLLECTION_CHATS)
        .doc(chatId)
        .collection(COLLECTION_MESSAGES)
        .doc(messageId)
        .update({
          ...updates,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
    } catch (err) {
      console.error('Error updating message:', err);
      setError(err as Error);
      throw err;
    }
  }, [chatId]);

  const clearMessages = useCallback(async (): Promise<void> => {
    try {
      const messagesRef = firestore()
        .collection(COLLECTION_CHATS)
        .doc(chatId)
        .collection(COLLECTION_MESSAGES);

      const snapshot = await messagesRef.get();
      const batch = firestore().batch();

      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
    } catch (err) {
      console.error('Error clearing messages:', err);
      setError(err as Error);
      throw err;
    }
  }, [chatId]);

  // message listener
  useEffect(() => {
    if (!chatId) return;

    setLoading(true);
    setError(null);

    createChatIfNotExists();

    // setup firestore listener
    const unsubscribe = firestore()
      .collection(COLLECTION_CHATS)
      .doc(chatId)
      .collection(COLLECTION_MESSAGES)
      .orderBy('timestamp', 'asc')
      .onSnapshot(
        (snapshot) => {
          const newMessages: Message[] = [];
          
          snapshot.forEach((doc) => {
            const data = doc.data();
            newMessages.push({
              id: doc.id,
              text: data.text || '',
              isUser: data.isUser || false,
              timestamp: data.timestamp?.toDate() || new Date(),
              isLoading: data.isLoading || false,
            });
          });

          setMessages(newMessages);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error('Firestore listener error:', err);
          setError(err as Error);
          setLoading(false);
        }
      );

    unsubscribeRef.current = unsubscribe;

    // deinit
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [chatId, createChatIfNotExists]);

  return {
    // State
    messages,
    loading,
    error,
    
    // Actions
    addMessage,
    updateMessage,
    clearMessages,
    createChatIfNotExists,
  };
};