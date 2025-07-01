import React, { useRef, useEffect } from 'react';
import { FlatList, Keyboard } from 'react-native';

import { Message } from '../models/Message';
import { MessageItem } from './MessageItem';

interface MessageListProps {
  messages: Message[];
  keyboardHeight: number;
  loading?: boolean;
}

export const MessageList = ({
  messages,
  keyboardHeight,
  loading = false,
}: MessageListProps) => {
  const flatListRef = useRef<FlatList>(null);
  const previousMessageCount = useRef(0);

  // scrollToEnd
  useEffect(() => {
    if (messages.length > previousMessageCount.current && !loading) {
      const timer = setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);

      previousMessageCount.current = messages.length;
      return () => clearTimeout(timer);
    }
    previousMessageCount.current = messages.length;
  }, [messages.length, loading]);

  const handleContentSizeChange = () => {
    if (!loading) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  };

  const scrollToEnd = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };
  
  // keyboard listener
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        scrollToEnd();
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        scrollToEnd();
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  if (loading) {
    return null;
  }

  return (
    <FlatList
      ref={flatListRef}
      data={messages}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <MessageItem message={item} />}
      contentContainerStyle={{
        paddingTop: 16,
        paddingLeft: 8,
        paddingRight: 8,
        paddingBottom: keyboardHeight || 20,
        flexGrow: 1
      }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      onContentSizeChange={handleContentSizeChange}
      removeClippedSubviews={false}
    />
  );
};