import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

import { Message } from '../models/Message';
import styles from '../../../styles/styles';

interface MessageItemProps {
  message: Message;
}

export const MessageItem = ({ message }: MessageItemProps) => {
  const formatTime = (timestamp: Date): string => {
    return timestamp.toLocaleTimeString('zh-TW', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <View
      style={[
        styles.messageRow,
        message.isUser ? styles.messageRowUser : styles.messageRowAI
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          message.isUser ? styles.messageBubbleUser : styles.messageBubbleAI
        ]}
      >
        {message.isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#6b7280" />
            <Text style={styles.loadingText}>AI 正在回覆...</Text>
          </View>
        ) : (
          <>
            <Text
              style={[
                styles.messageText,
                message.isUser ? styles.messageTextUser : styles.messageTextAI
              ]}
            >
              {message.text}
            </Text>
            <Text
              style={[
                styles.messageTime,
                message.isUser ? styles.messageTimeUser : styles.messageTimeAI
              ]}
            >
              {formatTime(message.timestamp)}
            </Text>
          </>
        )}
      </View>
    </View>
  );
};