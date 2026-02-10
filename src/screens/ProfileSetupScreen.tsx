/**
 * ProfileSetupScreen
 * User profile creation with nickname, avatar, and age group selection
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing } from "../utils/colors";

interface ProfileSetupScreenProps {
  navigation: any;
}

const AVATARS = [
  { id: "unicorn", emoji: "🦄" },
  { id: "butterfly", emoji: "🦋" },
  { id: "ladybug", emoji: "🐞" },
  { id: "bunny", emoji: "🐰" },
  { id: "cat", emoji: "🐱" },
  { id: "dog", emoji: "🐶" },
];

const AGE_GROUPS = [
  { id: "4-5", label: "4-5 yaş", emoji: "🌱" },
  { id: "6-7", label: "6-7 yaş", emoji: "🌿" },
  { id: "8-9", label: "8-9 yaş", emoji: "🌳" },
  { id: "10-12", label: "10-12 yaş", emoji: "🌲" },
];

const getDefaultNickname = (ageId: string) => {
  switch (ageId) {
    case "4-5":
      return "Minik Kaşif";
    case "6-7":
      return "Bilimci Çocuk";
    case "8-9":
      return "Genç Mucit";
    case "10-12":
      return "Küçük Bilim İnsanı";
    default:
      return "Minik Kaşif";
  }
};

export default function ProfileSetupScreen({
  navigation,
}: ProfileSetupScreenProps) {
  const [nickname, setNickname] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("unicorn");
  const [selectedAge, setSelectedAge] = useState("8-9");
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const tullyBounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();

    // Tully subtle bounce
    Animated.loop(
      Animated.sequence([
        Animated.timing(tullyBounce, {
          toValue: -8,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(tullyBounce, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const handleContinue = async () => {
    setLoading(true);
    try {
      const avatarEmoji = AVATARS.find((a) => a.id === selectedAvatar)?.emoji;
      const ageGroup = AGE_GROUPS.find((a) => a.id === selectedAge);

      const profile = {
        nickname: nickname.trim() || getDefaultNickname(selectedAge),
        avatar: avatarEmoji,
        ageGroup: ageGroup?.label,
        createdAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem("userProfile", JSON.stringify(profile));

      // Navigate to tabs which will show HomeScreen
      navigation.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Hata", "Profil kaydedilirken hata oluştu!");
      console.error("Error saving profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const avatarEmoji = AVATARS.find((a) => a.id === selectedAvatar)?.emoji;
  const displayNickname = nickname.trim() || getDefaultNickname(selectedAge);
  const selectedAgeGroup = AGE_GROUPS.find((a) => a.id === selectedAge);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Tully Header */}
        <Animated.View
          style={[
            styles.tullyHeader,
            {
              opacity: fadeAnim,
              transform: [{ translateY: tullyBounce }],
            },
          ]}
        >
          <Image
            source={require("../../assets/images/tully.png")}
            style={styles.tullyImage}
            resizeMode="contain"
          />
          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>Hadi seni tanıyalım! 🎉</Text>
          </View>
        </Animated.View>

        {/* Form Section */}
        <Animated.View
          style={[
            styles.formSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Nickname Input */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>Takma Adın ne?</Text>
            <TextInput
              style={styles.input}
              placeholder="Adını yaz"
              placeholderTextColor="#9CA3AF"
              value={nickname}
              onChangeText={setNickname}
              maxLength={20}
            />
            {nickname.length > 0 && (
              <Text style={styles.characterCount}>{nickname.length}/20</Text>
            )}
          </View>

          {/* Avatar Selection */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>Avatarını Seç</Text>
            <View style={styles.avatarGrid}>
              {AVATARS.map((avatar) => (
                <TouchableOpacity
                  key={avatar.id}
                  style={[
                    styles.avatarButton,
                    selectedAvatar === avatar.id && styles.avatarButtonSelected,
                  ]}
                  onPress={() => setSelectedAvatar(avatar.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.avatarEmoji}>{avatar.emoji}</Text>
                  {selectedAvatar === avatar.id && (
                    <View style={styles.selectedBadge}>
                      <Text style={styles.selectedBadgeText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Age Group Selection */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>Kaç Yaşındasın?</Text>
            <View style={styles.ageGrid}>
              {AGE_GROUPS.map((age) => (
                <TouchableOpacity
                  key={age.id}
                  style={[
                    styles.ageCard,
                    selectedAge === age.id && styles.ageCardSelected,
                  ]}
                  onPress={() => setSelectedAge(age.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.ageEmoji}>{age.emoji}</Text>
                  <Text style={styles.ageLabel}>{age.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Bottom Fixed Button */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {loading ? "Kaydediliyor..." : "Deneylere Başla! 🚀"}
          </Text>
        </TouchableOpacity>
      </View>
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
    paddingBottom: spacing[4],
  },
  tullyHeader: {
    alignItems: "center",
    paddingTop: spacing[4],
    paddingHorizontal: spacing[5],
    marginBottom: spacing[6],
  },
  tullyImage: {
    width: 120,
    height: 120,
    marginBottom: spacing[3],
  },
  speechBubble: {
    backgroundColor: "#FFE4EC",
    borderRadius: 20,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[5],
    borderWidth: 3,
    borderColor: "#FF6B9D",
    shadowColor: "#FF6B9D",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  speechText: {
    fontSize: 18,
    fontFamily: "NunitoBold",
    color: "#FF6B9D",
    textAlign: "center",
  },
  formSection: {
    paddingHorizontal: spacing[5],
  },
  inputSection: {
    marginBottom: spacing[5],
  },
  label: {
    fontSize: 18,
    fontFamily: "NunitoBold",
    color: "#2D3748",
    marginBottom: spacing[3],
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    fontSize: 16,
    fontFamily: "Nunito",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    color: "#2D3748",
  },
  characterCount: {
    fontSize: 12,
    fontFamily: "Nunito",
    color: "#9CA3AF",
    marginTop: spacing[1],
    textAlign: "right",
  },
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[2],
  },
  avatarButton: {
    width: 55,
    height: 55,
    borderRadius: 16,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#E5E7EB",
    position: "relative",
  },
  avatarButtonSelected: {
    borderColor: "#FF6B9D",
    backgroundColor: "#FFE4EC",
  },
  avatarEmoji: {
    fontSize: 25,
  },
  selectedBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#FF6B9D",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.white,
  },
  selectedBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontFamily: "NunitoBold",
  },
  ageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[2],
  },
  ageCard: {
    width: "48%",
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing[4],
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#E5E7EB",
  },
  ageCardSelected: {
    borderColor: "#4ECDC4",
    backgroundColor: "#D4F1F4",
  },
  ageEmoji: {
    fontSize: 25,
    marginBottom: spacing[2],
  },
  ageLabel: {
    fontSize: 15,
    fontFamily: "NunitoBold",
    color: "#2D3748",
    marginBottom: spacing[1],
  },
  bottomButtonContainer: {
    backgroundColor: "#FFFBF5",
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  button: {
    backgroundColor: "#FF6B9D",
    borderRadius: 50,
    paddingVertical: spacing[4],
    alignItems: "center",
    shadowColor: "#FF6B9D",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 4,
    borderColor: colors.white,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: "NunitoBold",
    letterSpacing: 0.5,
  },
});
