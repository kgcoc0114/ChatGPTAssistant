import React, { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { useVoiceRecognition } from './hooks/useVoiceRecognition';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { useConversations } from './hooks/useConversations';
import { RecordingArea } from './components/RecordingArea';
import { ConversationHistory } from './components/ConversationHistory';
import styles from '../../styles/styles';
import debounce from 'lodash.debounce';

const VoiceScreen = () => {
  const {
    conversations,
    isProcessing,
    hasConversations,
    latestConversation,
    processVoiceInput,
    updateConversationPlayState,
    clearAllPlayingStates,
  } = useConversations();

  const { 
    isPlaying,
    currentAudioId,
    playAudio, 
    stopAudio 
  } = useAudioPlayer();

  const rawHandleSpeechResults = useCallback(async (text: string): Promise<void> => {
    try {
      const newConversation = await processVoiceInput(text);
      if (newConversation.audioUrl) {
        // console.log('newConversation', newConversation.audioUrl, newConversation.id)
        await handlePlayAudio(newConversation.audioUrl, newConversation.id);
        // playAudio(newConversation.audioUrl);
      }
      await stopRecording();
    } catch (error) {
      console.error('處理語音輸入時發生錯誤:', error);
    }
  }, [processVoiceInput]);

  const handleSpeechResults = useMemo(
    () => debounce(rawHandleSpeechResults, 500), // 講完 300ms 後才觸發
    [rawHandleSpeechResults]
  );

  const {
    isRecording,
    recognizedText,
    permissionGranted,
    isListening,
    stopRecording,
    toggleRecording,
    requestPermission,
  } = useVoiceRecognition(handleSpeechResults);

  const handlePlayAudio = useCallback(async (audioUrl: string, conversationId: string): Promise<void> => {
    // 開始播放
    updateConversationPlayState(conversationId, true);
    
    try {
      await playAudio(audioUrl, conversationId);
    } finally {
      // 結束播放
      updateConversationPlayState(conversationId, false);
    }
  }, [conversations, playAudio, updateConversationPlayState]);

  const handleStopAudio = useCallback((): void => {
    stopAudio();
    clearAllPlayingStates();
  }, [stopAudio, clearAllPlayingStates]);

  return (
    <View style={styles.voiceContainer}>
      <RecordingArea
        isRecording={isRecording}
        isProcessing={isProcessing}
        recognizedText={recognizedText}
        permissionGranted={permissionGranted}
        isListening={isListening}
        onToggleRecording={toggleRecording}
        onRequestPermission={requestPermission}
      />
      
      <ConversationHistory
        conversations={conversations}
        hasConversations={hasConversations}
        currentAudioId={currentAudioId}
        onPlayAudio={handlePlayAudio}
        onStopAudio={handleStopAudio}
      />
    </View>
  );
};

export default VoiceScreen;