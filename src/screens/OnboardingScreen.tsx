/**
 * OnboardingScreen
 * Welcome page introducing Tully app
 */

import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
} from "react-native";
import { colors, spacing, typography } from "../utils/colors";

interface OnboardingScreenProps {
  navigation: any;
}

export default function OnboardingScreen({
  navigation,
}: OnboardingScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Logo */}
        <View style={styles.header}>
          <Text style={styles.mascot}>🐱‍🔬</Text>
          <Text style={styles.title}>Tully</Text>
          <Text style={styles.subtitle}>Science Experiments for Young Minds</Text>
        </View>

        {/* Description */}
        <View style={styles.descriptionBox}>
          <Text style={styles.descriptionText}>
            Merhaba! Benim adım Tully ve ben bir bilimci kedisiyim. Seninle
            birlikte heyecan verici deneyler yapacağız ve harika şeyler
            öğreneceğiz! 🔬✨
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresBox}>
          <FeatureItem icon="🧪" title="52 Hafta Deney" 
            description="Her hafta yeni bir deney keşfet" />
          <FeatureItem icon="🏆" title="Rozetler Kazan"
            description="Başarılarını rozetlerle ödüllendir" />
          <FeatureItem icon="⭐" title="Puan Topla"
            description="Her deneyin puanını biriktir" />
          <FeatureItem icon="🎓" title="Öğren ve Keşfet"
            description="Bilimi eğlenceli bir şekilde öğren" />
        </View>

        {/* Call to Action */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("ProfileSetup")}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Deneylere Başla 🚀</Text>
        </TouchableOpacity>

        {/* Footer */}
        <Text style={styles.footer}>
          Made with ❤️ for young scientists
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <View style={styles.featureItem}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[6],
  },
  header: {
    alignItems: "center",
    marginVertical: spacing[6],
  },
  mascot: {
    fontSize: 80,
    marginBottom: spacing[2],
  },
  title: {
    fontSize: typography.sizes["4xl"],
    fontWeight: "700",
    color: colors.primary,
    marginBottom: spacing[1],
  },
  subtitle: {
    fontSize: typography.sizes.base,
    color: colors.text.medium,
    textAlign: "center",
  },
  descriptionBox: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing[4],
    marginVertical: spacing[6],
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  descriptionText: {
    fontSize: typography.sizes.base,
    color: colors.text.medium,
    lineHeight: 24,
    textAlign: "center",
  },
  featuresBox: {
    marginVertical: spacing[6],
  },
  featureItem: {
    flexDirection: "row",
    marginBottom: spacing[4],
    alignItems: "flex-start",
  },
  featureIcon: {
    fontSize: 32,
    marginRight: spacing[3],
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: "600",
    color: colors.text.dark,
    marginBottom: spacing[1],
  },
  featureDescription: {
    fontSize: typography.sizes.sm,
    color: colors.text.light,
    lineHeight: 20,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    marginVertical: spacing[6],
    alignItems: "center",
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.sizes.lg,
    fontWeight: "700",
  },
  footer: {
    textAlign: "center",
    color: colors.text.lighter,
    fontSize: typography.sizes.sm,
    marginVertical: spacing[4],
  },
});
