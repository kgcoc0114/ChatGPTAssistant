import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';

import { ModelInfo } from '../models/Message';
import { PreferenceService } from '../../../services/PreferenceService';
import { AVAILABLE_MODELS } from '../../../constants/models';


export interface UseModelSelectionReturn {
  // State
  selectedModel: ModelInfo | null;
  availableModels: ModelInfo[];
  isModelSelectorVisible: boolean;
  
  // Actions
  selectModel: (modelId: string) => Promise<void>;
  showModelSelector: () => void;
  hideModelSelector: () => void;
  loadSavedModel: () => Promise<void>;
}

export const useModelSelection = (): UseModelSelectionReturn => {
  const [selectedModel, setSelectedModel] = useState<ModelInfo | null>(null);
  const [availableModels] = useState<ModelInfo[]>(AVAILABLE_MODELS);
  const [isModelSelectorVisible, setIsModelSelectorVisible] = useState<boolean>(false);

  const showModelSelector = useCallback(() => {
    setIsModelSelectorVisible(true);
  }, []);

  const hideModelSelector = useCallback(() => {
    setIsModelSelectorVisible(false);
  }, []);

  const loadSavedModel = useCallback(async () => {
    try {
      const savedModelId = await PreferenceService.loadModel();
      const savedModel = AVAILABLE_MODELS.find(model => model.id === savedModelId);
      setSelectedModel(savedModel || null);
    } catch (error) {
      console.error('Failed to load saved model:', error);
      // set defalut model
      const defaultModel = AVAILABLE_MODELS.find(m => m.isDefault) || AVAILABLE_MODELS[0] || null;
      setSelectedModel(defaultModel);
    }
  }, []);

  const selectModel = useCallback(async (modelId: string) => {
    try {
      const previousModel = selectedModel;
      const newModel = availableModels.find(model => model.id === modelId);
      
      if (!newModel) {
        Alert.alert('錯誤', '選擇的模型不存在');
        return;
      }

      // save to local storage
      await PreferenceService.saveModel(modelId);
      setSelectedModel(newModel);
      setIsModelSelectorVisible(false);

      // show success alert
      Alert.alert(
        '模型切換成功', 
        `從 ${previousModel?.name || '未知模型'} 切換為 ${newModel.name}`
      );
    } catch (error) {
      console.error('Failed to select model:', error);
      Alert.alert('錯誤', '模型切換失敗');
    }
  }, [selectedModel, availableModels]);

  // load model
  useEffect(() => {
    loadSavedModel();
  }, [loadSavedModel]);

  return {
    // State
    selectedModel,
    availableModels,
    isModelSelectorVisible,
    
    // Actions
    selectModel,
    showModelSelector,
    hideModelSelector,
    loadSavedModel,
  };
};