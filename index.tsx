import { registerRootComponent } from "expo";
import { ExpoRoot } from "expo-router";

// Expo Router routes from ./app directory
// Default entry point for Expo
export function App() {
  return <ExpoRoot />;
}

registerRootComponent(App);
