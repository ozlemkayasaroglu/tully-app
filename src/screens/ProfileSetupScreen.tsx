/**
 * ProfileSetupScreen
 * User profile creation with nickname, avatar, and age group selection
 */

import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors, spacing, typography } from "../utils/colors";

interface ProfileSetupScreenProps {
  navigation: any;
}

const AVATARS = ["🧒", "👧", "🧑", "👦", "👨", "��"];
const AGE_GROUPS = ["4-5 yaşında", "6-7 yaşında", "8-9 yaşında", "10-12 yaşında"];

export default function ProfileSetupScreen({
  navigation,
}: ProfileSetupScreenProps) {
  const [nickname, setNickname] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!nickname.trim()) {
      Alert.alert("Hata", "Lütfen bir isim gir!");
      return;
    }

    setLoading(true);
    try {
      const profile = {
        nickname: nickname.trim(),
        avatar: AVATARS[selectedAvatar],
        ageGroup: AGE_GROUPS[selectedAgeGroup],
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profilini Oluştur</Text>
          <Text style={styles.subtitle}>Bana çerçün seni tanıtır mısın?</Text>
        </View>

        {/* Avatar Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Avatarani Seç 👤</Text>
          <View style={styles.avatarGrid}>
            {AVATARS.map((avatar, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.avatarButton,
                  selectedAvatar === index && styles.avatarButtonSelected,
                ]}
                onPress={() => setSelectedAvatar(index)}
              >
                <Text style={styles.avatarText}>{avatar}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Nickname Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Adın Ne? 🏷️</Text>
          <TextInput
            style={styles.input}
            placeholder="Adını yaz (maks 20 karakter)"
            placeholderTextColor={colors.text.lighter}
            value={nickname}
            onChangeText={setNickname}
            maxLength={20}
          />
          <Text style={styles.characterCount}>
            {nickname.length}/20
          </Text>
        </View>

        {/* Age Group Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kaç Yaşındasın? 🎂</Text>
          {AGE_GROUPS.map((group, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.ageButton,
                selectedAgeGroup === index && styles.ageButtonSelected,
              ]}
              onPress={() => setSelectedAgeGroup(index)}
            >
              <View style={styles.radioCircle}>
                {selectedAgeGroup === index && (
                  <View style={styles.radioInner} />
                )}
              </View>
              <Text style={styles.ageButtonText}>{group}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Preview */}
        <View style={styles.previewBox}>
          <Text style={styles.previewTitle}>Ön İzleme</Text>
          <View style={styles.previewContent}>
            <Text style={styles.previewAvatar}>{AVATARS[selectedAvatar]}</Text>
            <View>
              <Text style={styles.previewNickname}>
                {nickname || "Adını gir"}
              </Text>
              <Text style={styles.previewAge}>
                {AGE_GROUPS[selectedAgeGroup]}
              </Text>
            </View>
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
            {loading ? "Kaydediliyor..." : "Devam Et"}
          </Text>
        </TouchableOpacity>
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
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
  },
  header: {
    marginBottom: spacing[6],
  },
  title: {
    fontSize: typography.sizes["3xl"],
    fontWeight: "700",
    color: colors.text.dark,
    marginBottom: spacing[1],
  },
  subtitle: {
    fontSize: typography.sizes.base,
    color: colors.text.medium,
  },
  section: {
    marginBottom: spacing[6],
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: "600",
    color: colors.text.dark,
    marginBottom: spacing[3],
  },
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[2],
  },
  avatarButton: {
    width: "31%",
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
  avatarText: {
    fontSize: 40,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    fontSize: typography.sizes.base,
    borderWidth: 1,
    borderColor: colors.gray[200],
    color: colors.text.dark,
  },
  characterCount: {
    fontSize: typography.sizes.xs,
    color: colors.text.lighter,
    marginTop: spacing[1],
    textAlign: "right",
  },
  ageButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3],
    marginBottom: spacing[2],
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.gray[200],
  },
  ageButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + "10",
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing[3],
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  ageButtonText: {
    fontSize: typography.sizes.base,
    color: colors.text.dark,
    fontWeight: "500",
  },
  previewBox: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing[4],
    marginBottom: spacing[6],
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  previewTitle: {
    fontSize: typography.sizes.sm,
    color: colors.text.lighter,
    marginBottom: spacing[2],
  },
  previewContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  previewAvatar: {
    fontSize: 48,
    marginRight: spacing[3],
  },
  previewNickname: {
    fontSize: typography.sizes.lg,
    fontWeight: "600",
    color: colors.text.dark,
  },
  previewAge: {
    fontSize: typography.sizes.sm,
    color: colors.text.light,
    marginTop: spacing[1],
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: spacing[4],
    alignItems: "center",
    marginBottom: spacing[4],
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
