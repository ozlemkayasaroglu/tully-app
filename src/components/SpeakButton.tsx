/**
 * SpeakButton Component
 * Minimal button to trigger text-to-speech for content
 */

import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface SpeakButtonProps {
  text: string;
  onSpeak: (text: string) => void;
  style?: any;
  size?: "small" | "medium" | "large";
}

export const SpeakButton: React.FC<SpeakButtonProps> = ({
  text,
  onSpeak,
  style,
  size = "small",
}) => {
  const sizeStyles = {
    small: { width: 24, height: 24, fontSize: 12 },
    medium: { width: 32, height: 32, fontSize: 16 },
    large: { width: 40, height: 40, fontSize: 20 },
  };

  const currentSize = sizeStyles[size];

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          width: currentSize.width,
          height: currentSize.height,
          borderRadius: currentSize.width / 2,
        },
        style,
      ]}
      onPress={() => onSpeak(text)}
      activeOpacity={0.6}
    >
      <Text style={[styles.icon, { fontSize: currentSize.fontSize }]}>🔊</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "rgba(20, 184, 166, 0.08)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(20, 184, 166, 0.15)",
  },
  icon: {
    opacity: 0.6,
  },
});
