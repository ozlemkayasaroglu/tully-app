import HomeScreen from "@/src/screens/HomeScreen";
import { useRouter } from "expo-router";

export default function HomeScreenRoute() {
  const router = useRouter();

  return (
    <HomeScreen
      navigation={{
        replace: (route: string) => {
          router.replace(route);
        },
      }}
    />
  );
}
