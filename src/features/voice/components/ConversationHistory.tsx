import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { VoiceMessage } from '../models/VoiceMessage';
import styles from '../../../styles/styles';

interface ConversationHistoryProps {
  conversations: VoiceMessage[];
  hasConversations: boolean;
  currentAudioId: string | null;
  onPlayAudio: (audioUrl: string, conversationId: string) => Promise<void>;
  onStopAudio: () => void;
}

export const ConversationHistory = ({
  conversations,
  hasConversations,
  currentAudioId,
  onPlayAudio,
  onStopAudio,
}: ConversationHistoryProps) => {
  const EmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Text style={styles.emptyStateEmoji}>🗣️</Text>
      <Text style={styles.emptyStateText}>開始您的第一次語音對話</Text>
      <Text style={styles.emptyStateDescription}>
        點擊麥克風按鈕，說出您想問的問題，AI 將會語音回覆您
      </Text>
    </View>
  );

  const ConversationItem = ({ conversation, positionIndex }: { conversation: VoiceMessage, positionIndex: number }) => {
    const isCurrentlyPlaying = currentAudioId === conversation.id;
    const isFirstMessage = positionIndex === 0;
    return (
      <View key={conversation.id} style={styles.conversationItem}>
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
            {isFirstMessage && conversation.audioUrl && (
              <TouchableOpacity
                onPress={() => {
                  if (!conversation.audioUrl) return;
                  isCurrentlyPlaying ? onStopAudio() : onPlayAudio(conversation.audioUrl, conversation.id)}}
                style={[
                  styles.playButton,
                  isCurrentlyPlaying && styles.playButtonActive
                ]}
              >
                <Text style={styles.playButtonText}>
                  {isCurrentlyPlaying ? '⏸️' : '▶️'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.sectionText}>{conversation.aiText}</Text>
          
          {isCurrentlyPlaying && (
            <View style={styles.playingIndicator}>
              <Text style={styles.playingText}>🔊 正在播放...</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <ScrollView 
      style={styles.historyContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.historyTitle}>對話記錄</Text>
      
      {!hasConversations ? (
        <EmptyState />
      ) : (
        conversations.map((conversation, index) => (
          <ConversationItem key={conversation.id} conversation={conversation} positionIndex={index} />
        ))
      )}
    </ScrollView>
  );
};
