import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, DeviceEventEmitter } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@react-native-vector-icons/ionicons';
import { useAuth } from '../../context/AuthContext';
import { ChatData, FirestoreService } from '../../services/FirestoreService';

const ChatHistoryScreen = () => {
  const [chats, setChats] = useState<ChatData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const navigation = useNavigation();
  const { user } = useAuth();
  const userId = user?.id;
  const [deletingChats, setDeletingChats] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    console.log('Setting up chat list listener for user:', userId);

    const unsubscribe = FirestoreService.subscribeToChatList(
      userId,
      (chatList: ChatData[]) => {
        console.log(`Received ${chatList.length} chats`);
        setChats(chatList);
        setLoading(false);
        setError(null);
      },
      (err: Error) => {
        console.error('Error listening to chat list:', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => {
      console.log('Cleaning up chat list listener');
      unsubscribe();
    };
  }, [userId]);

  const formatDateTime = (date: Date): string => {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString('zh-TW', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (diffDays === 1) {
      return '昨天';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('zh-TW', { weekday: 'long' });
    } else {
      return date.toLocaleDateString('zh-TW', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  // 簡單的導航，讓 ChatScreen 自己處理檢查
  const handleChatPress = (chatId: string) => {
    navigation.replace('MainTab', {
      screen: 'Chat',
      params: { chatId }
    });
  };

  const handleDeleteChat = (chatId: string, title: string) => {
    Alert.alert(
      '刪除聊天記錄',
      `確定要刪除「${title}」的聊天記錄嗎？此操作無法復原。`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '刪除',
          style: 'destructive',
          onPress: async () => {
            setDeletingChats(prev => new Set(prev).add(chatId));
            
            try {
              await FirestoreService.deleteChat(userId!, chatId);
              Alert.alert('成功', '聊天記錄已刪除');
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert('錯誤', '刪除失敗，請稍後再試');
            } finally {
              setDeletingChats(prev => {
                const newSet = new Set(prev);
                newSet.delete(chatId);
                return newSet;
              });
            }
          },
        },
      ]
    );
  };

  const renderChatItem = ({ item }: { item: ChatData }) => {
    const isDeleting = deletingChats.has(item.chatId);
    return (
      <TouchableOpacity
        style={[
          styles.chatItem,
          isDeleting && styles.chatItemDeleting
        ]}
        onPress={() => handleChatPress(item.chatId)}
        activeOpacity={1}
        disabled={isDeleting}
      >
        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatTitle} numberOfLines={1}>
              {item.lastText}
            </Text>
            <Text style={styles.chatDate}>
              {formatDateTime(FirestoreService.safeToDate(item.lastActivity))}
            </Text>
          </View>
          <View style={styles.chatFooter}>
            <Text style={styles.messageCount}>
              {item.messageCount} 則訊息
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={[
            styles.deleteButton,
            isDeleting && styles.deleteButtonDisabled
          ]}
          onPress={() => handleDeleteChat(item.chatId, item.lastText ?? '')}
          disabled={isDeleting}
          activeOpacity={1}
        >
          <Icon 
            name={isDeleting ? "hourglass-outline" : "trash-outline"} 
            size={20} 
            color={isDeleting ? "#ccc" : "#ff4444"} 
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={chats}
      keyExtractor={item => item.chatId}
      renderItem={renderChatItem}
      contentContainerStyle={styles.container}
    />
  );
};

// styles 保持不變...
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#f5f5f5',
  },
  chatItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  chatItemDeleting: {
    opacity: 0.6,
    backgroundColor: '#f8f8f8',
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  chatDate: {
    fontSize: 12,
    color: '#666',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageCount: {
    fontSize: 12,
    color: '#999',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  deleteButtonDisabled: {
    opacity: 0.5,
  },
  // ... 其他 styles
});

export default ChatHistoryScreen;