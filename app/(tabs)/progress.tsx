import ProgressScreen from "@/src/screens/ProgressScreen";
import { useRouter } from "expo-router";

export default function ProgressTab() {
  const router = useRouter();

  return (
    <ProgressScreen
      navigation={{
        navigate: (screen: string, params?: any) => {
          // Add navigation logic if needed
        },
      }}
    />
  );
}
