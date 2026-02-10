import OnboardingFeaturesScreen from "@/src/screens/OnboardingFeaturesScreen";
import OnboardingScreen from "@/src/screens/OnboardingScreen";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import PagerView from "react-native-pager-view";

const { width } = Dimensions.get("window");

export default function OnboardingRoute() {
  const router = useRouter();
  const pagerRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const goToNextPage = () => {
    if (currentPage === 0) {
      // İlk sayfadan ikinci sayfaya geç
      pagerRef.current?.setPage(1);
    } else {
      // İkinci sayfadan profile setup'a git
      router.push("/profile-setup");
    }
  };

  return (
    <View style={styles.container}>
      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
      >
        {/* Sayfa 1: Tully Karşılama */}
        <View key="1" style={styles.page}>
          <OnboardingScreen
            navigation={{
              navigate: (screen: string) => {
                if (screen === "OnboardingFeatures") {
                  goToNextPage();
                }
              },
            }}
          />
        </View>

        {/* Sayfa 2: Özellikler */}
        <View key="2" style={styles.page}>
          <OnboardingFeaturesScreen
            navigation={{
              navigate: (screen: string) => {
                if (screen === "ProfileSetup") {
                  router.push("/profile-setup");
                }
              },
            }}
          />
        </View>
      </PagerView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pagerView: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
});
