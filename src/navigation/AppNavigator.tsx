// src/navigation/AppNavigator.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EncryptedStorage from 'react-native-encrypted-storage';
import ApiSetupScreen from '../screens/ApiSetup/ApiSetupScreen';
import HomeScreen from '../screens/Home/HomeScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [initialRoute, setInitialRoute] = useState<'ApiSetup' | 'Home'>('ApiSetup');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const key = await EncryptedStorage.getItem('gemini_api_key');
      if (key) {
        setInitialRoute('Home');
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ApiSetup" component={ApiSetupScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
