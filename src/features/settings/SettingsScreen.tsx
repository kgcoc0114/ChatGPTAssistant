import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@react-native-vector-icons/ionicons';
import { useAuth } from '../../context/AuthContext';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { logout, user } = useAuth();

  const handleHistoryPress = () => {
    navigation.navigate('ChatHistory');
  };

  const handleClearAllHistory = () => {
    Alert.alert(
      '清除所有記錄',
      '確定要清除所有聊天記錄嗎？此操作無法復原。',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '清除',
          style: 'destructive',
          onPress: () => {
            // 這裡可以實現清除所有記錄的功能
            Alert.alert('成功', '所有聊天記錄已清除');
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      '登出',
      '確定要登出嗎？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '登出',
          style: 'destructive',
          onPress: () => {
            logout();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.userInfo}>
        <Icon name="person-circle" size={80} color="#007AFF" />
        <Text style={styles.userName}>{user?.name || '未登入用戶'}</Text>
        <Text style={styles.userEmail}>{user?.email || ''}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>聊天記錄</Text>
        <View style={styles.sectionContent}>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleHistoryPress}
          >
            <View style={styles.settingItemLeft}>
              <View style={styles.iconContainer}>
                <Icon name="time-outline" size={24} color="#007AFF" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.settingTitle}>歷史訊息</Text>
                <Text style={styles.settingSubtitle}>查看所有聊天記錄</Text>
              </View>
            </View>
            <Icon name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.logoutSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>登出</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>ChatGPT Assistant v1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  
  // 用戶信息樣式
  userInfo: {
    backgroundColor: 'white',
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
  },

  // 設定區域樣式
  section: {
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    marginHorizontal: 20,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dangerIconContainer: {
    backgroundColor: '#ffebee',
  },
  textContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  dangerText: {
    color: '#ff4444',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 60,
  },

  // 登出按鈕樣式
  logoutSection: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },

  footer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#999',
  },
});

export default SettingsScreen;