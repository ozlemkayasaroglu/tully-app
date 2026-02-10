/**
 * ProfileSetupScreen
 * User profile creation with nickname, avatar, and age group selection
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
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
import { colors, spacing, typography } from "../utils/colors";

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
  { id: "4-5", label: "4-5 yaş", emoji: "🫘", description: "Tohum" },
  { id: "6-7", label: "6-7 yaş", emoji: "🌱", description: "Filiz" },
  { id: "8-9", label: "8-9 yaş", emoji: "🌿", description: "Yaprak" },
  { id: "10-12", label: "10-12 yaş", emoji: "🌳", description: "Ağaç" },
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

      // Navigate to MainTabs
      navigation.reset({
        index: 0,
        routes: [{ name: "MainTabs" }],
      });
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
        {/* Preview Section */}
        <View style={styles.previewSection}>
          <View style={styles.previewCard}>
            <Text style={styles.previewAvatar}>{avatarEmoji}</Text>
            <Text style={styles.previewNickname}>{displayNickname}</Text>
            <View style={styles.previewAgeContainer}>
              <Text style={styles.previewAgeEmoji}>
                {selectedAgeGroup?.emoji}
              </Text>
              <Text style={styles.previewAgeText}>
                {selectedAgeGroup?.label}
              </Text>
            </View>
          </View>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <Text style={styles.title}>Profilini Oluştur</Text>
          <Text style={styles.subtitle}>
            Sana özel deneyleri hazırlayabilmemiz için birkaç adım yeterli.
          </Text>

          {/* Nickname Input */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>Takma Ad</Text>
            <TextInput
              style={styles.input}
              placeholder="Takma adını yaz (opsiyonel)"
              placeholderTextColor={colors.text.lighter}
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
            <Text style={styles.label}>Avatar Seç</Text>
            <View style={styles.avatarGrid}>
              {AVATARS.map((avatar) => (
                <TouchableOpacity
                  key={avatar.id}
                  style={[
                    styles.avatarButton,
                    selectedAvatar === avatar.id && styles.avatarButtonSelected,
                  ]}
                  onPress={() => setSelectedAvatar(avatar.id)}
                >
                  <Text style={styles.avatarEmoji}>{avatar.emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Age Group Selection */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>Yaş Grubu</Text>
            <View style={styles.ageGrid}>
              {AGE_GROUPS.map((age) => (
                <TouchableOpacity
                  key={age.id}
                  style={[
                    styles.ageCard,
                    selectedAge === age.id && styles.ageCardSelected,
                  ]}
                  onPress={() => setSelectedAge(age.id)}
                >
                  <Text style={styles.ageEmoji}>{age.emoji}</Text>
                  <Text style={styles.ageLabel}>{age.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleContinue}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {loading ? "Kaydediliyor..." : "Deneylere Başla 🚀"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  previewSection: {
    backgroundColor: "#E0F7F1",
    paddingVertical: spacing[8],
    paddingHorizontal: spacing[4],
    alignItems: "center",
  },
  previewCard: {
    alignItems: "center",
  },
  previewAvatar: {
    fontSize: 80,
    marginBottom: spacing[3],
  },
  previewNickname: {
    fontSize: typography.sizes["2xl"],
    fontWeight: "700",
    color: colors.text.dark,
    marginBottom: spacing[2],
  },
  previewAgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
  },
  previewAgeEmoji: {
    fontSize: 24,
  },
  previewAgeText: {
    fontSize: typography.sizes.base,
    color: colors.text.medium,
    fontWeight: "600",
  },
  formSection: {
    padding: spacing[6],
  },
  title: {
    fontSize: typography.sizes["3xl"],
    fontWeight: "700",
    color: colors.text.dark,
    marginBottom: spacing[2],
  },
  subtitle: {
    fontSize: typography.sizes.base,
    color: colors.text.medium,
    marginBottom: spacing[6],
    lineHeight: 22,
  },
  inputSection: {
    marginBottom: spacing[6],
  },
  label: {
    fontSize: typography.sizes.lg,
    fontWeight: "600",
    color: colors.text.dark,
    marginBottom: spacing[3],
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    fontSize: typography.sizes.base,
    borderWidth: 2,
    borderColor: colors.gray[200],
    color: colors.text.dark,
  },
  characterCount: {
    fontSize: typography.sizes.xs,
    color: colors.text.lighter,
    marginTop: spacing[1],
    textAlign: "right",
  },
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[1],
  },
  avatarButton: {
    width: "15%",
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.gray[200],
  },
  avatarButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + "10",
  },
  avatarEmoji: {
    fontSize: 32,
  },
  ageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[3],
  },
  ageCard: {
    width: "48%",
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing[4],
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.gray[200],
  },
  ageCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + "10",
  },
  ageEmoji: {
    fontSize: 40,
    marginBottom: spacing[2],
  },
  ageLabel: {
    fontSize: typography.sizes.sm,
    color: colors.text.dark,
    fontWeight: "600",
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    paddingVertical: spacing[4],
    alignItems: "center",
    marginTop: spacing[4],
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.sizes.lg,
    fontWeight: "700",
  },
});
