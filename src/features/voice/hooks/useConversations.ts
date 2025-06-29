import { useState, useCallback, useMemo, useEffect } from 'react';
import { Alert } from 'react-native';
import { VoiceMessage, ConversationHistoryItem } from '../models/VoiceMessage';
import { PreferenceService } from '../../../services/PreferenceService';
import ChatGPTService from '../../../services/ChatGPTService'; // 直接導入服務

export interface UseConversationsReturn {
  // State
  conversations: VoiceMessage[];
  isProcessing: boolean;
  hasConversations: boolean;
  latestConversation: VoiceMessage | null;
  currentModel: string;
  
  // Actions
  addConversation: (conversation: VoiceMessage) => void;
  updateConversationPlayState: (id: string, isPlaying: boolean) => void;
  clearAllPlayingStates: () => void;
  clearConversations: () => void;
  processVoiceInput: (text: string) => Promise<VoiceMessage>;
  refreshModel: () => Promise<void>;
}

const MAX_CONVERSATION_HISTORY = 5;

export const useConversations = (): UseConversationsReturn => {
  const [conversations, setConversations] = useState<VoiceMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentModel, setCurrentModel] = useState<string>('gpt-3.5-turbo');

  const hasConversations = useMemo(() => {
    return conversations.length > 0;
  }, [conversations.length]);

  const latestConversation = useMemo(() => {
    return conversations.length > 0 ? conversations[0] : null;
  }, [conversations]);

  // load model from PreferenceService (aysnc storage)
  const loadModel = useCallback(async (): Promise<void> => {
    try {
      const model = await PreferenceService.loadModel();
      setCurrentModel(model || 'gpt-3.5-turbo');
    } catch (error) {
      console.error('載入模型配置失敗:', error);
      setCurrentModel('gpt-3.5-turbo');
    }
  }, []);

  const refreshModel = useCallback(async (): Promise<void> => {
    await loadModel();
  }, [loadModel]);

  // init: load model
  useEffect(() => {
    loadModel();
  }, [loadModel]);

  const addConversation = useCallback((conversation: VoiceMessage): void => {
    setConversations(prev => [conversation, ...prev]);
  }, []);

  const updateConversationPlayState = useCallback((id: string, isPlaying: boolean): void => {
    setConversations(prev =>
      prev.map(conv => ({
        ...conv,
        isPlaying: conv.id === id ? isPlaying : false,
      }))
    );
  }, []);

  const clearAllPlayingStates = useCallback((): void => {
    setConversations(prev =>
      prev.map(conv => ({ ...conv, isPlaying: false }))
    );
  }, []);

  const clearConversations = useCallback((): void => {
    setConversations([]);
  }, []);

  const processVoiceInput = useCallback(async (text: string): Promise<VoiceMessage> => {
    if (!text.trim()) {
      throw new Error('輸入文字不能為空');
    }

    if (isProcessing) {
      throw new Error('正在處理中，請稍候');
    }

    setIsProcessing(true);

    try {
      const conversationHistory: ConversationHistoryItem[] = conversations
        .slice(-MAX_CONVERSATION_HISTORY) // 取最後5個，保持原始順序
        .flatMap(conv => [
          { role: 'user' as const, content: conv.userText },
          { role: 'assistant' as const, content: conv.aiText }
        ]);

      // add current message
      conversationHistory.push({ role: 'user', content: text });

      const aiResponse = await ChatGPTService.sendMessage(conversationHistory, currentModel);

      // tts
      const audioUrl = await ChatGPTService.textToSpeech(aiResponse, 'nova');

      // append conversations
      const newConversation: VoiceMessage = {
        id: Date.now().toString(),
        userText: text,
        aiText: aiResponse,
        timestamp: new Date(),
        audioUrl: audioUrl,
        isPlaying: false,
      };

      addConversation(newConversation);
      return newConversation;

    } catch (error) {
      console.error('語音處理錯誤:', error);
      Alert.alert('錯誤', '處理語音時發生錯誤，請重試');
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [conversations, isProcessing, addConversation, currentModel]);

  return {
    // State
    conversations,
    isProcessing,
    hasConversations,
    latestConversation,
    currentModel,
    
    // Actions
    addConversation,
    updateConversationPlayState,
    clearAllPlayingStates,
    clearConversations,
    processVoiceInput,
    refreshModel,
  };
};