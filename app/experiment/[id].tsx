import ExperimentDetailScreen from "@/src/screens/ExperimentDetailScreen";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function ExperimentDetailRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  return (
    <ExperimentDetailScreen
      navigation={{
        goBack: () => router.back(),
        navigate: (screen: string) => {
          if (screen === "Home") {
            router.replace("/(tabs)");
          }
        },
      }}
      route={{
        params: {
          experimentId: id,
        },
      }}
    />
  );
}
