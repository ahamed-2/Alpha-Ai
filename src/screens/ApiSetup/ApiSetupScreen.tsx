import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';

const ApiSetupScreen = ({ navigation }: any) => {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);

  const validateAndSave = async () => {
    if (!apiKey.trim()) {
      Alert.alert('Error', 'Please enter your Gemini API key');
      return;
    }
    setLoading(true);
    try {
      // Gemini API validation endpoint (use a simple text generation request)
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          contents: [{ parts: [{ text: 'Hello' }] }]
        }
      );
      if (response.data) {
        await EncryptedStorage.setItem('gemini_api_key', apiKey);
        Alert.alert('Success', 'API key verified and saved securely.', [
          { text: 'Continue', onPress: () => navigation.replace('Home') }
        ]);
      }
    } catch (error) {
      Alert.alert('Invalid Key', 'Could not validate API key. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Gemini API Key</Text>
      <Text style={styles.subtitle}>Your key is stored securely on device and never shared.</Text>
      <TextInput
        style={styles.input}
        placeholder="AIzaSy..."
        placeholderTextColor="#888"
        value={apiKey}
        onChangeText={setApiKey}
        secureTextEntry
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={validateAndSave} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Validate & Save</Text>}
      </TouchableOpacity>
    </View>
  );
};

// Styles (Material Dark Theme, Glassmorphism effect can be added later)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#BB86FC',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#A0A0A0',
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#333',
  },
  button: {
    backgroundColor: '#BB86FC',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#121212',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ApiSetupScreen;
