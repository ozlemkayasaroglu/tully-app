/**
 * Mikroskop ve Deney Görev Türleri
 * Haftalık görevler için tip tanımlamaları
 */

// Görev kategorileri
export type ExperimentCategory =
  | "Mikroskop Gözlemi"
  | "Hücre Biyolojisi"
  | "Mikroorganizmalar"
  | "Kristal Oluşumu"
  | "Bitki Anatomisi"
  | "Su Yaşamı"
  | "Mantarlar"
  | "Kimyasal Reaksiyon";

// Zorluk seviyeleri
export type ExperimentDifficulty = "kolay" | "orta" | "zor" | "uzman";

// Gerekli malzemeler
export interface RequiredMaterial {
  name: string;
  icon: string;
  optional?: boolean;
}

// Deney adımları
export interface ExperimentStep {
  stepNumber: number;
  instruction?: string; // EN fallback
  instructionKey?: string; // i18n key
  duration?: string;
  tip?: string; // EN fallback
  tipKey?: string; // i18n key
}

// Haftalık görev
export interface WeeklyExperiment {
  id: string;
  weekNumber: number;
  title?: string; // EN fallback
  titleKey?: string; // i18n key
  description?: string;
  descriptionKey?: string;
  category: ExperimentCategory;
  difficulty: ExperimentDifficulty;
  estimatedTime: string;
  points: number;
  scientificName?: string;
  taxonId?: number;
  learningObjectives: string[];
  materials: RequiredMaterial[];
  steps: ExperimentStep[];
  safetyNotes?: string[];
  observationGuide: string[];
  expectedResults?: string[];
  expectedResultsKey?: string;
  ageGroups?: string[];
  parentRequired?: boolean;
  variants?: Record<
    string,
    { stepsCount?: number; estimatedTime?: string; steps?: ExperimentStep[] }
  >;
  status: "locked" | "available" | "in_progress" | "completed";
  unlocksAt?: string;
  completedAt?: string;
  userObservation?: {
    notes: string;
    photoUri?: string;
    rating: number;
    completedAt: string;
  };
  learningSummary?: string;
  ageSuitable?: boolean;
}

// Haftalık ilerleme
export interface WeeklyProgress {
  currentWeek: number;
  totalExperimentsCompleted: number;
  totalPoints: number;
  streak: number;
  badges: Badge[];
  unlockedCategories: ExperimentCategory[];
}

// Rozetler
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
}

// Zorluk puanları
export const difficultyPoints: Record<ExperimentDifficulty, number> = {
  kolay: 50,
  orta: 100,
  zor: 200,
  uzman: 350,
};

// Kategori ikonları
export const categoryIcons: Record<ExperimentCategory, string> = {
  "Mikroskop Gözlemi": "🔬",
  "Hücre Biyolojisi": "🧫",
  Mikroorganizmalar: "🦠",
  "Kristal Oluşumu": "💎",
  "Bitki Anatomisi": "🌱",
  "Su Yaşamı": "💧",
  Mantarlar: "🍄",
  "Kimyasal Reaksiyon": "⚗️",
};

// Zorluk renkleri
export const difficultyColors: Record<ExperimentDifficulty, string> = {
  kolay: "#4ADE80",
  orta: "#FBBF24",
  zor: "#FB923C",
  uzman: "#EF4444",
};
