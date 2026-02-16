/**
 * useWeeklyExperiment Hook
 * Manages experiment data, progress, and state
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { weeklyExperiments } from "../data/weeklyExperiments";
import type {
  Badge,
  WeeklyExperiment,
  WeeklyProgress,
} from "../types/experimentTypes";

const ACHIEVEMENTS: Badge[] = [
  {
    id: "first-experiment",
    name: "İlk Adım",
    description: "İlk deneyi tamamla",
    icon: "🎯",
  },
  {
    id: "five-experiments",
    name: "Bilim Avcısı",
    description: "5 deney tamamla",
    icon: "🔍",
  },
  {
    id: "ten-experiments",
    name: "Deney Uzmanı",
    description: "10 deney tamamla",
    icon: "🧪",
  },
  {
    id: "twenty-experiments",
    name: "Mikroskop Ustası",
    description: "20 deney tamamla",
    icon: "🔬",
  },
  {
    id: "streak-week",
    name: "Tutarlı Öğrenci",
    description: "1 hafta boyunca her gün deney yap",
    icon: "🔥",
  },
  {
    id: "all-categories",
    name: "Çok Yönlü Öğrenci",
    description: "Tüm kategorilerde deney yap",
    icon: "🌈",
  },
  {
    id: "kolay-master",
    name: "Kolay Deneylerin Efendisi",
    description: "Tüm kolay deneyleri tamamla",
    icon: "⭐",
  },
  {
    id: "orta-master",
    name: "Orta Düzey Uzmanı",
    description: "Tüm orta deneyleri tamamla",
    icon: "��",
  },
  {
    id: "zor-master",
    name: "Zor Deneylerin Kahramanı",
    description: "Tüm zor deneyleri tamamla",
    icon: "💪",
  },
  {
    id: "points-500",
    name: "500 Puan Öğrenci",
    description: "500 puan topla",
    icon: "💯",
  },
  {
    id: "points-1000",
    name: "1000 Puan Efsanesi",
    description: "1000 puan topla",
    icon: "👑",
  },
  {
    id: "points-2000",
    name: "Bilim Devleri",
    description: "2000 puan topla",
    icon: "🚀",
  },
];

interface UseWeeklyExperimentReturn {
  currentExperiment: WeeklyExperiment | null;
  allExperiments: WeeklyExperiment[];
  progress: WeeklyProgress;
  loading: boolean;
  startExperiment: (experimentId: string) => Promise<void>;
  completeExperiment: (
    experimentId: string,
    observation: string,
    rating: number,
  ) => Promise<void>;
  unlockAchievements: () => Promise<Badge[]>;
}

export function useWeeklyExperiment(): UseWeeklyExperimentReturn {
  const [allExperiments, setAllExperiments] = useState<WeeklyExperiment[]>([]);
  const [progress, setProgress] = useState<WeeklyProgress>({
    currentWeek: 1,
    totalExperimentsCompleted: 0,
    totalPoints: 0,
    streak: 0,
    badges: [],
    unlockedCategories: [],
  });
  const [loading, setLoading] = useState(true);

  // Initialize experiments
  useEffect(() => {
    const initializeExperiments = async () => {
      try {
        const savedProgress = await AsyncStorage.getItem("userProgress");
        const savedExperiments = await AsyncStorage.getItem("experiments");

        if (savedProgress) {
          setProgress(JSON.parse(savedProgress));
        }

        if (savedExperiments) {
          setAllExperiments(JSON.parse(savedExperiments));
        } else {
          // Initialize experiments with status
          const experimentsWithStatus = weeklyExperiments.map((exp, index) => ({
            ...exp,
            status: index === 0 ? ("available" as const) : ("locked" as const),
          }));
          setAllExperiments(experimentsWithStatus as WeeklyExperiment[]);
          await AsyncStorage.setItem(
            "experiments",
            JSON.stringify(experimentsWithStatus),
          );
        }
      } catch (error) {
        console.error("Error initializing experiments:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeExperiments();
  }, []);

  const currentExperiment =
    allExperiments.find((exp) => exp.status === "in_progress") ||
    allExperiments.find((exp) => exp.status === "available") ||
    null;

  const startExperiment = async (experimentId: string) => {
    try {
      const updatedExperiments = allExperiments.map((exp) => {
        if (exp.id === experimentId && exp.status === "available") {
          return {
            ...exp,
            status: "in_progress" as const,
          };
        }
        return exp;
      });

      setAllExperiments(updatedExperiments);
      await AsyncStorage.setItem(
        "experiments",
        JSON.stringify(updatedExperiments),
      );
    } catch (error) {
      console.error("Error starting experiment:", error);
    }
  };

  const completeExperiment = async (
    experimentId: string,
    observation: string,
    rating: number,
  ) => {
    try {
      const updatedExperiments = allExperiments.map((exp, index) => {
        if (exp.id === experimentId) {
          return {
            ...exp,
            status: "completed" as const,
            userObservation: {
              notes: observation,
              rating,
              completedAt: new Date().toISOString(),
            },
            completedAt: new Date().toISOString(),
          };
        }

        // Unlock next experiment if current one is completed
        const completedIndex = allExperiments.findIndex(
          (e) => e.id === experimentId,
        );
        if (index === completedIndex + 1 && exp.status === "locked") {
          return {
            ...exp,
            status: "available" as const,
          };
        }

        return exp;
      });

      const completedExp = updatedExperiments.find(
        (exp) => exp.id === experimentId,
      );
      const points = completedExp?.points || 0;

      const newProgress: WeeklyProgress = {
        ...progress,
        totalExperimentsCompleted: progress.totalExperimentsCompleted + 1,
        totalPoints: progress.totalPoints + points,
        currentWeek: Math.min(progress.currentWeek + 1, 52),
      };

      setProgress(newProgress);
      setAllExperiments(updatedExperiments);

      await AsyncStorage.setItem("userProgress", JSON.stringify(newProgress));
      await AsyncStorage.setItem(
        "experiments",
        JSON.stringify(updatedExperiments),
      );
    } catch (error) {
      console.error("Error completing experiment:", error);
    }
  };

  const unlockAchievements = async (): Promise<Badge[]> => {
    const unlockedBadges: Badge[] = [];

    // Check achievements
    if (progress.totalExperimentsCompleted >= 1) {
      unlockedBadges.push(ACHIEVEMENTS[0]);
    }
    if (progress.totalExperimentsCompleted >= 5) {
      unlockedBadges.push(ACHIEVEMENTS[1]);
    }
    if (progress.totalExperimentsCompleted >= 10) {
      unlockedBadges.push(ACHIEVEMENTS[2]);
    }
    if (progress.totalExperimentsCompleted >= 20) {
      unlockedBadges.push(ACHIEVEMENTS[3]);
    }
    if (progress.totalPoints >= 500) {
      unlockedBadges.push(ACHIEVEMENTS[9]);
    }
    if (progress.totalPoints >= 1000) {
      unlockedBadges.push(ACHIEVEMENTS[10]);
    }
    if (progress.totalPoints >= 2000) {
      unlockedBadges.push(ACHIEVEMENTS[11]);
    }

    const newProgress = {
      ...progress,
      badges: unlockedBadges,
    };

    setProgress(newProgress);
    await AsyncStorage.setItem("userProgress", JSON.stringify(newProgress));

    return unlockedBadges;
  };

  return {
    currentExperiment,
    allExperiments,
    progress,
    loading,
    startExperiment,
    completeExperiment,
    unlockAchievements,
  };
}
