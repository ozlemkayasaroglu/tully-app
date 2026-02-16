import ProfileSetupScreen from "@/src/screens/ProfileSetupScreen";
import { useRouter } from "expo-router";

export default function ProfileSetupRoute() {
  const router = useRouter();

  return (
    <ProfileSetupScreen
      navigation={{
        replace: (route: string) => {
          router.replace(route);
        },
        navigate: (route: string) => {
          router.navigate(route);
        },
        push: (route: string) => {
          router.push(route);
        },
      }}
    />
  );
}
