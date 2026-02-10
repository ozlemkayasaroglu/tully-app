import ProfileSetupScreen from "@/src/screens/ProfileSetupScreen";
import { useRouter } from "expo-router";

export default function ProfileSetupRoute() {
  const router = useRouter();

  return (
    <ProfileSetupScreen
      navigation={{
        reset: (options: any) => {
          router.replace("/(tabs)");
        },
      }}
    />
  );
}
