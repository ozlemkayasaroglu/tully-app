/**
 * ExperimentDetailScreen
 * Detailed view of a single experiment with steps and survey
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useWeeklyExperiment } from "../hooks/useWeeklyExperiment";
import { colors, spacing, typography } from "../utils/colors";

interface ExperimentDetailScreenProps {
  navigation: any;
  route: any;
}

export default function ExperimentDetailScreen({
  navigation,
  route,
}: ExperimentDetailScreenProps) {
  const { experimentId } = route.params;
  const { allExperiments, completeExperiment } = useWeeklyExperiment();
  const [currentStep, setCurrentStep] = useState(0);
  const [showSurvey, setShowSurvey] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const [ageGroup, setAgeGroup] = useState<string | null>(null);

  const experiment = allExperiments.find((exp) => exp.id === experimentId);

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

  useEffect(() => {
    if (experiment) {
      setAnswers(new Array(experiment.observationGuide?.length || 0).fill(""));
    }
  }, [experiment]);

  if (!experiment) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Deney bulunamadı</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Geri Dön</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isYoung = ageGroup === "4-5 yaş" || ageGroup === "6-7 yaş";
  const currentStepData = experiment.steps[currentStep];
  const totalSteps = experiment.steps.length;

  const handleComplete = async () => {
    try {
      await completeExperiment(experiment.id, {
        notes: answers.join(" | "),
        rating: 5,
      });
      Alert.alert("Tebrikler!", "Deneyi başarıyla tamamladın! 🎉", [
        {
          text: "Tamam",
          onPress: () => navigation.navigate("Home"),
        },
      ]);
    } catch (error) {
      Alert.alert("Hata", "Deney tamamlanırken bir hata oluştu.");
    }
  };

  // Survey Screen
  if (showSurvey) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.surveyContainer}>
          <View style={styles.surveyHeader}>
            <Text style={styles.surveyEmoji}>📋</Text>
            <Text style={styles.surveyTitle}>Deney Sonu Anketi</Text>
            <Text style={styles.surveySubtitle}>
              Deneyini tamamladın, şimdi gözlemlerini paylaş!
            </Text>
          </View>

          <View style={styles.questionsContainer}>
            {experiment.observationGuide?.map(
              (question: any, index: number) => {
                const questionText =
                  typeof question === "string" ? question : question.text;
                return (
                  <View key={index} style={styles.questionCard}>
                    <View style={styles.questionHeader}>
                      <View style={styles.questionNumber}>
                        <Text style={styles.questionNumberText}>
                          {index + 1}
                        </Text>
                      </View>
                      <Text style={styles.questionText}>{questionText}</Text>
                    </View>
                    {!isYoung && (
                      <TextInput
                        style={styles.answerInput}
                        value={answers[index]}
                        onChangeText={(text) => {
                          const newAnswers = [...answers];
                          newAnswers[index] = text;
                          setAnswers(newAnswers);
                        }}
                        placeholder="Cevabını buraya yaz..."
                        placeholderTextColor={colors.text.lighter}
                        multiline
                      />
                    )}
                  </View>
                );
              },
            )}
          </View>

          <View style={styles.surveyFooter}>
            <Text style={styles.congratsEmoji}>🎉</Text>
            <Text style={styles.congratsText}>
              Harika bir iş çıkardın! Bilim yolculuğunda bir adım daha
              ilerledin.
            </Text>
            <TouchableOpacity
              style={styles.completeButton}
              onPress={handleComplete}
              activeOpacity={0.8}
            >
              <Text style={styles.completeButtonText}>Deneyi Tamamla ✓</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Main Experiment Flow
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header with Progress */}
        <View style={styles.progressSection}>
          <TouchableOpacity
            style={styles.backLink}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backLinkText}>← Deneylere Dön</Text>
          </TouchableOpacity>

          <View style={styles.progressContent}>
            <Text style={styles.experimentTitle}>{experiment.title}</Text>
            <Text style={styles.stepIndicator}>
              Adım {currentStep + 1} / {totalSteps}
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${((currentStep + 1) / totalSteps) * 100}%` },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Materials (only on first step) */}
        {currentStep === 0 && (
          <View style={styles.section}>
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>📦</Text>
                <Text style={styles.sectionTitle}>Gerekli Malzemeler</Text>
              </View>
              <View style={styles.materialsGrid}>
                {experiment.materials.map((material: any, index: number) => (
                  <View key={index} style={styles.materialItem}>
                    <Text style={styles.materialIcon}>{material.icon}</Text>
                    <View style={styles.materialInfo}>
                      <Text style={styles.materialName}>{material.name}</Text>
                      {material.optional && (
                        <Text style={styles.materialOptional}>
                          İsteğe bağlı
                        </Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Current Step */}
        <View style={styles.section}>
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>🧪</Text>
              <Text style={styles.sectionTitle}>Adım {currentStep + 1}</Text>
            </View>
            <Text style={styles.instructionText}>
              {currentStepData.instruction}
            </Text>
            {currentStepData.tip && (
              <View style={styles.tipBox}>
                <Text style={styles.tipTitle}>💡 İpucu</Text>
                <Text style={styles.tipText}>{currentStepData.tip}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigationButtons}>
          {currentStep > 0 && (
            <TouchableOpacity
              style={styles.prevButton}
              onPress={() => setCurrentStep(currentStep - 1)}
              activeOpacity={0.8}
            >
              <Text style={styles.prevButtonText}>← Önceki</Text>
            </TouchableOpacity>
          )}
          {currentStep < totalSteps - 1 ? (
            <TouchableOpacity
              style={[styles.nextButton, currentStep === 0 && styles.fullWidth]}
              onPress={() => setCurrentStep(currentStep + 1)}
              activeOpacity={0.8}
            >
              <Text style={styles.nextButtonText}>Sonraki →</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.nextButton, currentStep === 0 && styles.fullWidth]}
              onPress={() => setShowSurvey(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.nextButtonText}>Ankete Geç 📝</Text>
            </TouchableOpacity>
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing[4],
  },
  errorText: {
    fontSize: typography.sizes.lg,
    color: colors.text.dark,
    marginBottom: spacing[4],
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    borderRadius: 12,
  },
  backButtonText: {
    color: colors.white,
    fontSize: typography.sizes.base,
    fontWeight: "600",
  },
  progressSection: {
    backgroundColor: "#E0F7F1",
    padding: spacing[5],
  },
  backLink: {
    marginBottom: spacing[4],
  },
  backLinkText: {
    fontSize: typography.sizes.sm,
    fontWeight: "700",
    color: colors.text.dark,
  },
  progressContent: {
    marginTop: spacing[4],
  },
  experimentTitle: {
    fontSize: typography.sizes["2xl"],
    fontWeight: "700",
    color: colors.text.dark,
    marginBottom: spacing[2],
  },
  stepIndicator: {
    fontSize: typography.sizes.base,
    color: colors.text.medium,
    marginBottom: spacing[3],
  },
  progressBar: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
  },
  section: {
    padding: spacing[4],
  },
  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: spacing[5],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  sectionIcon: {
    fontSize: 24,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: "700",
    color: colors.text.dark,
  },
  materialsGrid: {
    gap: spacing[3],
  },
  materialItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: spacing[3],
    borderRadius: 16,
    gap: spacing[2],
  },
  materialIcon: {
    fontSize: 20,
  },
  materialInfo: {
    flex: 1,
  },
  materialName: {
    fontSize: typography.sizes.sm,
    color: colors.text.dark,
    fontWeight: "600",
  },
  materialOptional: {
    fontSize: typography.sizes.xs,
    color: colors.text.light,
  },
  instructionText: {
    fontSize: typography.sizes.base,
    color: colors.text.dark,
    lineHeight: 24,
    marginBottom: spacing[4],
  },
  tipBox: {
    backgroundColor: "#FEF3C7",
    padding: spacing[4],
    borderRadius: 16,
  },
  tipTitle: {
    fontSize: typography.sizes.base,
    fontWeight: "700",
    color: colors.text.dark,
    marginBottom: spacing[1],
  },
  tipText: {
    fontSize: typography.sizes.sm,
    color: colors.text.dark,
    lineHeight: 20,
  },
  navigationButtons: {
    flexDirection: "row",
    paddingHorizontal: spacing[4],
    gap: spacing[3],
  },
  prevButton: {
    flex: 1,
    backgroundColor: colors.gray[200],
    paddingVertical: spacing[4],
    borderRadius: 24,
    alignItems: "center",
  },
  prevButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: "700",
    color: colors.text.dark,
  },
  nextButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: spacing[4],
    borderRadius: 24,
    alignItems: "center",
  },
  fullWidth: {
    flex: 1,
  },
  nextButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: "700",
    color: colors.white,
  },
  surveyContainer: {
    padding: spacing[5],
  },
  surveyHeader: {
    alignItems: "center",
    marginBottom: spacing[6],
  },
  surveyEmoji: {
    fontSize: 56,
    marginBottom: spacing[2],
  },
  surveyTitle: {
    fontSize: typography.sizes["2xl"],
    fontWeight: "700",
    color: "#7C3AED",
    marginBottom: spacing[2],
    textAlign: "center",
  },
  surveySubtitle: {
    fontSize: typography.sizes.sm,
    color: "#6D28D9",
    fontWeight: "600",
    textAlign: "center",
  },
  questionsContainer: {
    gap: spacing[4],
    marginBottom: spacing[6],
  },
  questionCard: {
    backgroundColor: "#F3E8FF",
    borderRadius: 16,
    padding: spacing[4],
  },
  questionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing[2],
    marginBottom: spacing[3],
  },
  questionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#C4B5FD",
    justifyContent: "center",
    alignItems: "center",
  },
  questionNumberText: {
    color: colors.white,
    fontSize: typography.sizes.xs,
    fontWeight: "700",
  },
  questionText: {
    flex: 1,
    fontSize: typography.sizes.base,
    fontWeight: "700",
    color: "#7C3AED",
  },
  answerInput: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: "#C4B5FD",
    borderRadius: 12,
    padding: spacing[3],
    fontSize: typography.sizes.sm,
    color: colors.text.dark,
    minHeight: 80,
    textAlignVertical: "top",
  },
  surveyFooter: {
    alignItems: "center",
  },
  congratsEmoji: {
    fontSize: 32,
    marginBottom: spacing[2],
  },
  congratsText: {
    fontSize: typography.sizes.sm,
    color: colors.text.medium,
    textAlign: "center",
    marginBottom: spacing[4],
    lineHeight: 20,
  },
  completeButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[8],
    borderRadius: 24,
    width: "100%",
    maxWidth: 300,
    alignItems: "center",
  },
  completeButtonText: {
    color: colors.white,
    fontSize: typography.sizes.lg,
    fontWeight: "700",
  },
  spacer: {
    height: spacing[8],
  },
});
