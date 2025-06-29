import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { VoiceMessage } from '../models/VoiceMessage';
import styles from '../../../styles/styles';

interface ConversationItemProps {
  conversation: VoiceMessage;
  isPlaying: boolean;
  onPlayToggle: (conversationId: string) => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isPlaying,
  onPlayToggle
}) => {
  return (
    <View style={styles.conversationItem}>
      <Text style={styles.timestamp}>
        {conversation.timestamp.toLocaleTimeString('zh-TW', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </Text>
      
      {/* User Voice Input */}
      <View style={styles.userSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.userIndicator}>🗣️</Text>
          <Text style={styles.sectionLabel}>您說：</Text>
        </View>
        <Text style={styles.sectionText}>{conversation.userText}</Text>
      </View>
      
      {/* AI Response */}
      <View style={styles.aiSection}>
        <View style={styles.aiHeader}>
          <View style={styles.sectionHeader}>
            <Text style={styles.aiIndicator}>🤖</Text>
            <Text style={styles.sectionLabel}>AI 回覆：</Text>
          </View>
          {conversation.audioUrl && (
            <TouchableOpacity
              onPress={() => onPlayToggle(conversation.id)}
              style={[
                styles.playButton,
                isPlaying && styles.playButtonActive
              ]}
            >
              <Text style={styles.playButtonText}>
                {isPlaying ? '⏸️' : '▶️'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.sectionText}>{conversation.aiText}</Text>
        
        {isPlaying && (
          <View style={styles.playingIndicator}>
            <Text style={styles.playingText}>🔊 正在播放...</Text>
          </View>
        )}
      </View>
    </View>
  );
};