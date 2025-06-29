export interface VoiceMessage {
  id: string;
  userText: string;
  aiText: string;
  timestamp: Date;
  audioUrl?: string;
  isPlaying: boolean;
}

export interface ConversationHistoryItem {
  role: 'user' | 'assistant';
  content: string;
}
