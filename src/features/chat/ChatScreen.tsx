import React, { useEffect } from 'react';
import { View } from 'react-native';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useChatMessages } from './hooks/useChatMessages';
import { useModelSelection } from './hooks/useModelSelection';
import { useChatInput } from './hooks/useChatInput';
import { useKeyboardHeight } from './hooks/useKeyboardHeight';

import { ChatHeader } from './components/ChatHeader';
import { MessageList } from './components/MessageList';
import { ChatInput } from './components/ChatInput';
import { ModelSelector } from './components/ModelSelector';

import styles from '../../styles/styles';

const ChatScreen = () => {
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();
  const keyboardHeight = useHeaderHeight();

  // hooks
  const messages = useChatMessages();
  const modelSelection = useModelSelection();
  const input = useChatInput();

  // welcome
  useEffect(() => {
    messages.initializeWithWelcome();
  }, [messages.initializeWithWelcome]);

  // send messages
  const handleSendMessage = async () => {
    if (!input.canSend || messages.isLoading) return;
    
    const messageText = input.inputText;
    const modelId = modelSelection.selectedModel?.id;
    
    input.clearInput();
    await messages.sendMessage(messageText, modelId);
  };

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
            keyboardHeight={keyboardHeight}
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
          // availableModels={modelSelection.availableModels}
          onClose={modelSelection.hideModelSelector}
          onModelSelect={modelSelection.selectModel}
        />
    </>
  );
};

export default ChatScreen;