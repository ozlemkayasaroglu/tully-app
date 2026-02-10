import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing, typography } from "../utils/colors";
const { width, height } = Dimensions.get("window");

interface OnboardingScreenProps {
  navigation: any;
}

export default function OnboardingScreen({
  navigation,
}: OnboardingScreenProps) {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const starAnims = useRef(
    Array(15)
      .fill(null)
      .map(() => new Animated.Value(0.5)),
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      ),
    ]).start();

    starAnims.forEach((anim, index) => {
      const delay = index * 150;

      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 800 + Math.random() * 400,
            delay: delay,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.5,
            duration: 800 + Math.random() * 400,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    });
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const starPositions = [
    { left: width * 0.05, top: height * 0.05, size: 20 },
    { left: width * 0.15, top: height * 0.15, size: 16 },
    { left: width * 0.85, top: height * 0.08, size: 24 },
    { left: width * 0.75, top: height * 0.2, size: 18 },
    { left: width * 0.1, top: height * 0.35, size: 22 },
    { left: width * 0.9, top: height * 0.4, size: 14 },
    { left: width * 0.25, top: height * 0.5, size: 20 },
    { left: width * 0.7, top: height * 0.55, size: 16 },
    { left: width * 0.05, top: height * 0.65, size: 18 },
    { left: width * 0.95, top: height * 0.7, size: 20 },
    { left: width * 0.4, top: height * 0.75, size: 14 },
    { left: width * 0.6, top: height * 0.8, size: 22 },
    { left: width * 0.2, top: height * 0.9, size: 16 },
    { left: width * 0.8, top: height * 0.85, size: 20 },
    { left: width * 0.5, top: height * 0.95, size: 18 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.starsContainer}>
          {starPositions.map((pos, i) => (
            <Animated.Text
              key={i}
              style={[
                styles.floatingStar,
                {
                  left: pos.left,
                  top: pos.top,
                  fontSize: pos.size,
                  opacity: starAnims[i],
                  transform: [
                    {
                      scale: starAnims[i].interpolate({
                        inputRange: [0.5, 1],
                        outputRange: [0.8, 1.2],
                      }),
                    },
                  ],
                },
              ]}
            >
              {i % 3 === 0 ? "✨" : i % 3 === 1 ? "⭐" : "🌟"}
            </Animated.Text>
          ))}
        </View>

        <View style={styles.centerContent}>
          <Animated.View
            style={[
              styles.characterSection,
              {
                transform: [{ translateY: floatAnim }, { scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.characterCircle} />

            <Animated.View
              style={[styles.sparkleOrbit, { transform: [{ rotate: spin }] }]}
            >
              <Text style={styles.orbitSparkle}>⭐</Text>
            </Animated.View>

            <Image
              source={require("../../assets/images/tully.png")}
              style={styles.tullyImage}
              resizeMode="contain"
            />

            <Animated.View
              style={[
                styles.speechBubble,
                {
                  transform: [{ translateX: slideAnim }],
                },
              ]}
            >
              <View style={styles.speechBubbleInner}>
                <Text style={styles.speechEmoji}>👋</Text>
                <Text style={styles.speechBubbleText}>
                  Merhaba! Ben
                  <Text style={styles.highlightText}> Tully!</Text>
                  {"\n"} Benimle oynamaya ve öğrenmeye hazır mısın?
                </Text>
              </View>
              <View style={styles.speechBubbleTail} />
            </Animated.View>
          </Animated.View>
        </View>

        <View style={styles.pageIndicator}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
        </View>

        <View style={styles.swipeHint}>
          <Text style={styles.swipeHintText}>Yukarı kaydır</Text>
          <Text style={styles.swipeHintEmoji}>👆</Text>
        </View>
      </ScrollView>

      <View style={styles.footerContainer}>
        <Text style={styles.footer}>For my little unicorn</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F9FF",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing[4],
    paddingTop: spacing[6],
    paddingBottom: spacing[24],
  },
  starsContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    zIndex: 0,
  },
  floatingStar: {
    position: "absolute",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: height * 0.55,
    zIndex: 1,
  },
  characterSection: {
    alignItems: "center",
    position: "relative",
  },
  characterCircle: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(255, 182, 193, 0.3)",
    top: -20,
  },
  sparkleOrbit: {
    position: "absolute",
    width: 240,
    height: 240,
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  orbitSparkle: {
    fontSize: 28,
    marginTop: -10,
  },
  tullyImage: {
    width: 220,
    height: 220,
    zIndex: 2,
  },
  speechBubble: {
    backgroundColor: colors.white,
    borderRadius: 25,
    padding: spacing[4],
    marginHorizontal: spacing[4],
    marginTop: -spacing[2],
    position: "relative",
    shadowColor: "#FF6B9D",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 3,
    borderColor: "#FFE4EC",
    zIndex: 3,
  },
  speechBubbleInner: {
    alignItems: "center",
  },
  speechEmoji: {
    fontSize: 32,
    marginBottom: spacing[2],
  },
  speechBubbleText: {
    fontSize: typography.sizes.lg,
    color: colors.text.dark,
    textAlign: "center",
    lineHeight: 28,
    fontFamily: "NunitoBold",
  },
  highlightText: {
    color: "#FF6B9D",
    fontSize: typography.sizes.xl,
    fontFamily: "NunitoBold",
  },
  speechBubbleTail: {
    position: "absolute",
    top: -15,
    left: "50%",
    marginLeft: -15,
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 15,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: colors.white,
  },
  pageIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing[8],
    gap: 12,
    zIndex: 1,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#D1D5DB",
  },
  dotActive: {
    backgroundColor: "#FF6B9D",
    width: 32,
    height: 12,
    borderRadius: 6,
  },
  swipeHint: {
    alignItems: "center",
    marginTop: spacing[4],
    opacity: 0.6,
    zIndex: 1,
  },
  swipeHintText: {
    fontSize: typography.sizes.sm,
    color: "#9CA3AF",
    fontWeight: "600",
    marginBottom: spacing[1],
    fontFamily: typography.fontFamily.regular,
  },
  swipeHintEmoji: {
    fontSize: 24,
  },
  footerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing[4],
    backgroundColor: "#F0F9FF",
    position: "absolute",
    bottom: 18,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  footer: {
    color: "rgba(186, 139, 161, 0.47)",
    fontSize: typography.sizes.sm,
    fontWeight: "600",
    marginHorizontal: spacing[2],
    fontStyle: "italic",
    fontFamily: "NunitoBold",
  },
  footerEmoji: {
    fontSize: 20,
  },
});
