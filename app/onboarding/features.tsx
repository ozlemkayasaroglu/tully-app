// app/onboarding/features.tsx (Sayfa 2 - Özellikler)
import OnboardingFeaturesScreen from "@/src/screens/OnboardingFeaturesScreen";
import { useRouter } from "expo-router";

export default function OnboardingFeaturesRoute() {
  const router = useRouter();

  return (
    <OnboardingFeaturesScreen
      navigation={{
        navigate: (screen: string) => {
          if (screen === "ProfileSetup") {
            router.push("/profile-setup");
          }
        },
        goBack: () => {
          router.back();
        },
      }}
    />
  );
}
