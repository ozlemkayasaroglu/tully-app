/**
 * ProgressScreen
 * Shows user progress, achievements, and stats
 */

import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { colors, spacing, typography } from "../utils/colors";
import { useWeeklyExperiment } from "../hooks/useWeeklyExperiment";

interface ProgressScreenProps {
  navigation: any;
}

export default function ProgressScreen({ navigation }: ProgressScreenProps) {
  const { progress, unlockAchievements } = useWeeklyExperiment();
  const [unlockedBadges, setUnlockedBadges] = React.useState<any[]>([]);

  useEffect(() => {
    const checkAchievements = async () => {
      const badges = await unlockAchievements();
      setUnlockedBadges(badges);
    };

    checkAchievements();
  }, [progress.totalExperimentsCompleted, progress.totalPoints]);

  const completionPercentage = Math.min(
    (progress.totalExperimentsCompleted / 52) * 100,
    100
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>İlerleme Durumu 📊</Text>
          <Text style={styles.subtitle}>Başarılarını takip et</Text>
        </View>

        {/* Overall Progress */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Genel İlerleme</Text>
            <Text style={styles.progressPercentage}>
              %{Math.round(completionPercentage)}
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${completionPercentage}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {progress.totalExperimentsCompleted} / 52 deney tamamlandı
          </Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            icon="🎯"
            title={progress.totalExperimentsCompleted.toString()}
            label="Tamamlanan Deney"
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
            label="Kazanılan Rozetler"
          />
        </View>

        {/* Achievements Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rozetlerim 🏅</Text>
          {unlockedBadges.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Henüz rozet kazanmadın. Deneyler yaparak rozetler kazan!
              </Text>
            </View>
          ) : (
            <View style={styles.badgeGrid}>
              {unlockedBadges.map((badge, index) => (
                <View key={index} style={styles.badgeCard}>
                  <Text style={styles.badgeIcon}>{badge.icon}</Text>
                  <Text style={styles.badgeName}>{badge.name}</Text>
                  <Text style={styles.badgeDescription} numberOfLines={2}>
                    {badge.description}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Level & XP Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seviye Bilgileri 📈</Text>
          <View style={styles.levelCard}>
            <View style={styles.levelContent}>
              <Text style={styles.levelLabel}>Mevcut Seviye</Text>
              <Text style={styles.levelValue}>
                {Math.floor(progress.totalPoints / 100) + 1}
              </Text>
            </View>
            <View style={styles.levelDivider} />
            <View style={styles.levelContent}>
              <Text style={styles.levelLabel}>Sonraki Seviyeye</Text>
              <Text style={styles.levelValue}>
                {100 - (progress.totalPoints % 100)} Puan
              </Text>
            </View>
          </View>
        </View>

        {/* Recent Experiments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Son Başarılar 🎉</Text>
          <View style={styles.recentCard}>
            <Text style={styles.recentText}>
              {progress.totalExperimentsCompleted > 0
                ? `${progress.totalExperimentsCompleted} deney tamamlandı!`
                : "Henüz deney tamamlanmadı. İlk deneyine başla!"}
            </Text>
          </View>
        </View>

        {/* Encouragement Message */}
        <View style={styles.messageBox}>
          <Text style={styles.messageMascot}>🐱‍🔬</Text>
          <Text style={styles.messageTitle}>Harika İş Yapıyorsun!</Text>
          <Text style={styles.messageText}>
            Her deney seni bilim konusunda daha yetenekli yapıyor. Devam et! 💪
          </Text>
        </View>

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
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
  },
  title: {
    fontSize: typography.sizes["2xl"],
    fontWeight: "700",
    color: colors.text.dark,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    color: colors.text.light,
    marginTop: spacing[1],
  },
  progressCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing[4],
    marginHorizontal: spacing[4],
    marginBottom: spacing[6],
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing[3],
  },
  progressTitle: {
    fontSize: typography.sizes.base,
    fontWeight: "600",
    color: colors.text.dark,
  },
  progressPercentage: {
    fontSize: typography.sizes.lg,
    fontWeight: "700",
    color: colors.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.gray[200],
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: spacing[3],
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
  },
  progressText: {
    fontSize: typography.sizes.sm,
    color: colors.text.light,
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
  badgeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[2],
  },
  badgeCard: {
    width: "48%",
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing[3],
    alignItems: "center",
  },
  badgeIcon: {
    fontSize: 40,
    marginBottom: spacing[2],
  },
  badgeName: {
    fontSize: typography.sizes.sm,
    fontWeight: "600",
    color: colors.text.dark,
    textAlign: "center",
    marginBottom: spacing[1],
  },
  badgeDescription: {
    fontSize: typography.sizes.xs,
    color: colors.text.light,
    textAlign: "center",
  },
  emptyState: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing[6],
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: typography.sizes.sm,
    color: colors.text.medium,
    textAlign: "center",
    lineHeight: 20,
  },
  levelCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing[4],
    flexDirection: "row",
    alignItems: "center",
  },
  levelContent: {
    flex: 1,
    alignItems: "center",
  },
  levelLabel: {
    fontSize: typography.sizes.xs,
    color: colors.text.light,
    marginBottom: spacing[1],
  },
  levelValue: {
    fontSize: typography.sizes["2xl"],
    fontWeight: "700",
    color: colors.primary,
  },
  levelDivider: {
    width: 1,
    height: 50,
    backgroundColor: colors.gray[200],
    marginHorizontal: spacing[4],
  },
  recentCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing[4],
  },
  recentText: {
    fontSize: typography.sizes.base,
    color: colors.text.dark,
    textAlign: "center",
    lineHeight: 24,
  },
  messageBox: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing[4],
    marginHorizontal: spacing[4],
    alignItems: "center",
    marginBottom: spacing[6],
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  messageMascot: {
    fontSize: 48,
    marginBottom: spacing[2],
  },
  messageTitle: {
    fontSize: typography.sizes.base,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: spacing[1],
  },
  messageText: {
    fontSize: typography.sizes.sm,
    color: colors.text.medium,
    textAlign: "center",
    lineHeight: 20,
  },
  spacer: {
    height: spacing[6],
  },
});
