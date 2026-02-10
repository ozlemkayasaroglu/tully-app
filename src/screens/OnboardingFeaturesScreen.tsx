// OnboardingFeaturesScreen.tsx - Sayfa 2: Özellikler
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, spacing } from "../utils/colors";

const { width, height } = Dimensions.get("window");

interface OnboardingFeaturesScreenProps {
  navigation: any;
}

export default function OnboardingFeaturesScreen({
  navigation,
}: OnboardingFeaturesScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const tullyScale = useRef(new Animated.Value(0.8)).current;
  const cardAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(tullyScale, {
        toValue: 1,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();

    // Stagger card animations
    cardAnims.forEach((anim, index) => {
      Animated.spring(anim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        delay: 400 + index * 150,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  const features = [
    {
      emoji: "🧪",
      title: "Renkli Deneyler",
      description: "Evinde yapabileceğin güvenli ve eğlenceli bilim deneyleri!",
      color: "#FFD4E5",
      accentColor: "#FF6B9D",
    },
    {
      emoji: "🏆",
      title: "Rozet Kazan",
      description:
        "Her deneyi tamamla, rozetlerini topla ve koleksiyonunu büyüt!",
      color: "#D4F1F4",
      accentColor: "#4ECDC4",
    },
    {
      emoji: "🌟",
      title: "Öğren ve Keşfet",
      description: "Bilimi eğlenceli hale getir, merakını keşfet!",
      color: "#FFF9D0",
      accentColor: "#FFD93D",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Tully Section */}
          <Animated.View
            style={[
              styles.tullySection,
              { transform: [{ scale: tullyScale }] },
            ]}
          >
            <Image
              source={require("../../assets/images/tully.png")}
              style={styles.tullyImage}
              resizeMode="contain"
            />
            <Text style={styles.welcomeText}>Benimle neler yapacağız? 🎉</Text>
          </Animated.View>

          {/* Feature Cards */}
          <View style={styles.cardsContainer}>
            {features.map((feature, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.featureCard,
                  {
                    backgroundColor: feature.color,
                    opacity: cardAnims[index],
                    transform: [
                      {
                        scale: cardAnims[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.9, 1],
                        }),
                      },
                      {
                        translateY: cardAnims[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [30, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View
                  style={[
                    styles.emojiCircle,
                    { backgroundColor: feature.accentColor },
                  ]}
                >
                  <Text style={styles.cardEmoji}>{feature.emoji}</Text>
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>{feature.title}</Text>
                  <Text style={styles.cardDescription}>
                    {feature.description}
                  </Text>
                </View>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Bottom CTA */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => navigation.navigate("ProfileSetup")}
            activeOpacity={0.8}
          >
            <Text style={styles.ctaText}>Hadi Başlayalım! 🚀</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBF5",
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
  },
  tullySection: {
    alignItems: "center",
    marginBottom: spacing[6],
    paddingTop: spacing[2],
  },
  tullyImage: {
    width: 180,
    height: 180,
    marginBottom: spacing[3],
  },
  welcomeText: {
    fontSize: 24,
    fontFamily: "NunitoBold",
    color: "#FF6B9D",
    textAlign: "center",
    lineHeight: 32,
  },
  cardsContainer: {
    gap: spacing[4],
    paddingBottom: spacing[4],
  },
  featureCard: {
    borderRadius: 20,
    padding: spacing[4],
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.8)",
  },
  emojiCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing[3],
  },
  cardEmoji: {
    fontSize: 36,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: "NunitoBold",
    color: "#2D3748",
    marginBottom: spacing[1],
  },
  cardDescription: {
    fontSize: 14,
    fontFamily: "Nunito",
    color: "#4A5568",
    lineHeight: 20,
  },
  bottomSection: {
    alignItems: "center",
    paddingVertical: spacing[6],
    paddingHorizontal: spacing[5],
  },
  ctaButton: {
    backgroundColor: "#FF6B9D",
    borderRadius: 50,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[12],
    shadowColor: "#FF6B9D",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 4,
    borderColor: "#FFF",
    width: "100%",
    maxWidth: 300,
  },
  ctaText: {
    color: colors.white,
    fontSize: 20,
    fontFamily: "NunitoBold",
    letterSpacing: 0.5,
    textAlign: "center",
  },
});
