// src/services/ai/geminiService.ts
import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export const sendMessageToGemini = async (prompt: string, conversationHistory?: string) => {
  const apiKey = await EncryptedStorage.getItem('gemini_api_key');
  if (!apiKey) throw new Error('API key not found');

  const fullPrompt = conversationHistory 
    ? `Previous conversation:\n${conversationHistory}\nUser: ${prompt}\nAssistant:`
    : prompt;

  const response = await axios.post(`${GEMINI_BASE}?key=${apiKey}`, {
    contents: [{ parts: [{ text: fullPrompt }] }]
  });
  return response.data.candidates[0].content.parts[0].text;
};
