import HomeScreen from "@/src/screens/HomeScreen";
import { useRouter } from "expo-router";

export default function HomeTab() {
  const router = useRouter();

  return (
    <HomeScreen
      navigation={{
        navigate: (screen: string, params?: any) => {
          if (screen === "ExperimentDetail") {
            router.push(`/experiment/${params?.experimentId}`);
          } else if (screen === "Experiments") {
            router.push("/(tabs)/explore");
          } else if (screen === "Progress") {
            router.push("/(tabs)/progress");
          }
        },
        replace: (route: string) => {
          router.replace(route);
        },
      }}
    />
  );
}
