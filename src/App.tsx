/**
 * Tully - Mobile Science Experiment App
 * Root App Component with Bottom Tab Navigation
 */

import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "./utils/colors";

// Screens
import OnboardingScreen from "./screens/OnboardingScreen";
import ProfileSetupScreen from "./screens/ProfileSetupScreen";
import HomeScreen from "./screens/HomeScreen";
import ExperimentsScreen from "./screens/ExperimentsScreen";
import ExperimentDetailScreen from "./screens/ExperimentDetailScreen";
import ProgressScreen from "./screens/ProgressScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Experiments") {
            iconName = focused ? "flask" : "flask-outline";
          } else if (route.name === "Progress") {
            iconName = focused ? "trending-up" : "trending-up";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.light,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.gray[200],
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 4,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Ana Sayfa" }}
      />
      <Tab.Screen
        name="Experiments"
        component={ExperimentsScreen}
        options={{ title: "Deneyler" }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{ title: "İlerleme" }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [profileCompleted, setProfileCompleted] = useState(false);

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const profile = await AsyncStorage.getItem("userProfile");
        setProfileCompleted(!!profile);
      } catch (error) {
        console.error("Error checking profile:", error);
      } finally {
        setIsReady(true);
      }
    };

    checkProfile();
  }, []);

  if (!isReady) {
    return null; // Or a splash screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animationEnabled: true,
        }}
      >
        {!profileCompleted ? (
          <>
            <Stack.Screen
              name="Onboarding"
              component={OnboardingScreen}
              options={{ animationEnabled: false }}
            />
            <Stack.Screen
              name="ProfileSetup"
              component={ProfileSetupScreen}
              options={{ animationEnabled: false }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen
              name="ExperimentDetail"
              component={ExperimentDetailScreen}
              options={{
                animationEnabled: true,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
