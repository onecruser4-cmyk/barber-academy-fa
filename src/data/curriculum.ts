import { Module, SearchResult } from "./types";
import { basicsModule } from "./modules/basics";
import { techniquesModule } from "./modules/techniques";
import { fadeModulePart1 } from "./modules/fade1";
import { fadeModulePart2 } from "./modules/fade2";
import { classicModule } from "./modules/classic";
import { modernModule } from "./modules/modern";
import { traditionalModule } from "./modules/traditional";
import { beardModule } from "./modules/beard";
import { proModule } from "./modules/pro";

export const modules: Module[] = [
  basicsModule,
  techniquesModule,
  fadeModulePart1,
  fadeModulePart2,
  classicModule,
  modernModule,
  traditionalModule,
  beardModule,
  proModule,
];

export interface FlatLesson {
  lesson: import("./types").Lesson;
  module: Module;
}

export const allLessons: FlatLesson[] = modules.flatMap((m) =>
  m.lessons.map((l) => ({ lesson: l, module: m }))
);

export const totalLessonCount = allLessons.length;

export function getModuleById(id: string): Module | undefined {
  return modules.find((m) => m.id === id);
}

export function getLessonById(id: string): FlatLesson | undefined {
  return allLessons.find((x) => x.lesson.id === id);
}

export function getNextLessonId(id: string): string | undefined {
  const idx = allLessons.findIndex((x) => x.lesson.id === id);
  if (idx >= 0 && idx < allLessons.length - 1) return allLessons[idx + 1].lesson.id;
  return undefined;
}

export function getPrevLessonId(id: string): string | undefined {
  const idx = allLessons.findIndex((x) => x.lesson.id === id);
  if (idx > 0) return allLessons[idx - 1].lesson.id;
  return undefined;
}

export function searchLessons(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results: SearchResult[] = [];
  for (const m of modules) {
    for (const l of m.lessons) {
      const haystack = [
        l.title,
        l.subtitle,
        l.intro,
        ...l.steps.map((s) => s.title + " " + s.detail),
        ...l.proTips,
        ...l.mistakes,
        ...l.tools,
      ]
        .join(" ")
        .toLowerCase();
      if (haystack.includes(q)) {
        results.push({
          lesson: l,
          moduleId: m.id,
          moduleTitle: m.title,
          moduleNumber: m.number,
        });
      }
    }
  }
  return results;
}
