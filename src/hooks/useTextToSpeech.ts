/**
 * useTextToSpeech Hook
 * Custom hook for managing TTS functionality
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  initializeTTS,
  shouldUseTTS,
  speak,
  stopSpeaking,
} from "../utils/textToSpeech";

export const useTextToSpeech = () => {
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkTTSStatus = async () => {
      try {
        const profile = await AsyncStorage.getItem("userProfile");
        if (profile) {
          const userProfile = JSON.parse(profile);
          const needsTTS = shouldUseTTS(userProfile.ageGroup);
          setTtsEnabled(needsTTS);

          if (needsTTS) {
            await initializeTTS();
          }
        }
      } catch (error) {
        console.error("Error checking TTS status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkTTSStatus();
  }, []);

  const speakText = (text: string) => {
    if (ttsEnabled) {
      speak(text);
    }
  };

  const stopText = () => {
    stopSpeaking();
  };

  return {
    ttsEnabled,
    isLoading,
    speakText,
    stopText,
  };
};
