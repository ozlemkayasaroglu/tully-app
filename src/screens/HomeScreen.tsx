/**
 * HomeScreen
 * Main home page with weekly experiment and achievements
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useWeeklyExperiment } from "../hooks/useWeeklyExperiment";
import { colors, spacing, typography } from "../utils/colors";

interface HomeScreenProps {
  navigation: any;
}

const avatarEmojiMap: Record<string, string> = {
  unicorn: "🦄",
  butterfly: "🦋",
  ladybug: "🐞",
  bunny: "🐰",
  cat: "🐱",
  dog: "🐶",
};

const scientists = [
  {
    name: "El-Cezeri",
    quote:
      "Mekanik sanatlar, teorik bilgiden daha üstündür çünkü somut eserler ortaya koyar.",
    info: "Sibernetiğin kurucusu, 50'den fazla makine tasarladı",
  },
  {
    name: "Ada Lovelace",
    quote:
      "Analitik Motor, yalnızca sayıları değil, sembolleri de işleyebilir.",
    info: "Dünyanın ilk bilgisayar programcısı",
  },
  {
    name: "İbn-i Sina",
    quote: "Bilim, insanı şüpheden yakîne, cehaletten bilgiye götüren yoldur.",
    info: "Tıp Kanunu kitabı 600 yıl boyunca Avrupa'da ders kitabı olarak okutuldu",
  },
  {
    name: "Marie Curie",
    quote:
      "Hayatta korkulacak hiçbir şey yok, sadece anlaşılması gereken şeyler var.",
    info: "İki farklı bilim dalında Nobel Ödülü kazanan ilk kişi",
  },
];

type Achievement = {
  id: string;
  icon: string;
  name: string;
  desc: string;
  unlocked: boolean;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [userProfile, setUserProfile] = useState<any>(null);
  const { currentExperiment, progress, loading } = useWeeklyExperiment();
  const [scientistOfTheDay] = useState(
    scientists[Math.floor(Math.random() * scientists.length)],
  );

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await AsyncStorage.getItem("userProfile");
        if (profile) {
          setUserProfile(JSON.parse(profile));
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };

    loadProfile();
  }, []);

  const achievements: Achievement[] = [
    {
      id: "a1",
      icon: "🏅",
      name: "İlk Deney",
      desc: "İlk deneyi tamamla",
      unlocked: progress.totalExperimentsCompleted > 0,
    },
    {
      id: "a2",
      icon: "🔬",
      name: "Meraklı",
      desc: "3 deneyi tamamla",
      unlocked: progress.totalExperimentsCompleted >= 3,
    },
    {
      id: "a3",
      icon: "🌟",
      name: "Hafta Şampiyonu",
      desc: "7 gün üst üste deney yap",
      unlocked: progress.streak >= 7,
    },
    {
      id: "a4",
      icon: "🚀",
      name: "Keşif",
      desc: "5 deneyi tamamla",
      unlocked: progress.totalExperimentsCompleted >= 5,
    },
    {
      id: "a5",
      icon: "📚",
      name: "Bilge",
      desc: "10 deneyi tamamla",
      unlocked: progress.totalExperimentsCompleted >= 10,
    },
    {
      id: "a6",
      icon: "🎉",
      name: "Tamamlayıcı",
      desc: "Tüm haftaları tamamla",
      unlocked: progress.currentWeek >= 12,
    },
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const avatarEmoji =
    userProfile?.avatar || avatarEmojiMap[userProfile?.avatar] || "🔬";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroCard}>
            <Text style={styles.heroAvatar}>{avatarEmoji}</Text>
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>
                Merhaba {userProfile?.nickname || "Bilim Kaşifi"} 👋
              </Text>
              <Text style={styles.heroSubtitle}>
                Bugün keşfetmeye hazır mısın?
              </Text>
            </View>
          </View>
        </View>

        {/* Current Experiment */}
        <View style={styles.section}>
          {loading ? (
            <View style={styles.loadingCard}>
              <Text style={styles.loadingEmoji}>🧪</Text>
              <Text style={styles.loadingText}>Hazırlanıyor...</Text>
            </View>
          ) : currentExperiment ? (
            <View style={styles.experimentCard}>
              <View style={styles.experimentHeader}>
                <View style={styles.weekBadge}>
                  <Text style={styles.weekBadgeText}>
                    Hafta {currentExperiment.weekNumber}
                  </Text>
                </View>
                <View style={styles.difficultyBadge}>
                  <Text style={styles.difficultyBadgeText}>
                    {currentExperiment.difficulty}
                  </Text>
                </View>
              </View>

              <Text style={styles.experimentTitle}>
                {currentExperiment.title}
              </Text>
              <Text style={styles.experimentDescription}>
                {currentExperiment.description}
              </Text>

              <View style={styles.experimentMeta}>
                <Text style={styles.metaText}>
                  ⏱️ {currentExperiment.estimatedTime}
                </Text>
                <Text style={styles.metaText}>
                  ⭐ +{currentExperiment.points} XP
                </Text>
              </View>

              <TouchableOpacity
                style={styles.startButton}
                onPress={() =>
                  navigation.navigate("ExperimentDetail", {
                    experimentId: currentExperiment.id,
                  })
                }
                activeOpacity={0.8}
              >
                <Text style={styles.startButtonText}>Deneye Başla 🚀</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.completedCard}>
              <Text style={styles.completedEmoji}>🎉</Text>
              <Text style={styles.completedText}>
                Tüm deneyleri tamamladın!
              </Text>
            </View>
          )}
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <View style={styles.achievementsCard}>
            <Text style={styles.achievementsTitle}>
              🏆 Başarılar ({unlockedCount}/{achievements.length})
            </Text>
            <View style={styles.achievementsGrid}>
              {achievements.map((achievement) => (
                <View
                  key={achievement.id}
                  style={[
                    styles.achievementItem,
                    achievement.unlocked && styles.achievementUnlocked,
                  ]}
                >
                  <View
                    style={[
                      styles.achievementIconContainer,
                      achievement.unlocked &&
                        styles.achievementIconContainerUnlocked,
                    ]}
                  >
                    <Text
                      style={[
                        styles.achievementIcon,
                        !achievement.unlocked && styles.achievementIconLocked,
                      ]}
                    >
                      {achievement.icon}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.achievementName,
                      !achievement.unlocked && styles.achievementNameLocked,
                    ]}
                  >
                    {achievement.name}
                  </Text>
                  <Text
                    style={[
                      styles.achievementDesc,
                      !achievement.unlocked && styles.achievementDescLocked,
                    ]}
                  >
                    {achievement.desc}
                  </Text>
                  {achievement.unlocked && (
                    <View style={styles.unlockedBadge}>
                      <Text style={styles.unlockedBadgeText}>✓ Kazanıldı</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Scientist of the Day */}
        <View style={styles.section}>
          <View style={styles.scientistCard}>
            <Text style={styles.scientistTitle}>
              Diğer Meraklı Çocuklar Büyüdü ve Neler Yaptı?
            </Text>
            <Text style={styles.scientistName}>{scientistOfTheDay.name}</Text>
            <View style={styles.scientistQuoteBox}>
              <Text style={styles.scientistQuote}>
                "{scientistOfTheDay.quote}"
              </Text>
              <Text style={styles.scientistInfo}>{scientistOfTheDay.info}</Text>
            </View>
          </View>
        </View>

        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  heroSection: {
    padding: spacing[4],
    paddingTop: spacing[6],
  },
  heroCard: {
    backgroundColor: "#E0F7F1",
    borderRadius: 24,
    padding: spacing[5],
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[4],
  },
  heroAvatar: {
    fontSize: 64,
  },
  heroContent: {
    flex: 1,
  },
  heroTitle: {
    fontSize: typography.sizes["2xl"],
    fontWeight: "700",
    fontFamily: typography.fontFamily.bold,
    color: colors.text.dark,
    marginBottom: spacing[1],
  },
  heroSubtitle: {
    fontSize: typography.sizes.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.medium,
  },
  section: {
    paddingHorizontal: spacing[4],
    marginBottom: spacing[4],
  },
  loadingCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: spacing[8],
    alignItems: "center",
  },
  loadingEmoji: {
    fontSize: 48,
    marginBottom: spacing[2],
  },
  loadingText: {
    fontSize: typography.sizes.sm,
    color: colors.text.light,
  },
  experimentCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: spacing[5],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  experimentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing[3],
  },
  weekBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: 12,
  },
  weekBadgeText: {
    color: colors.white,
    fontSize: typography.sizes.xs,
    fontWeight: "700",
  },
  difficultyBadge: {
    backgroundColor: "#D1FAE5",
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: 12,
  },
  difficultyBadgeText: {
    color: "#059669",
    fontSize: typography.sizes.xs,
    fontWeight: "700",
  },
  experimentTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: "700",
    color: colors.text.dark,
    marginBottom: spacing[2],
  },
  experimentDescription: {
    fontSize: typography.sizes.sm,
    color: colors.text.medium,
    lineHeight: 20,
    marginBottom: spacing[4],
  },
  experimentMeta: {
    flexDirection: "row",
    gap: spacing[4],
    marginBottom: spacing[4],
  },
  metaText: {
    fontSize: typography.sizes.sm,
    color: colors.text.light,
  },
  startButton: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    paddingVertical: spacing[4],
    alignItems: "center",
  },
  startButtonText: {
    color: colors.white,
    fontSize: typography.sizes.lg,
    fontWeight: "700",
  },
  completedCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: spacing[8],
    alignItems: "center",
  },
  completedEmoji: {
    fontSize: 56,
    marginBottom: spacing[2],
  },
  completedText: {
    fontSize: typography.sizes.base,
    color: colors.text.light,
  },
  achievementsCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: spacing[5],
  },
  achievementsTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: "700",
    color: colors.text.dark,
    marginBottom: spacing[4],
  },
  achievementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[3],
  },
  achievementItem: {
    width: "30%",
    backgroundColor: colors.gray[50],
    borderRadius: 16,
    padding: spacing[3],
    alignItems: "center",
  },
  achievementUnlocked: {
    backgroundColor: "#FEF3C7",
  },
  achievementIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.gray[100],
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing[2],
  },
  achievementIconContainerUnlocked: {
    backgroundColor: "#FDE68A",
  },
  achievementIcon: {
    fontSize: 28,
  },
  achievementIconLocked: {
    opacity: 0.5,
  },
  achievementName: {
    fontSize: typography.sizes.xs,
    fontWeight: "600",
    color: colors.text.dark,
    textAlign: "center",
    marginBottom: spacing[1],
  },
  achievementNameLocked: {
    color: colors.text.lighter,
  },
  achievementDesc: {
    fontSize: 9,
    color: colors.text.light,
    textAlign: "center",
  },
  achievementDescLocked: {
    color: colors.text.lighter,
  },
  unlockedBadge: {
    backgroundColor: "#D1FAE5",
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 8,
    marginTop: spacing[2],
  },
  unlockedBadgeText: {
    fontSize: 8,
    color: "#059669",
    fontWeight: "600",
  },
  scientistCard: {
    backgroundColor: "#F3E8FF",
    borderRadius: 24,
    padding: spacing[5],
    alignItems: "center",
  },
  scientistTitle: {
    fontSize: typography.sizes.base,
    fontWeight: "700",
    color: colors.text.dark,
    textAlign: "center",
    marginBottom: spacing[2],
  },
  scientistName: {
    fontSize: typography.sizes.lg,
    fontWeight: "700",
    color: "#7C3AED",
    marginBottom: spacing[3],
  },
  scientistQuoteBox: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 16,
    padding: spacing[3],
    borderTopWidth: 1,
    borderTopColor: "#D8B4FE",
  },
  scientistQuote: {
    fontSize: typography.sizes.sm,
    color: colors.text.medium,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: spacing[2],
  },
  scientistInfo: {
    fontSize: typography.sizes.xs,
    color: colors.text.light,
    textAlign: "center",
  },
  spacer: {
    height: spacing[8],
  },
});
