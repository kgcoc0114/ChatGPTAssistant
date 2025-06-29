import React, { useLayoutEffect } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import Icon from '@react-native-vector-icons/ionicons';

import { ModelInfo } from '../models/Message';
import { headerStyles } from '../styles/HeaderStyles';

interface ChatHeaderProps {
  navigation: NavigationProp<any>;
  isLoading: boolean;
  currentModel: ModelInfo | null;
  onModelSelectorPress: () => void;
}

export const ChatHeader = ({
  navigation,
  isLoading,
  currentModel,
  onModelSelectorPress,
}: ChatHeaderProps) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRightContainerStyle: {
        paddingVertical: 4,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerRight: () => (
        <TouchableOpacity
          onPress={onModelSelectorPress}
          style={headerStyles.modelButton}
        >
          <Text style={headerStyles.modelButtonText}>
            {currentModel?.name || 'GPT-3.5'}
          </Text>
          <Icon name="chevron-down" size={15} color="white" />
        </TouchableOpacity>
      ),
      headerTitle: isLoading ? 'AI 正在思考...' : 'ChatGPT 對話',
      headerTitleAlign: 'left',
    });
  }, [navigation, isLoading, currentModel?.name, onModelSelectorPress]);

  return null; // 這個組件只負責設置 header，不渲染任何內容
};