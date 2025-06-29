import { ModelInfo } from "../screens/Chat/models/Message";

export const AVAILABLE_MODELS: ModelInfo[] = [
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: '快速且成本低', isDefault: true },
  { id: 'gpt-4', name: 'GPT-4', description: '更聰明但較慢', isDefault: false }
];