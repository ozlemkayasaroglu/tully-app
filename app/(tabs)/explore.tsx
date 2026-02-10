import ExperimentsScreen from "@/src/screens/ExperimentsScreen";
import { useRouter } from "expo-router";

export default function ExploreTab() {
  const router = useRouter();

  return (
    <ExperimentsScreen
      navigation={{
        navigate: (screen: string, params?: any) => {
          if (screen === "ExperimentDetail") {
            router.push(`/experiment/${params?.experimentId}`);
          }
        },
      }}
    />
  );
}
