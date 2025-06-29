import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import styles from '../../../styles/styles';

interface RecordingAreaProps {
  isRecording: boolean;
  isProcessing: boolean;
  recognizedText: string;
  permissionGranted: boolean;
  isListening: boolean;
  onToggleRecording: () => Promise<void>;
  onRequestPermission: () => Promise<void>;
}

export const RecordingArea = ({
  isRecording,
  isProcessing,
  recognizedText,
  permissionGranted,
  isListening,
  onToggleRecording,
  onRequestPermission,
}: RecordingAreaProps) => {
  const getStatusText = (): string => {
    if (isProcessing) return 'AI 正在處理中...';
    if (isListening) return '正在聆聽您的語音...';
    if (isRecording) return '語音識別中...';
    return '點擊麥克風開始語音輸入';
  };

  return (
    <View style={styles.recordingArea}>
      <TouchableOpacity
        onPress={onToggleRecording}
        style={[
          styles.recordButton,
          isRecording ? styles.recordButtonActive : styles.recordButtonInactive,
          !permissionGranted && styles.recordButtonDisabled
        ]}
        disabled={isProcessing || !permissionGranted}
      >
        {isProcessing ? (
          <ActivityIndicator size="large" color="white" />
        ) : (
          <Text style={styles.recordButtonEmoji}>
            {isRecording ? '🛑' : '🎤'}
          </Text>
        )}
      </TouchableOpacity>
      
      <Text style={styles.recordingText}>
        {getStatusText()}
      </Text>
      
      {recognizedText && recognizedText !== '正在聆聽...' && (
        <View style={styles.recognizedTextContainer}>
          <Text style={styles.recognizedTextLabel}>識別到的文字：</Text>
          <Text style={styles.recognizedText}>{recognizedText}</Text>
        </View>
      )}
      
      {!permissionGranted && (
        <TouchableOpacity 
          onPress={onRequestPermission}
          style={styles.permissionButton}
        >
          <Text style={styles.permissionButtonText}>授予麥克風權限</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};