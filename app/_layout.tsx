import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const [isReady, setIsReady] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  // Load fonts
  const [fontsLoaded] = useFonts({
    Nunito: require("../assets/fonts/Nunito-Regular.ttf"),
    NunitoBold: require("../assets/fonts/Nunito-Bold.ttf"),
  });

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const profile = await AsyncStorage.getItem("userProfile");
        setHasProfile(!!profile);
      } catch (error) {
        console.error("Error checking profile:", error);
      } finally {
        setIsReady(true);
      }
    };

    checkProfile();
  }, []);

  useEffect(() => {
    if (fontsLoaded && isReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isReady]);

  useEffect(() => {
    if (!isReady || !fontsLoaded) return;

    const inAuthGroup = segments[0] === "(tabs)";
    const inOnboarding = segments[0] === "onboarding";
    const inProfileSetup = segments[0] === "profile-setup";

    if (!hasProfile && inAuthGroup) {
      // User doesn't have profile, redirect to onboarding
      router.replace("/onboarding/");
    } else if (
      hasProfile &&
      !inAuthGroup &&
      !inOnboarding &&
      !inProfileSetup &&
      segments[0] !== "modal" &&
      segments[0] !== "experiment"
    ) {
      // User has profile, redirect to tabs
      router.replace("/(tabs)");
    }
  }, [isReady, hasProfile, segments, fontsLoaded]);

  if (!isReady || !fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen
          name="onboarding/index"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="profile-setup" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="experiment/[id]" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
