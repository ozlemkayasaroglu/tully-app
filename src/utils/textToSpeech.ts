/**
 * Text-to-Speech Utility
 * Handles voice reading for younger age groups (4-5, 6-7)
 * Cross-platform: expo-speech for native, Web Speech API for web
 */

import * as Speech from "expo-speech";
import { Platform } from "react-native";

declare const window: { speechSynthesis?: any; SpeechSynthesisUtterance?: any };

let ttsInitialized = false;

// Initialize TTS
export const initializeTTS = async () => {
  if (ttsInitialized) return;

  try {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        ttsInitialized = true;
      }
    } else {
      await Speech.getAvailableVoicesAsync();
      ttsInitialized = true;
    }
  } catch (error) {
    console.error("Error initializing TTS:", error);
  }
};

// Speak text
export const speak = async (text: string) => {
  try {
    if (!ttsInitialized) {
      await initializeTTS();
    }

    if (Platform.OS === "web") {
      if (typeof window !== "undefined" && window.speechSynthesis && window.SpeechSynthesisUtterance) {
        const utterance = new window.SpeechSynthesisUtterance(text);
        utterance.lang = "tr-TR";
        utterance.rate = 0.7;
        utterance.pitch = 1.1;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      }
    } else {
      Speech.speak(text, {
        language: "tr-TR",
        pitch: 1.1,
        rate: 0.7,
      });
    }
  } catch (error) {
    console.error("Error speaking text:", error);
  }
};

// Stop speaking
export const stopSpeaking = () => {
  try {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    } else {
      Speech.stop();
    }
  } catch (error) {
    // Silent fail
  }
};

// Check if age group needs TTS (4-5, 6-7)
export const shouldUseTTS = (ageGroup?: string): boolean => {
  if (!ageGroup) return false;
  return ageGroup.includes("4-5") || ageGroup.includes("6-7");
};
