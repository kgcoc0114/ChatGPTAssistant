export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isLoading?: boolean;
  audioUrl?: string;
  isPlaying?: boolean;
}

export interface ModelInfo {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
}