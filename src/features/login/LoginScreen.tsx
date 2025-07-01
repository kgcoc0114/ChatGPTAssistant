import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import Icon from '@react-native-vector-icons/ionicons';
import { styles } from './LoginStyles';

const LoginScreen = () => {
  const { loginWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const success = await loginWithGoogle();
      if (!success) {
        Alert.alert('登入失敗', 'Google 登入失敗，請稍後再試');
      }
    } catch (error) {
      Alert.alert('登入失敗', '發生未知錯誤，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Icon name="chatbox-ellipses" size={100} color="#007AFF" />
          <Text style={styles.title}>ChatGPT 助手</Text>
          <Text style={styles.subtitle}>使用 Google 帳號登入以開始使用</Text>
        </View>

        <View style={styles.loginSection}>
          <TouchableOpacity
            style={[styles.googleButton, isLoading && styles.googleButtonDisabled]}
            onPress={handleGoogleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#4285F4" size="small" />
            ) : (
              <>
                <Icon name="logo-google" size={24} color="#4285F4" />
                <Text style={styles.googleButtonText}>使用 Google 登入</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            登入即表示您同意我們的服務條款和隱私政策
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;