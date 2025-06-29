import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tabButton: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: '#dbeafe',
  },
  tabButtonInactive: {
    backgroundColor: 'transparent',
  },
  tabEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#2563eb',
  },
  tabLabelInactive: {
    color: '#6b7280',
  },
  // Chat Screen Styles
  chatContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  chatHeader: {
    backgroundColor: '#2563eb',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
  },
  chatTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  chatSubtitle: {
    fontSize: 14,
    color: '#93c5fd',
    marginTop: 4,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageRow: {
    marginBottom: 16,
  },
  messageRowUser: {
    alignItems: 'flex-end',
  },
  messageRowAI: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '85%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  messageBubbleUser: {
    backgroundColor: '#2563eb',
    borderBottomRightRadius: 4,
  },
  messageBubbleAI: {
    backgroundColor: '#f3f4f6',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  messageTextUser: {
    color: 'white',
  },
  messageTextAI: {
    color: '#374151',
  },
  messageTime: {
    fontSize: 11,
    marginTop: 6,
    opacity: 0.7,
  },
  messageTimeUser: {
    color: '#bfdbfe',
    textAlign: 'right',
  },
  messageTimeAI: {
    color: '#6b7280',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  inputContainer: {
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: 'white',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    minWidth: 70,
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  // Voice Screen Styles
  voiceContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  voiceHeader: {
    backgroundColor: '#059669',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
  },
  voiceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  voiceSubtitle: {
    fontSize: 14,
    color: '#6ee7b7',
    marginTop: 4,
  },
  recordingArea: {
    padding: 40,
    alignItems: 'center',
  },
  recordButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  recordButtonActive: {
    backgroundColor: '#ef4444',
  },
  recordButtonInactive: {
    backgroundColor: '#10b981',
  },
  recordButtonEmoji: {
    fontSize: 40,
  },
  recordButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  recordingText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  recognizedTextContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    maxWidth: '90%',
  },
  recognizedTextLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  recognizedText: {
    fontSize: 16,
    color: '#1f2937',
    lineHeight: 22,
  },
  permissionButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#2563eb',
    borderRadius: 8,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  historyContainer: {
    flex: 1,
    padding: 16,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 32,
  },
  conversationItem: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  timestamp: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 12,
    textAlign: 'right',
  },
  userSection: {
    marginBottom: 16,
  },
  aiSection: {
    marginBottom: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userIndicator: {
    fontSize: 16,
    marginRight: 8,
  },
  aiIndicator: {
    fontSize: 16,
    marginRight: 8,
  },
  aiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  sectionText: {
    fontSize: 15,
    color: '#4b5563',
    lineHeight: 22,
    marginLeft: 24,
  },
  playButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
  },
  playButtonActive: {
    backgroundColor: '#dbeafe',
  },
  playButtonText: {
    fontSize: 18,
  },
  playingIndicator: {
    marginTop: 12,
    marginLeft: 24,
  },
  playingText: {
    fontSize: 13,
    color: '#059669',
    fontWeight: '500',
  },
  comingSoonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  comingSoonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 16,
  },
  comingSoonDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  modelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  modelButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white'
  },
  modalHeader: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#eee',
    borderBottomWidth: 1
  },
  modalCloseText: {
    color: '#007AFF',
    fontSize: 16
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  modelList: {
    padding: 16
  },
  modelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    marginBottom: 12
  },
  modelItemSelected: {
    borderColor: '#007AFF',
    borderWidth: 2,
    backgroundColor: '#e3f2fd'
  },
  modelInfo: {
    flex: 1
  },
  modelName: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  modelDescription: {
    fontSize: 14,
    color: '#555'
  },
  checkContainer: {
    marginLeft: 12
  }
});

export default styles;