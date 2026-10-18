export type Difficulty = "مبتدی" | "متوسط" | "پیشرفته";

export interface LessonStep {
  title: string;
  detail: string;
  tip?: string;
  warning?: string;
}

export type FadeType =
  | "low"
  | "mid"
  | "high"
  | "skin"
  | "taper"
  | "burst"
  | "drop";

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  difficulty: Difficulty;
  fadeType?: FadeType;
  intro: string;
  tools: string[];
  steps: LessonStep[];
  proTips: string[];
  mistakes: string[];
}

export interface Module {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  lessons: Lesson[];
}

export interface SearchResult {
  lesson: Lesson;
  moduleId: string;
  moduleTitle: string;
  moduleNumber: string;
}
