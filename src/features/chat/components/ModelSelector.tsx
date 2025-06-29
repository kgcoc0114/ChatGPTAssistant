import React from 'react';
import { Modal, View, TouchableOpacity, Text, ScrollView } from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';

import { AVAILABLE_MODELS } from '../../../constants/models';
import { modalStyles } from '../styles/ModalStyles';
import { ModelInfo } from '../models/Message';

interface ModelSelectorProps {
  visible: boolean;
  selectedModel: ModelInfo | null;
  onClose: () => void;
  onModelSelect: (modelId: string) => void;
}

export const ModelSelector = ({
  visible,
  selectedModel,
  onClose,
  onModelSelect,
}: ModelSelectorProps) => {
  const currentModel = selectedModel ?? AVAILABLE_MODELS[0]
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={modalStyles.modalContainer}>
        <View style={modalStyles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Text style={modalStyles.modalCloseText}>取消</Text>
          </TouchableOpacity>
          <Text style={modalStyles.modalTitle}>選擇模型</Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView style={modalStyles.modelList}>
          {AVAILABLE_MODELS.map(model => (
            <TouchableOpacity
              key={model.id}
              onPress={() => onModelSelect(model.id)}
              style={[
                modalStyles.modelItem,
                currentModel.id === model.id && modalStyles.modelItemSelected
              ]}
            >
              <View style={modalStyles.modelInfo}>
                <Text style={modalStyles.modelName}>{model.name}</Text>
                <Text style={modalStyles.modelDescription}>{model.description}</Text>
              </View>
              <View style={modalStyles.checkContainer}>
                <Icon
                  name={currentModel.id === model.id ? 'checkmark-circle' : 'ellipse-outline'}
                  size={24}
                  color={currentModel.id === model.id ? '#007AFF' : '#ccc'}
                />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
};