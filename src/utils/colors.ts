/**
 * Tully Design System - Color Palette
 * Matching web version design system
 */

export const colors = {
  // Primary
  primary: "#14B8A6", // Teal

  // Secondary Gradient
  secondary: {
    orange: "#F59E42",
    pink: "#F472B6",
    blue: "#3B82F6",
  },

  // Background
  background: "#F8FEFB", // Light green

  // Text
  text: {
    dark: "#0F172A",
    medium: "#475569",
    light: "#6B7280",
    lighter: "#9CA3AF",
  },

  // Semantic Colors
  success: "#4ADE80",
  warning: "#FBBF24",
  danger: "#FB923C",
  error: "#EF4444",

  // Difficulty Colors
  difficulty: {
    kolay: "#4ADE80", // Green
    orta: "#FBBF24", // Yellow
    zor: "#FB923C", // Orange
    uzman: "#EF4444", // Red
  },

  // Neutral
  white: "#FFFFFF",
  black: "#000000",
  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
  },
};

export const typography = {
  fontFamily: {
    regular: "Nunito",
    bold: "NunitoBold",
    header: "NunitoBold",
    body: "Nunito",
  },
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
  },
  weights: {
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
};

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
};

export const borderRadius = {
  none: 0,
  sm: 4,
  base: 8,
  lg: 12,
  xl: 16,
  "2xl": 20,
  "3xl": 24,
  full: 9999,
};

export const shadows = {
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  base: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 16,
  },
};
