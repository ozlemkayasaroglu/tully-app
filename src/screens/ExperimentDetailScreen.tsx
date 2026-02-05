/**
 * ExperimentDetailScreen
 * Detailed view of a single experiment with steps and survey
 */

import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
} from "react-native";
import { colors, spacing, typography } from "../utils/colors";
import { useWeeklyExperiment } from "../hooks/useWeeklyExperiment";

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
  const [observation, setObservation] = useState("");
  const [rating, setRating] = useState(0);

  const experiment = allExperiments.find((exp) => exp.id === experimentId);

  if (!experiment) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Deney bulunamadı</Text>
      </SafeAreaView>
    );
  }

  const isLastStep = currentStep === experiment.steps.length;
  const isSurveyStep = currentStep > experiment.steps.length;

  const handleComplete = async () => {
    if (!observation.trim()) {
      Alert.alert("Hata", "Lütfen gözlemlerini yazını!");
      return;
    }

    if (rating === 0) {
      Alert.alert("Hata", "Lütfen deneyimi derecelendir!");
      return;
    }

    try {
      await completeExperiment(experimentId, observation, rating);
      Alert.alert("Tebrikler! 🎉", "Deneyi başarıyla tamamladın!", [
        {
          text: "Tamam",
          onPress: () => navigation.navigate("Home"),
        },
      ]);
    } catch (error) {
      Alert.alert("Hata", "Deney kaydedilirken hata oluştu!");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>← Geri</Text>
          </TouchableOpacity>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${((currentStep + 1) / (experiment.steps.length + 2)) * 100}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* Experiment Info */}
        <View style={styles.infoBox}>
          <Text style={styles.title}>{experiment.title}</Text>
          <Text style={styles.description}>{experiment.description}</Text>
          <View style={styles.metaInfo}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>⏱️ Tahmini Süre</Text>
              <Text style={styles.metaValue}>{experiment.estimatedTime}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>⭐ Puan</Text>
              <Text style={styles.metaValue}>+{experiment.points}</Text>
            </View>
          </View>
        </View>

        {/* Materials */}
        {currentStep === 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gerekli Malzemeler 📦</Text>
            {experiment.materials.map((material, index) => (
              <View key={index} style={styles.materialItem}>
                <Text style={styles.materialIcon}>{material.icon}</Text>
                <Text style={styles.materialName}>{material.name}</Text>
                {material.optional && (
                  <Text style={styles.optionalBadge}>İsteğe Bağlı</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Steps */}
        {currentStep > 0 && currentStep <= experiment.steps.length && (
          <View style={styles.section}>
            <Text style={styles.stepHeader}>
              Adım {currentStep} / {experiment.steps.length}
            </Text>
            <View style={styles.stepBox}>
              <Text style={styles.stepInstruction}>
                {experiment.steps[currentStep - 1].instruction}
              </Text>
              {experiment.steps[currentStep - 1].tip && (
                <View style={styles.tipBox}>
                  <Text style={styles.tipLabel}>💡 İpucu:</Text>
                  <Text style={styles.tipText}>
                    {experiment.steps[currentStep - 1].tip}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Survey */}
        {currentStep > experiment.steps.length && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gözlemlerini Paylaş 📝</Text>
            <TextInput
              style={styles.surveyInput}
              placeholder="Ne gördün? Neler öğrendin?"
              placeholderTextColor={colors.text.lighter}
              value={observation}
              onChangeText={setObservation}
              multiline
              numberOfLines={5}
            />

            <Text style={styles.sectionTitle}>
              Deneyi Nasıl Buldun? ⭐
            </Text>
            <View style={styles.ratingBox}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  style={styles.starButton}
                >
                  <Text
                    style={[
                      styles.star,
                      rating >= star && styles.starActive,
                    ]}
                  >
                    ★
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Navigation Buttons */}
        <View style={styles.navigationBox}>
          {currentStep > 0 && (
            <TouchableOpacity
              style={styles.buttonSecondary}
              onPress={() => setCurrentStep(currentStep - 1)}
            >
              <Text style={styles.buttonSecondaryText}>← Geri</Text>
            </TouchableOpacity>
          )}

          {isSurveyStep ? (
            <TouchableOpacity
              style={styles.buttonPrimary}
              onPress={handleComplete}
            >
              <Text style={styles.buttonPrimaryText}>Tamamla ✅</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.buttonPrimary}
              onPress={() => setCurrentStep(currentStep + 1)}
            >
              <Text style={styles.buttonPrimaryText}>
                {isLastStep ? "Ankete Geç" : "İleri"}
              </Text>
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
  header: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  backButton: {
    marginBottom: spacing[3],
  },
  backButtonText: {
    color: colors.primary,
    fontSize: typography.sizes.base,
    fontWeight: "600",
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.gray[200],
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
  },
  infoBox: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing[4],
    marginHorizontal: spacing[4],
    marginBottom: spacing[4],
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: "700",
    color: colors.text.dark,
    marginBottom: spacing[2],
  },
  description: {
    fontSize: typography.sizes.sm,
    color: colors.text.medium,
    lineHeight: 20,
    marginBottom: spacing[3],
  },
  metaInfo: {
    flexDirection: "row",
    gap: spacing[4],
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: typography.sizes.xs,
    color: colors.text.light,
    marginBottom: spacing[1],
  },
  metaValue: {
    fontSize: typography.sizes.base,
    fontWeight: "600",
    color: colors.primary,
  },
  section: {
    paddingHorizontal: spacing[4],
    marginBottom: spacing[4],
  },
  sectionTitle: {
    fontSize: typography.sizes.base,
    fontWeight: "700",
    color: colors.text.dark,
    marginBottom: spacing[3],
  },
  materialItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    backgroundColor: colors.white,
    borderRadius: 8,
    marginBottom: spacing[2],
  },
  materialIcon: {
    fontSize: 20,
    marginRight: spacing[3],
  },
  materialName: {
    flex: 1,
    fontSize: typography.sizes.sm,
    color: colors.text.dark,
  },
  optionalBadge: {
    fontSize: typography.sizes.xs,
    color: colors.text.lighter,
    fontStyle: "italic",
  },
  stepHeader: {
    fontSize: typography.sizes.lg,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: spacing[3],
  },
  stepBox: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing[4],
  },
  stepInstruction: {
    fontSize: typography.sizes.base,
    color: colors.text.dark,
    lineHeight: 24,
    marginBottom: spacing[3],
  },
  tipBox: {
    backgroundColor: colors.secondary.blue + "10",
    borderRadius: 8,
    padding: spacing[3],
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary.blue,
  },
  tipLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: "600",
    color: colors.secondary.blue,
    marginBottom: spacing[1],
  },
  tipText: {
    fontSize: typography.sizes.sm,
    color: colors.text.medium,
    lineHeight: 20,
  },
  surveyInput: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing[3],
    fontSize: typography.sizes.sm,
    color: colors.text.dark,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: colors.gray[200],
    marginBottom: spacing[4],
  },
  ratingBox: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  starButton: {
    padding: spacing[2],
  },
  star: {
    fontSize: 32,
    color: colors.gray[300],
  },
  starActive: {
    color: colors.secondary.orange,
  },
  navigationBox: {
    flexDirection: "row",
    gap: spacing[2],
    paddingHorizontal: spacing[4],
    marginBottom: spacing[4],
  },
  buttonSecondary: {
    flex: 1,
    paddingVertical: spacing[3],
    borderRadius: 12,
    backgroundColor: colors.gray[200],
    alignItems: "center",
  },
  buttonSecondaryText: {
    color: colors.text.dark,
    fontSize: typography.sizes.base,
    fontWeight: "600",
  },
  buttonPrimary: {
    flex: 1,
    paddingVertical: spacing[3],
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
  },
  buttonPrimaryText: {
    color: colors.white,
    fontSize: typography.sizes.base,
    fontWeight: "600",
  },
  spacer: {
    height: spacing[6],
  },
});
