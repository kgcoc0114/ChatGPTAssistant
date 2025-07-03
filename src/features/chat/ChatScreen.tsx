import React, { useCallback, useEffect, useState } from 'react';
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

  // 統一的 Chat 管理 hook
  const chatManager = useChatManager(routeChatId);
  
  // 其他 hooks
  const messages = useChatMessages(chatManager.currentChatId);
  const modelSelection = useModelSelection();
  const input = useChatInput();

  // 當 route chatId 變化時，更新 chat manager
  useEffect(() => {
    if (routeChatId !== chatManager.currentChatId) {
      chatManager.switchToChat(routeChatId);
    }
  }, [routeChatId]);

  // 監聽 chat manager 的狀態變化
  useEffect(() => {
    if (chatManager.error) {
      Alert.alert('錯誤', chatManager.error.message);
    }
  }, [chatManager.error]);

  // 當進入畫面時初始化
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
    
    // 確保有有效的 chat ID
    if (!chatManager.currentChatId) {
      await chatManager.createNewChat();
    }
    
    input.clearInput();
    await messages.sendMessage(messageText, modelId);
  };

  // 如果正在初始化，顯示 loading
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