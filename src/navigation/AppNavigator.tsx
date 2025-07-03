import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../features/login/LoginScreen';
import MainTabNavigator from '../features/main/MainTabNavigator';
import ChatHistoryScreen from '../features/chatHistory/ChatHistoryScreen';
import ChatScreen from '../features/chat/ChatScreen';

const Stack = createStackNavigator();

const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#007AFF" />
  </View>
);

const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          // login
          <>
            <Stack.Screen name="MainTab" component={MainTabNavigator} />
            <Stack.Screen
              name="ChatHistory"
              component={ChatHistoryScreen}
              options={{
                headerShown: true,
                headerTitle: '歷史訊息',
                headerBackTitle: '',
                headerTintColor: '#2A2D38',
                headerTitleStyle: {
                  fontSize: 16,
                },
              }}/>
          </>
        ) : (
          // not login
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
});

export default AppNavigator;