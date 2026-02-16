/**
 * HomeScreen
 * Main home page with weekly experiment and achievements
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SpeakButton } from "../components/SpeakButton";
import { useTextToSpeech } from "../hooks/useTextToSpeech";
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
  const { currentExperiment, allExperiments, progress, loading } =
    useWeeklyExperiment();
  const { ttsEnabled, speakText } = useTextToSpeech();
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
      name: "Azimli",
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
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>
                Merhaba {userProfile?.nickname || "Bilim Kaşifi"}
              </Text>
              {ttsEnabled && (
                <SpeakButton
                  text={`Merhaba ${userProfile?.nickname || "Bilim Kaşifi"}. Bugün keşfetmeye hazır mısın?`}
                  onSpeak={speakText}
                  size="medium"
                  style={styles.heroCardSpeakButton}
                />
              )}
              <Text style={styles.heroSubtitle}>
                Bugün keşfetmeye hazır mısın?
              </Text>
            </View>
            <Text style={styles.heroAvatar}>{avatarEmoji}</Text>
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
            <>
              <View style={styles.experimentCard}>
                <Text style={styles.experimentTitle}>
                  {currentExperiment.title}
                </Text>
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

                <View style={styles.experimentDescriptionRow}>
                  <Text style={styles.experimentDescription}>
                    {currentExperiment.description}
                  </Text>
                  {ttsEnabled && (
                    <SpeakButton
                      text={`${currentExperiment.title}. ${currentExperiment.description}`}
                      onSpeak={speakText}
                      size="small"
                    />
                  )}
                </View>

                <View style={styles.experimentMeta}>
                  <Text style={styles.metaText}>
                    ⏱️ {currentExperiment.estimatedTime}
                    {ttsEnabled && (
                      <SpeakButton
                        text={`Başarılar. ${unlockedCount} tane ${achievements.length} başarıdan kazanıldı`}
                        onSpeak={speakText}
                        size="small"
                      />
                    )}
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
                  <View style={styles.startButtonContent}>
                    <Text style={styles.startButtonText}>Deneye Başla 🚀</Text>
                    {ttsEnabled && (
                      <SpeakButton
                        text={`Deneye başla. ${currentExperiment.title}. ${currentExperiment.description}`}
                        onSpeak={speakText}
                        size="small"
                        style={styles.startButtonTts}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              </View>

              {/* Next Experiments Preview */}
              {!loading && allExperiments.length > 0 && (
                <View style={styles.nextExperimentsSection}>
                  <Text style={styles.nextExperimentsTitle}>
                    Sırada Neler Var?
                  </Text>
                  {allExperiments
                    .filter((exp) => exp.status !== "completed")
                    .slice(0, 3)
                    .map((exp, index) => {
                    const statusColor =
                      exp.status === "available"
                        ? "#FF6B9D"
                        : exp.status === "in_progress"
                          ? "#4ECDC4"
                          : "#999";
                    const statusText =
                      exp.status === "available"
                        ? "Başlayabilirsin"
                        : exp.status === "in_progress"
                          ? "Devam et"
                          : exp.status === "completed"
                            ? "Tamamlandı ✓"
                            : "Kilitli 🔒";

                    return (
                      <TouchableOpacity
                        key={exp.id}
                        style={[
                          styles.nextExperimentCard,
                          exp.status === "locked" &&
                            styles.nextExperimentCardLocked,
                        ]}
                        onPress={() => {
                          if (exp.status !== "locked") {
                            navigation.navigate("ExperimentDetail", {
                              experimentId: exp.id,
                            });
                          }
                        }}
                        activeOpacity={exp.status === "locked" ? 1 : 0.7}
                      >
                        <View style={styles.nextExpIndex}>
                          <Text style={styles.nextExpIndexText}>
                            {index + 1}
                          </Text>
                        </View>
                        <View style={styles.nextExpContent}>
                          <Text style={styles.nextExpTitle}>{exp.title}</Text>
                          <View style={styles.nextExpFooter}>
                            <Text style={styles.nextExpDifficulty}>
                              {exp.difficulty}
                            </Text>
                            <View
                              style={[
                                styles.nextExpStatus,
                                { backgroundColor: statusColor },
                              ]}
                            >
                              <Text style={styles.nextExpStatusText}>
                                {statusText}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <Text style={styles.nextExpPoints}>
                          +{exp.points}⭐
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </>
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
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.achievementsTitle}>
                🏆 Başarılar ({unlockedCount}/{achievements.length})
              </Text>
              {ttsEnabled && (
                <SpeakButton
                  text={`Başarılar. ${unlockedCount} tane ${achievements.length} başarıdan kazanıldı`}
                  onSpeak={speakText}
                  size="small"
                />
              )}
            </View>
            <View style={styles.achievementsGrid}>
              {achievements.map((achievement) => (
                <View
                  key={achievement.id}
                  style={[
                    styles.achievementItem,
                    achievement.unlocked && styles.achievementUnlocked,
                  ]}
                >
                  {ttsEnabled && (
                    <SpeakButton
                      text={`${achievement.name}. ${achievement.desc}`}
                      onSpeak={speakText}
                      size="small"
                      style={styles.achievementTtsButton}
                    />
                  )}
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
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>👨‍🔬 Bilim İnsanı Olarak Tanı</Text>
            {ttsEnabled && (
              <SpeakButton
                text={`Bilim İnsanı Olarak Tanı. ${scientistOfTheDay.name}. ${scientistOfTheDay.quote}. ${scientistOfTheDay.info}`}
                onSpeak={speakText}
                size="small"
              />
            )}
          </View>
          <View style={styles.scientistCard}>
            <Text style={styles.scientistName}>{scientistOfTheDay.name}</Text>
            <View style={styles.scientistQuoteBox}>
              <Text style={styles.scientistQuote}>
                "{scientistOfTheDay.quote}"
              </Text>
            </View>
            <View style={styles.scientistInfoBox}>
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
    position: "relative",
  },
  heroCardSpeakButton: {
    position: "absolute",
    top: 30,
    right: 55,
  },
  heroAvatar: {
    fontSize: 64,
  },
  heroContent: {
    flex: 1,
  },
  heroTitle: {
    flex: 1,
    fontSize: typography.sizes["2xl"],
    fontWeight: "700",
    fontFamily: typography.fontFamily.bold,
    color: colors.text.dark,
    marginBottom: spacing[1],
  },
  heroSubtitle: {
    flex: 1,
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
    backgroundColor: "#E0F7F4",
    borderRadius: 24,
    padding: spacing[5],
    borderWidth: 2,
    borderColor: "#4ECDC4",
  },
  experimentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  weekBadge: {
    backgroundColor: colors.secondary.blue,
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
    backgroundColor: "#FFD93D",
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: 12,
  },
  difficultyBadgeText: {
    color: "#8B6F47",
    fontSize: typography.sizes.xs,
    fontWeight: "700",
  },
  experimentTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing[2],
  },
  experimentTitle: {
    flex: 1,
    fontSize: typography.sizes["2xl"],
    fontWeight: "700",
    color: colors.text.dark,
    fontFamily: typography.fontFamily.bold,
    marginBottom: spacing[2],
  },
  experimentDescriptionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  experimentDescription: {
    flex: 1,
    fontSize: typography.sizes.sm,
    color: colors.text.medium,
    lineHeight: 20,
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
    paddingHorizontal: spacing[4],
    alignItems: "center",
  },
  startButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[2],
  },
  startButtonText: {
    color: colors.white,
    fontSize: typography.sizes.lg,
    fontWeight: "700",
  },
  startButtonTts: {
    marginLeft: spacing[2],
    backgroundColor: "rgba(194, 200, 200, 0.56)",
    borderColor: colors.primary,
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
    backgroundColor: "#FFF9D0",
    borderRadius: 24,
    padding: spacing[5],
    borderWidth: 2,
    borderColor: "#FFD93D",
  },
  achievementsTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing[4],
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing[3],
  },
  achievementsTitle: {
    flex: 1,
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
    position: "relative",
  },
  achievementUnlocked: {
    backgroundColor: "#FEF3C7",
  },
  achievementTtsButton: {
    position: "absolute",
    top: 8,
    right: 8,
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
    backgroundColor: "#FFD4E5",
    borderRadius: 20,
    padding: spacing[5],
    borderWidth: 2,
    borderColor: "#FF6B9D",
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing[4],
  },
  sectionTitle: {
    flex: 1,
    fontSize: typography.sizes.lg,
    fontWeight: "700",
    color: colors.text.dark,
  },
  scientistName: {
    fontSize: typography.sizes.xl,
    fontWeight: "700",
    color: colors.text.pinky,
    marginBottom: spacing[3],
    textAlign: "center",
  },
  scientistQuoteBox: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 16,
    padding: spacing[4],
    marginBottom: spacing[3],
  },
  scientistQuote: {
    fontSize: typography.sizes.sm,
    color: colors.text.medium,
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 22,
  },
  scientistInfoBox: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 12,
    padding: spacing[3],
  },
  scientistInfo: {
    fontSize: typography.sizes.xs,
    color: colors.text.dark,
    textAlign: "center",
    lineHeight: 18,
  },
  nextExperimentsSection: {
    paddingTop: spacing[4],
  },
  debugSection: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    backgroundColor: "#FFE0E0",
    borderRadius: 12,
    marginBottom: spacing[2],
  },
  debugText: {
    fontSize: typography.sizes.xs,
    color: "#CC0000",
    fontWeight: "600",
  },
  nextExperimentsTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: "700",
    color: colors.text.dark,
    marginBottom: spacing[3],
  },
  nextExperimentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0F7F4",
    borderRadius: 16,
    padding: spacing[3],
    marginBottom: spacing[2],
    borderWidth: 2,
    borderColor: "#4ECDC4",
    gap: spacing[3],
  },
  nextExperimentCardLocked: {
    backgroundColor: "#F3F4F6",
    borderColor: "#D1D5DB",
    opacity: 0.6,
  },
  nextExpIndex: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FF6B9D",
    justifyContent: "center",
    alignItems: "center",
  },
  nextExpIndexText: {
    color: colors.white,
    fontSize: typography.sizes.lg,
    fontWeight: "700",
  },
  nextExpContent: {
    flex: 1,
  },
  nextExpTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: "700",
    color: colors.text.dark,
    marginBottom: spacing[1],
  },
  nextExpFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
  },
  nextExpDifficulty: {
    fontSize: typography.sizes.xs,
    color: colors.text.medium,
    textTransform: "capitalize",
  },
  nextExpStatus: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 8,
  },
  nextExpStatusText: {
    fontSize: typography.sizes.xs,
    fontWeight: "600",
    color: colors.white,
  },
  nextExpPoints: {
    fontSize: typography.sizes.sm,
    fontWeight: "700",
    color: colors.text.dark,
    minWidth: 50,
    textAlign: "right",
  },
  spacer: {
    height: spacing[8],
  },
});
