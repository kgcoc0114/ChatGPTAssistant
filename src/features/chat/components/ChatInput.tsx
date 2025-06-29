import React from 'react';
import { View, TextInput, TouchableOpacity, Text, ActivityIndicator } from 'react-native';

import styles from '../../../styles/styles';

interface ChatInputProps {
  inputText: string;
  isLoading: boolean;
  onChangeText: (text: string) => void;
  onSend: () => void;
}

export const ChatInput = ({
  inputText,
  isLoading,
  onChangeText,
  onSend,
}: ChatInputProps) => {
  const isDisabled = !inputText.trim() || isLoading;

  return (
    <View style={styles.inputContainer}>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={onChangeText}
          placeholder="輸入訊息..."
          multiline
          maxLength={1000}
          editable={!isLoading}
        />
        <TouchableOpacity
          onPress={onSend}
          style={[
            styles.sendButton,
            isDisabled && styles.sendButtonDisabled
          ]}
          disabled={isDisabled}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.sendButtonText}>發送</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};