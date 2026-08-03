import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';

export const ApiSetupScreen = ({ navigation }: any) => {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateAndSaveKey = async () => {
    if (!apiKey.trim()) {
      Alert.alert('Error', 'Please enter a valid Gemini API Key.');
      return;
    }

    setIsLoading(true);
    try {
      // Basic validation: ping the Gemini API to verify the key works
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: "Hello" }] }] })
      });

      if (response.ok) {
        // Store securely on device
        await EncryptedStorage.setItem('GEMINI_API_KEY', apiKey);
        Alert.alert('Success', 'API Key validated and stored securely!');
        navigation.replace('Home'); // Move to Home screen
      } else {
        Alert.alert('Invalid Key', 'Could not validate the API key. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error or secure storage failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.glassCard}>
        <Text style={styles.title}>Initialize AlphaCore</Text>
        <Text style={styles.subtitle}>Enter your Gemini API Key to activate AI features. The key is encrypted and stored locally.</Text>
        
        <TextInput
          style={styles.input}
          placeholder="AIzaSy..."
          placeholderTextColor="#888"
          secureTextEntry
          value={apiKey}
          onChangeText={setApiKey}
        />
        
        <TouchableOpacity style={styles.button} onPress={validateAndSaveKey} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.buttonText}>ACTIVATE AI</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a', // Deep dark theme
    justifyContent: 'center',
    padding: 20,
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // Glassmorphism effect
    borderRadius: 20,
    padding: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    color: '#00e5ff', // Iron Man Jarvis/Friday cyan accent
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 20,
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: '#fff',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#00e5ff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#00e5ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1.5,
  },
});
