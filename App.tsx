/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { Text, StyleSheet, useColorScheme, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatScreen from './src/features/chat/ChatScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '@react-native-vector-icons/ionicons';

const Tab = createBottomTabNavigator();
function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text>設定</Text>
    </View>
  );
}
function VoiceScreen() {
  return (
    <View style={styles.container}>
      <Text>設定</Text>
    </View>
  );
}

function App() {
  // const insets = useSafeAreaInsets();

  return (
    <NavigationContainer>
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
            // height: 60,
            paddingBottom: 8,// + insets.bottom,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
          headerShown: true, // 隱藏頂部標題欄
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
              // height: 90,
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
            tabBarLabel: '設定',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
