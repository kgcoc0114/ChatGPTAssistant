import React, { useRef, useEffect } from 'react';
import { FlatList, Keyboard } from 'react-native';

import { Message } from '../models/Message';
import { MessageItem } from './MessageItem';

interface MessageListProps {
  messages: Message[];
  keyboardHeight: number;
}

export const MessageList = ({
  messages,
  keyboardHeight,
}: MessageListProps) => {
  const flatListRef = useRef<FlatList>(null);

  // scrollToEnd
  useEffect(() => {
    const timer = setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    return () => clearTimeout(timer);
  }, [messages]);

  const handleContentSizeChange = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const scrollToEnd = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };
  
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
      }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      onContentSizeChange={handleContentSizeChange}
    />
  );
};