/**
 * ProgressScreen
 * Shows user progress, achievements, and stats
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useWeeklyExperiment } from "../hooks/useWeeklyExperiment";
import { categoryIcons } from "../types/experimentTypes";
import { colors, spacing, typography } from "../utils/colors";

interface ProgressScreenProps {
  navigation: any;
}

const achievements = [
  {
    id: 1,
    icon: "🔬",
    name: "İlk Keşif",
    desc: "1 deney tamamla",
    requirement: (progress: any) => progress.totalExperimentsCompleted >= 1,
  },
  {
    id: 2,
    icon: "🧸",
    name: "Meraklı Minik",
    desc: "2 deney tamamla",
    requirement: (progress: any) => progress.totalExperimentsCompleted >= 2,
  },
  {
    id: 3,
    icon: "🦋",
    name: "Doğa Kaşifi",
    desc: "4 deney tamamla",
    requirement: (progress: any) => progress.totalExperimentsCompleted >= 4,
  },
  {
    id: 4,
    icon: "🧪",
    name: "Deneyci Çocuk",
    desc: "6 deney tamamla",
    requirement: (progress: any) => progress.totalExperimentsCompleted >= 6,
  },
  {
    id: 5,
    icon: "🌟",
    name: "Yıldız Bilimci",
    desc: "8 deney tamamla",
    requirement: (progress: any) => progress.totalExperimentsCompleted >= 8,
  },
  {
    id: 6,
    icon: "🏅",
    name: "Başarı Rozeti",
    desc: "10 deney tamamla",
    requirement: (progress: any) => progress.totalExperimentsCompleted >= 10,
  },
  {
    id: 7,
    icon: "🔥",
    name: "Seri Kaşif",
    desc: "3 hafta seri yap",
    requirement: (progress: any) => progress.streak >= 3,
  },
  {
    id: 8,
    icon: "⚡",
    name: "Hızlı Başlangıç",
    desc: "İlk haftanda 2 deney",
    requirement: (progress: any) =>
      progress.totalExperimentsCompleted >= 2 && progress.streak >= 1,
  },
  {
    id: 9,
    icon: "💡",
    name: "Zihin Açıcı",
    desc: "300 XP kazan",
    requirement: (progress: any) => progress.totalPoints >= 300,
  },
  {
    id: 10,
    icon: "🎯",
    name: "Hedefe Yakın",
    desc: "%50 tamamlama",
    requirement: (progress: any, completionRate: number) =>
      completionRate >= 50,
  },
  {
    id: 11,
    icon: "🚀",
    name: "Roket Çocuk",
    desc: "600 XP kazan",
    requirement: (progress: any) => progress.totalPoints >= 600,
  },
  {
    id: 12,
    icon: "👑",
    name: "Bilim Kahramanı",
    desc: "12 deney tamamla",
    requirement: (progress: any) => progress.totalExperimentsCompleted >= 12,
  },
];

export default function ProgressScreen({ navigation }: ProgressScreenProps) {
  const { progress, allExperiments, loading } = useWeeklyExperiment();
  const [ageGroup, setAgeGroup] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await AsyncStorage.getItem("userProfile");
        if (profile) {
          const parsed = JSON.parse(profile);
          setAgeGroup(parsed.ageGroup || null);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingEmoji}>🧪</Text>
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const level = Math.floor(progress.totalPoints / 100) + 1;
  const currentLevelXP = progress.totalPoints % 100;
  const completionRate =
    allExperiments.length === 0
      ? 0
      : (progress.totalExperimentsCompleted / allExperiments.length) * 100;

  const ageCopy =
    ageGroup === "4-5 yaş" || ageGroup === "6-7 yaş"
      ? "Harika gidiyorsun! Her deney senin için eğlenceli bir keşif."
      : ageGroup === "8-9 yaş"
        ? "Bilim yolculuğun hızla ilerliyor! Yeni deneyler seni bekliyor."
        : "Bilim becerilerin çok gelişti! Daha zorlu deneylere hazır ol.";

  const achievementsWithStatus = achievements.map((achievement) => ({
    ...achievement,
    unlocked: achievement.requirement(progress, completionRate),
  }));

  const unlockedCount = achievementsWithStatus.filter((a) => a.unlocked).length;

  const lastCompleted = [...allExperiments]
    .reverse()
    .find((exp) => exp.status === "completed");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Progress Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroCard}>
            <Text style={styles.heroTitle}>İlerleme 📊</Text>
            <Text style={styles.heroSubtitle}>{ageCopy}</Text>

            {/* XP Card */}
            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>XP</Text>
                <Text style={styles.progressValue}>
                  {progress.totalPoints} XP
                </Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${currentLevelXP}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressFooter}>
                Seviye {level + 1} için {100 - currentLevelXP} XP daha 🚀
              </Text>
            </View>

            {/* Completion Card */}
            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Deney Tamamlama</Text>
                <Text style={styles.progressValue}>
                  {progress.totalExperimentsCompleted} / {allExperiments.length}
                </Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${completionRate}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressFooter}>
                Devam et! Yeni deneyler seni bekliyor 🚀
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, styles.statCardBlue]}>
              <Text style={styles.statEmoji}>📊</Text>
              <Text style={styles.statValue}>{level}</Text>
              <Text style={styles.statLabel}>Seviye</Text>
            </View>
            <View style={[styles.statCard, styles.statCardGreen]}>
              <Text style={styles.statEmoji}>✅</Text>
              <Text style={styles.statValue}>
                {progress.totalExperimentsCompleted}
              </Text>
              <Text style={styles.statLabel}>Deney</Text>
            </View>
            <View style={[styles.statCard, styles.statCardOrange]}>
              <Text style={styles.statEmoji}>⭐</Text>
              <Text style={styles.statValue}>{progress.totalPoints}</Text>
              <Text style={styles.statLabel}>Toplam XP</Text>
            </View>
            <View style={[styles.statCard, styles.statCardPurple]}>
              <Text style={styles.statEmoji}>🎖️</Text>
              <Text style={styles.statValue}>{unlockedCount}</Text>
              <Text style={styles.statLabel}>Rozet</Text>
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <View style={styles.achievementsCard}>
            <Text style={styles.sectionTitle}>
              🏆 Başarılar ({unlockedCount}/{achievements.length})
            </Text>
            <View style={styles.achievementsGrid}>
              {achievementsWithStatus.map((achievement) => (
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
                    <Text style={styles.achievementIcon}>
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

        {/* Parent Summary */}
        <View style={styles.section}>
          <View style={styles.parentCard}>
            <Text style={styles.parentTitle}>👨‍👩‍👧 Bugün Ne Öğrendi?</Text>

            {/* Last Completed Experiment */}
            {lastCompleted && (
              <View style={styles.lastCompletedCard}>
                <Text style={styles.categoryIcon}>
                  {categoryIcons[
                    lastCompleted.category as keyof typeof categoryIcons
                  ] || "🔬"}
                </Text>
                <View style={styles.lastCompletedContent}>
                  <Text style={styles.lastCompletedTitle}>
                    Son Tamamlanan: {lastCompleted.title}
                  </Text>
                  <Text style={styles.lastCompletedDesc} numberOfLines={2}>
                    {lastCompleted.description}
                  </Text>
                </View>
              </View>
            )}

            {/* Recent Experiments */}
            {allExperiments.length > 0 ? (
              <View style={styles.recentExperiments}>
                {allExperiments.slice(-3).map((exp, idx) => (
                  <View key={exp.id} style={styles.recentExperimentCard}>
                    <View style={styles.recentExperimentContent}>
                      <Text style={styles.recentExperimentTitle}>
                        {idx + 1}. {exp.title}
                      </Text>
                      <Text
                        style={styles.recentExperimentDesc}
                        numberOfLines={2}
                      >
                        {exp.description}
                      </Text>
                      <View style={styles.recentExperimentMeta}>
                        <View
                          style={[
                            styles.statusBadge,
                            exp.status === "completed" &&
                              styles.statusCompleted,
                            exp.status === "in_progress" &&
                              styles.statusInProgress,
                            exp.status === "available" &&
                              styles.statusAvailable,
                            exp.status === "locked" && styles.statusLocked,
                          ]}
                        >
                          <Text style={styles.statusText}>
                            {exp.status === "completed"
                              ? "✅ Tamamlandı"
                              : exp.status === "in_progress"
                                ? "⏳ Devam Ediyor"
                                : exp.status === "available"
                                  ? "🕒 Başlamadı"
                                  : "🔒 Kilitli"}
                          </Text>
                        </View>
                        {exp.points && (
                          <View style={styles.pointsBadge}>
                            <Text style={styles.pointsText}>
                              +{exp.points} XP
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <Text style={styles.recentExperimentIcon}>
                      {categoryIcons[
                        exp.category as keyof typeof categoryIcons
                      ] || "🔬"}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>🔬</Text>
                <Text style={styles.emptyText}>
                  Henüz deney bulunmuyor. İlk deneye başla!
                </Text>
              </View>
            )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingEmoji: {
    fontSize: 56,
    marginBottom: spacing[3],
  },
  loadingText: {
    fontSize: typography.sizes.base,
    color: colors.text.light,
  },
  heroSection: {
    padding: spacing[4],
    paddingTop: spacing[6],
  },
  heroCard: {
    backgroundColor: "#E0F7F1",
    borderRadius: 24,
    padding: spacing[5],
  },
  heroTitle: {
    fontSize: typography.sizes["2xl"],
    fontWeight: "700",
    color: colors.text.dark,
    marginBottom: spacing[2],
  },
  heroSubtitle: {
    fontSize: typography.sizes.base,
    color: colors.text.medium,
    marginBottom: spacing[5],
    lineHeight: 22,
  },
  progressCard: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 16,
    padding: spacing[4],
    marginBottom: spacing[4],
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing[2],
  },
  progressLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: "600",
    color: colors.text.dark,
  },
  progressValue: {
    fontSize: typography.sizes.sm,
    fontWeight: "600",
    color: colors.primary,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: colors.gray[200],
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: spacing[2],
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.primary,
  },
  progressFooter: {
    fontSize: typography.sizes.xs,
    color: colors.text.light,
    textAlign: "center",
  },
  statsSection: {
    paddingHorizontal: spacing[4],
    marginBottom: spacing[4],
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[3],
  },
  statCard: {
    width: "48%",
    borderRadius: 16,
    padding: spacing[4],
    alignItems: "center",
  },
  statCardBlue: {
    backgroundColor: "#DBEAFE",
  },
  statCardGreen: {
    backgroundColor: "#D1FAE5",
  },
  statCardOrange: {
    backgroundColor: "#FFEDD5",
  },
  statCardPurple: {
    backgroundColor: "#F3E8FF",
  },
  statEmoji: {
    fontSize: 32,
    marginBottom: spacing[2],
  },
  statValue: {
    fontSize: typography.sizes["2xl"],
    fontWeight: "700",
    color: colors.text.dark,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    color: colors.text.medium,
  },
  section: {
    paddingHorizontal: spacing[4],
    marginBottom: spacing[4],
  },
  achievementsCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: spacing[5],
  },
  sectionTitle: {
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
  parentCard: {
    backgroundColor: "#F3E8FF",
    borderRadius: 24,
    padding: spacing[5],
  },
  parentTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: "700",
    color: colors.text.dark,
    marginBottom: spacing[4],
  },
  lastCompletedCard: {
    backgroundColor: "rgba(209, 250, 229, 0.6)",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 16,
    padding: spacing[4],
    flexDirection: "row",
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  categoryIcon: {
    fontSize: 40,
  },
  lastCompletedContent: {
    flex: 1,
  },
  lastCompletedTitle: {
    fontSize: typography.sizes.base,
    fontWeight: "700",
    color: "#166534",
    marginBottom: spacing[1],
  },
  lastCompletedDesc: {
    fontSize: typography.sizes.xs,
    color: "#15803D",
  },
  recentExperiments: {
    gap: spacing[3],
  },
  recentExperimentCard: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 16,
    padding: spacing[4],
    flexDirection: "row",
    gap: spacing[3],
  },
  recentExperimentContent: {
    flex: 1,
  },
  recentExperimentTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: "600",
    color: colors.text.dark,
    marginBottom: spacing[1],
  },
  recentExperimentDesc: {
    fontSize: typography.sizes.xs,
    color: colors.text.light,
    marginBottom: spacing[2],
  },
  recentExperimentMeta: {
    flexDirection: "row",
    gap: spacing[2],
  },
  statusBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 8,
  },
  statusCompleted: {
    backgroundColor: "#D1FAE5",
  },
  statusInProgress: {
    backgroundColor: "#FEF3C7",
  },
  statusAvailable: {
    backgroundColor: "#DBEAFE",
  },
  statusLocked: {
    backgroundColor: colors.gray[100],
  },
  statusText: {
    fontSize: typography.sizes.xs,
    fontWeight: "600",
  },
  pointsBadge: {
    backgroundColor: "#FFEDD5",
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 8,
  },
  pointsText: {
    fontSize: typography.sizes.xs,
    fontWeight: "600",
    color: "#EA580C",
  },
  recentExperimentIcon: {
    fontSize: 32,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: spacing[8],
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: spacing[2],
  },
  emptyText: {
    fontSize: typography.sizes.sm,
    color: colors.text.light,
    textAlign: "center",
  },
  spacer: {
    height: spacing[8],
  },
});
