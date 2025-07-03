import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatScreen from '../../features/chat/ChatScreen';
import VoiceScreen from '../../features/voice/VoiceScreen';
import Icon from '@react-native-vector-icons/ionicons';
import SettingsScreen from '../settings/SettingsScreen';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Chat') {
            iconName = "chatbox-ellipses-outline";
          } else if (route.name === 'Voice') {
            iconName = "mic-outline";
          } else if (route.name === 'Settings') {
            iconName = "settings";
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#E5E5E5',
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: true,
      })}
    >
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{
          tabBarLabel: 'Chat',
          headerShown: true,
          headerTitle: 'ChatGPT 對話',
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontSize: 16,
          },
        }}
      />
      <Tab.Screen 
        name="Voice" 
        component={VoiceScreen}
        options={{
          tabBarLabel: 'Voice',
          headerShown: true,
          headerTitle: 'AI 語音對話',
          headerStyle: {
            backgroundColor: '#059669',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontSize: 16,
          },
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          headerTitle: '設定',
          headerTintColor: '#2A2D38',
          headerTitleStyle: {
            fontSize: 16,
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;