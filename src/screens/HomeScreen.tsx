/**
 * HomeScreen
 * Main home page with weekly experiment and achievements
 */

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors, spacing, typography } from "../utils/colors";
import { useWeeklyExperiment } from "../hooks/useWeeklyExperiment";

interface HomeScreenProps {
  navigation: any;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [userProfile, setUserProfile] = useState<any>(null);
  const { currentExperiment, progress, loading } = useWeeklyExperiment();

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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Welcome */}
        <View style={styles.header}>
          <View style={styles.welcomeBox}>
            <Text style={styles.mascot}>🐱‍🔬</Text>
            <View>
              <Text style={styles.greeting}>Merhaba!</Text>
              <Text style={styles.welcomeText}>
                {userProfile?.nickname || "Bilim Tutkunu"}
              </Text>
            </View>
          </View>
        </View>

        {/* Weekly Experiment Card */}
        {currentExperiment && (
          <TouchableOpacity
            style={styles.experimentCard}
            onPress={() =>
              navigation.navigate("ExperimentDetail", {
                experimentId: currentExperiment.id,
              })
            }
            activeOpacity={0.8}
          >
            <View style={styles.experimentHeader}>
              <Text style={styles.weekBadge}>
                Hafta {currentExperiment.weekNumber}
              </Text>
              <Text style={styles.difficultyBadge}>
                {currentExperiment.difficulty === "kolay" && "��"}
                {currentExperiment.difficulty === "orta" && "🟡"}
                {currentExperiment.difficulty === "zor" && "🔴"}
                {currentExperiment.difficulty === "uzman" && "⭐"}
                {" " + currentExperiment.difficulty}
              </Text>
            </View>
            <Text style={styles.experimentTitle}>
              {currentExperiment.title}
            </Text>
            <Text style={styles.experimentDescription}>
              {currentExperiment.description}
            </Text>
            <View style={styles.experimentFooter}>
              <Text style={styles.pointsText}>
                +{currentExperiment.points} Puan
              </Text>
              <Text style={styles.timeText}>
                ⏱️ {currentExperiment.estimatedTime}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Progress Stats */}
        <View style={styles.statsGrid}>
          <StatCard
            icon="🎯"
            title={progress.totalExperimentsCompleted.toString()}
            label="Deney Tamamlandı"
          />
          <StatCard
            icon="⭐"
            title={progress.totalPoints.toString()}
            label="Toplam Puan"
          />
          <StatCard
            icon="🔥"
            title={progress.streak.toString()}
            label="Günlük Seri"
          />
          <StatCard
            icon="🏆"
            title={progress.badges.length.toString()}
            label="Rozetler"
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hızlı Erişim</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("Experiments")}
            activeOpacity={0.8}
          >
            <Text style={styles.actionIcon}>🧪</Text>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Tüm Deneyler</Text>
              <Text style={styles.actionDescription}>
                Diğer deneyler kütüphanesine bak
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("Progress")}
            activeOpacity={0.8}
          >
            <Text style={styles.actionIcon}>📊</Text>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>İlerleme</Text>
              <Text style={styles.actionDescription}>
                Başarılarını ve rozetlerini gör
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Footer Spacing */}
        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

interface StatCardProps {
  icon: string;
  title: string;
  label: string;
}

function StatCard({ icon, title, label }: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing[4],
  },
  welcomeBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  mascot: {
    fontSize: 48,
    marginRight: spacing[3],
  },
  greeting: {
    fontSize: typography.sizes.sm,
    color: colors.text.light,
  },
  welcomeText: {
    fontSize: typography.sizes.xl,
    fontWeight: "700",
    color: colors.primary,
  },
  experimentCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing[4],
    marginHorizontal: spacing[4],
    marginBottom: spacing[4],
  },
  experimentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing[2],
  },
  weekBadge: {
    backgroundColor: colors.primary + "20",
    color: colors.primary,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 8,
    fontSize: typography.sizes.xs,
    fontWeight: "600",
    overflow: "hidden",
  },
  difficultyBadge: {
    fontSize: typography.sizes.sm,
    fontWeight: "600",
  },
  experimentTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: "700",
    color: colors.text.dark,
    marginBottom: spacing[2],
  },
  experimentDescription: {
    fontSize: typography.sizes.sm,
    color: colors.text.medium,
    lineHeight: 20,
    marginBottom: spacing[3],
  },
  experimentFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pointsText: {
    fontWeight: "600",
    color: colors.primary,
  },
  timeText: {
    color: colors.text.light,
    fontSize: typography.sizes.sm,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: spacing[2],
    marginBottom: spacing[6],
    gap: spacing[2],
  },
  statCard: {
    width: "48%",
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing[3],
    alignItems: "center",
  },
  statIcon: {
    fontSize: 32,
    marginBottom: spacing[1],
  },
  statTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: "700",
    color: colors.text.dark,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    color: colors.text.light,
    marginTop: spacing[1],
    textAlign: "center",
  },
  section: {
    paddingHorizontal: spacing[4],
    marginBottom: spacing[6],
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: "700",
    color: colors.text.dark,
    marginBottom: spacing[3],
  },
  actionButton: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing[3],
    marginBottom: spacing[2],
    alignItems: "center",
  },
  actionIcon: {
    fontSize: 32,
    marginRight: spacing[3],
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: typography.sizes.base,
    fontWeight: "600",
    color: colors.text.dark,
  },
  actionDescription: {
    fontSize: typography.sizes.xs,
    color: colors.text.light,
    marginTop: spacing[1],
  },
  spacer: {
    height: spacing[6],
  },
});
