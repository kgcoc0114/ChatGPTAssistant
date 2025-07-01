/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { Text, StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Buffer } from 'buffer';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

if (typeof global.Buffer === 'undefined') {
  global.Buffer = Buffer;
}

const Tab = createBottomTabNavigator();
function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text>設定</Text>
    </View>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppNavigator/>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
