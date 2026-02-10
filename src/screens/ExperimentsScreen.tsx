/**
 * ExperimentsScreen
 * Grid of all experiments with progress sidebar
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

interface ExperimentsScreenProps {
  navigation: any;
}

export default function ExperimentsScreen({
  navigation,
}: ExperimentsScreenProps) {
  const { allExperiments, progress, loading } = useWeeklyExperiment();
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
          <Text style={styles.loadingText}>Deneyler hazırlanıyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const completionRate =
    allExperiments.length === 0
      ? 0
      : (progress.totalExperimentsCompleted / allExperiments.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Progress Hero Card */}
        <View style={styles.heroSection}>
          <View style={styles.heroCard}>
            <Text style={styles.heroTitle}>Deneyler 🧪</Text>
            <Text style={styles.heroSubtitle}>
              Her hafta yeni bir deneyle keşfet, öğren ve yıldızları topla ✨
            </Text>

            {/* Progress Card */}
            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>İlerleme</Text>
                <Text style={styles.progressCount}>
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

        {/* Experiments List */}
        <View style={styles.experimentsSection}>
          {allExperiments.length > 0 ? (
            allExperiments.map((exp, index) => {
              const isCompleted = exp.status === "completed";
              const isLocked = exp.status === "locked";

              return (
                <View
                  key={exp.id}
                  style={[
                    styles.experimentCard,
                    isLocked && styles.experimentCardLocked,
                  ]}
                >
                  {/* Header */}
                  <View style={styles.experimentHeader}>
                    <View style={styles.weekBadge}>
                      <Text style={styles.weekBadgeText}>
                        Hafta {index + 1}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.difficultyBadge,
                        exp.difficulty === "kolay" && styles.difficultyEasy,
                        exp.difficulty === "orta" && styles.difficultyMedium,
                        exp.difficulty === "zor" && styles.difficultyHard,
                      ]}
                    >
                      <Text
                        style={[
                          styles.difficultyText,
                          exp.difficulty === "kolay" &&
                            styles.difficultyTextEasy,
                          exp.difficulty === "orta" &&
                            styles.difficultyTextMedium,
                          exp.difficulty === "zor" && styles.difficultyTextHard,
                        ]}
                      >
                        {exp.difficulty === "kolay"
                          ? "Kolay"
                          : exp.difficulty === "orta"
                            ? "Orta"
                            : "Zor"}
                      </Text>
                    </View>
                  </View>

                  {/* Title & Description */}
                  <Text style={styles.experimentTitle}>{exp.title}</Text>
                  <Text style={styles.experimentDescription}>
                    {exp.description}
                  </Text>

                  {/* Meta Info */}
                  <View style={styles.experimentMeta}>
                    <Text style={styles.metaText}>⏱️ {exp.estimatedTime}</Text>
                    <Text style={styles.metaText}>⭐ +{exp.points} XP</Text>
                    {isCompleted && (
                      <Text style={styles.completedText}>✓ Tamamlandı</Text>
                    )}
                    {isLocked && (
                      <Text style={styles.lockedText}>🔒 Kilitli</Text>
                    )}
                  </View>

                  {/* CTA Button */}
                  <TouchableOpacity
                    style={[
                      styles.experimentButton,
                      isLocked && styles.experimentButtonLocked,
                      isCompleted && styles.experimentButtonCompleted,
                    ]}
                    onPress={() => {
                      if (!isLocked) {
                        navigation.navigate("ExperimentDetail", {
                          experimentId: exp.id,
                        });
                      }
                    }}
                    disabled={isLocked}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.experimentButtonText,
                        isLocked && styles.experimentButtonTextLocked,
                      ]}
                    >
                      {isLocked
                        ? "Kilitli"
                        : isCompleted
                          ? "Tekrar Yap"
                          : "Deneye Başla 🚀"}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🔬</Text>
              <Text style={styles.emptyText}>Henüz deney bulunmuyor</Text>
            </View>
          )}
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
    lineHeight: 22,
    marginBottom: spacing[5],
  },
  progressCard: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 16,
    padding: spacing[4],
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
  progressCount: {
    fontSize: typography.sizes.sm,
    fontWeight: "600",
    color: colors.primary,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: colors.white,
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: spacing[3],
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.primary,
  },
  progressFooter: {
    fontSize: typography.sizes.xs,
    color: colors.text.light,
  },
  experimentsSection: {
    paddingHorizontal: spacing[4],
    gap: spacing[4],
  },
  experimentCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: spacing[5],
    marginBottom: spacing[4],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  experimentCardLocked: {
    opacity: 0.5,
  },
  experimentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: 12,
  },
  difficultyEasy: {
    backgroundColor: "#D1FAE5",
  },
  difficultyMedium: {
    backgroundColor: "#FEF3C7",
  },
  difficultyHard: {
    backgroundColor: "#FEE2E2",
  },
  difficultyText: {
    fontSize: typography.sizes.xs,
    fontWeight: "700",
  },
  difficultyTextEasy: {
    color: "#059669",
  },
  difficultyTextMedium: {
    color: "#D97706",
  },
  difficultyTextHard: {
    color: "#DC2626",
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
    flexWrap: "wrap",
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  metaText: {
    fontSize: typography.sizes.sm,
    color: colors.text.light,
  },
  completedText: {
    fontSize: typography.sizes.sm,
    fontWeight: "600",
    color: "#059669",
  },
  lockedText: {
    fontSize: typography.sizes.sm,
    color: colors.text.light,
  },
  experimentButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing[4],
    borderRadius: 24,
    alignItems: "center",
  },
  experimentButtonLocked: {
    backgroundColor: "#FECACA",
  },
  experimentButtonCompleted: {
    backgroundColor: "#6EE7B7",
  },
  experimentButtonText: {
    color: colors.white,
    fontSize: typography.sizes.base,
    fontWeight: "700",
  },
  experimentButtonTextLocked: {
    color: "#FCA5A5",
  },
  emptyState: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: spacing[8],
    alignItems: "center",
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: spacing[3],
  },
  emptyText: {
    fontSize: typography.sizes.base,
    color: colors.text.light,
  },
  spacer: {
    height: spacing[8],
  },
});
