import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/keys';
import { AVAILABLE_MODELS } from '../constants/models';

export const PreferenceService = {
  async loadModel(): Promise<string> {
    const saved = await AsyncStorage.getItem(STORAGE_KEYS.SELECTED_MODEL);
    const fallback = AVAILABLE_MODELS.find(m => m.isDefault)?.id || 'gpt-3.5-turbo';
    return AVAILABLE_MODELS.some(m => m.id === saved) ? saved! : fallback;
  },
  async saveModel(modelId: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.SELECTED_MODEL, modelId);
  }
};