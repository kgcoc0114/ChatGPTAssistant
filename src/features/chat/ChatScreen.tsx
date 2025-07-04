import React, { useCallback, useEffect } from 'react';
import { View, Alert } from 'react-native';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/elements';

import { useChatMessages } from './hooks/useChatMessages';
import { useModelSelection } from './hooks/useModelSelection';
import { useChatInput } from './hooks/useChatInput';
import { useChatManager } from './hooks/useChatManager';

import { ChatHeader } from './components/ChatHeader';
import { MessageList } from './components/MessageList';
import { ChatInput } from './components/ChatInput';
import { ModelSelector } from './components/ModelSelector';

import styles from '../../styles/styles';

type ChatScreenRouteProp = RouteProp<{
  ChatScreen: { chatId?: string };
}, 'ChatScreen'>;

const ChatScreen = () => {
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();
  const route = useRoute<ChatScreenRouteProp>();
  const routeChatId = route.params?.chatId;

  const chatManager = useChatManager(routeChatId);
  
  const messages = useChatMessages(chatManager.currentChatId);
  const modelSelection = useModelSelection();
  const input = useChatInput();

  // listen routeChatId
  useEffect(() => {
    if (routeChatId !== chatManager.currentChatId) {
      chatManager.switchToChat(routeChatId);
    }
  }, [routeChatId]);

  // listen chatManager
  useEffect(() => {
    if (chatManager.error) {
      Alert.alert('錯誤', chatManager.error.message);
    }
  }, [chatManager.error]);

  // viewWillAppear
  useFocusEffect(
    useCallback(() => {
      chatManager.initializeChat();
    }, [chatManager.currentChatId])
  );

  // 發送訊息
  const handleSendMessage = async () => {
    if (!input.canSend || messages.isLoading) return;
    
    const messageText = input.inputText;
    const modelId = modelSelection.selectedModel?.id;
    
    if (!chatManager.currentChatId) {
      await chatManager.createNewChat();
    }
    
    input.clearInput();
    await messages.sendMessage(messageText, modelId);
  };

  // loading
  if (chatManager.isInitializing) {
    return (
      <View style={styles.loadingContainer}>
        {/* Loading component */}
      </View>
    );
  }
  
  return (
    <>
      <ChatHeader 
        navigation={navigation}
        isLoading={messages.isLoading}
        currentModel={modelSelection.selectedModel}
        onModelSelectorPress={modelSelection.showModelSelector}
      />
      
      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight : 0}
      >
        <View style={{ flex: 1 }}>
          <MessageList 
            messages={messages.messages}
            keyboardHeight={headerHeight}
          />
        </View>
        
        <ChatInput 
          inputText={input.inputText}
          isLoading={messages.isLoading}
          onChangeText={input.setInputText}
          onSend={handleSendMessage}
        />
      </KeyboardAvoidingView>
      
      <ModelSelector 
        visible={modelSelection.isModelSelectorVisible}
        selectedModel={modelSelection.selectedModel}
        onClose={modelSelection.hideModelSelector}
        onModelSelect={modelSelection.selectModel}
      />
    </>
  );
};

export default ChatScreen;