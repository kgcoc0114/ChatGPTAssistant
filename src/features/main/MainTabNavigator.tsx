import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatScreen from '../../features/chat/ChatScreen';
import VoiceScreen from '../../features/voice/VoiceScreen';
import Icon from '@react-native-vector-icons/ionicons';
import { useAuth } from '../../context/AuthContext';
import { styles } from './MainTabNavStyles';

const Tab = createBottomTabNavigator();

function SettingsScreen() {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <Icon name="person-circle" size={80} color="#007AFF" />
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}>登出</Text>
      </TouchableOpacity>
    </View>
  );
}

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
            fontWeight: 'bold',
            fontSize: 18,
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
            fontWeight: 'bold',
            fontSize: 18,
          },
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          headerTitle: '設定',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;