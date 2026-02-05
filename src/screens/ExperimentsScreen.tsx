/**
 * ExperimentsScreen
 * Grid of all experiments with filters
 */

import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from "react-native";
import { colors, spacing, typography } from "../utils/colors";
import { useWeeklyExperiment } from "../hooks/useWeeklyExperiment";
import type { ExperimentDifficulty } from "../types/experimentTypes";

interface ExperimentsScreenProps {
  navigation: any;
}

const DIFFICULTIES: ExperimentDifficulty[] = ["kolay", "orta", "zor", "uzman"];

export default function ExperimentsScreen({
  navigation,
}: ExperimentsScreenProps) {
  const { allExperiments } = useWeeklyExperiment();
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<ExperimentDifficulty | null>(null);

  const filteredExperiments = selectedDifficulty
    ? allExperiments.filter((exp) => exp.difficulty === selectedDifficulty)
    : allExperiments;

  const renderExperimentCard = ({ item }: any) => (
    <TouchableOpacity
      style={styles.experimentCard}
      onPress={() =>
        navigation.navigate("ExperimentDetail", { experimentId: item.id })
      }
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.weekBadge}>Hafta {item.weekNumber}</Text>
        <Text style={styles.statusIcon}>
          {item.status === "completed" && "✅"}
          {item.status === "in_progress" && "⏳"}
          {item.status === "available" && "🆕"}
          {item.status === "locked" && "🔒"}
        </Text>
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDescription} numberOfLines={2}>
        {item.description}
      </Text>
      <View style={styles.cardFooter}>
        <Text style={styles.pointsText}>+{item.points} Puan</Text>
        <View style={styles.tagsContainer}>
          <Text style={styles.difficultyTag}>
            {item.difficulty === "kolay" && "🟢"}
            {item.difficulty === "orta" && "🟡"}
            {item.difficulty === "zor" && "🔴"}
            {item.difficulty === "uzman" && "⭐"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Deneyler 🧪</Text>
        <Text style={styles.subtitle}>
          Toplam {allExperiments.length} deney - {selectedDifficulty ? "Filtrelenmiş" : "Tümü"}
        </Text>
      </View>

      {/* Difficulty Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
      >
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedDifficulty === null && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedDifficulty(null)}
        >
          <Text
            style={[
              styles.filterButtonText,
              selectedDifficulty === null && styles.filterButtonTextActive,
            ]}
          >
            Tümü
          </Text>
        </TouchableOpacity>

        {DIFFICULTIES.map((difficulty) => (
          <TouchableOpacity
            key={difficulty}
            style={[
              styles.filterButton,
              selectedDifficulty === difficulty && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedDifficulty(difficulty)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedDifficulty === difficulty &&
                  styles.filterButtonTextActive,
              ]}
            >
              {difficulty === "kolay" && "🟢"}
              {difficulty === "orta" && "🟡"}
              {difficulty === "zor" && "🔴"}
              {difficulty === "uzman" && "⭐"}
              {" " + difficulty}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Experiments List */}
      <FlatList
        data={filteredExperiments}
        renderItem={renderExperimentCard}
        keyExtractor={(item) => item.id}
        scrollEnabled={true}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    paddingBottom: spacing[3],
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
  filterScroll: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: spacing[2],
  },
  filterButton: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: typography.sizes.sm,
    color: colors.text.medium,
    fontWeight: "600",
  },
  filterButtonTextActive: {
    color: colors.white,
  },
  listContent: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[6],
    gap: spacing[3],
  },
  experimentCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing[3],
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing[2],
  },
  weekBadge: {
    backgroundColor: colors.primary + "20",
    color: colors.primary,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 6,
    fontSize: typography.sizes.xs,
    fontWeight: "600",
  },
  statusIcon: {
    fontSize: 18,
  },
  cardTitle: {
    fontSize: typography.sizes.base,
    fontWeight: "700",
    color: colors.text.dark,
    marginBottom: spacing[1],
  },
  cardDescription: {
    fontSize: typography.sizes.xs,
    color: colors.text.medium,
    marginBottom: spacing[2],
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pointsText: {
    fontWeight: "600",
    color: colors.primary,
    fontSize: typography.sizes.sm,
  },
  tagsContainer: {
    flexDirection: "row",
  },
  difficultyTag: {
    fontSize: 16,
  },
});
