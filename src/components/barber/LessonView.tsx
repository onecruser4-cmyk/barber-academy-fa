"use client";

import { useEffect } from "react";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Gauge,
  Lightbulb,
  AlertTriangle,
  Wrench,
  Bookmark,
  BookmarkCheck,
  ListOrdered,
} from "lucide-react";
import { FlatLesson, getPrevLessonId, getNextLessonId } from "@/data/curriculum";
import { ProgressApi } from "@/lib/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import FadeDiagram from "./FadeDiagram";

const diffColor: Record<string, string> = {
  "مبتدی": "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  "متوسط": "bg-amber-500/10 text-amber-400 border-amber-500/30",
  "پیشرفته": "bg-red-500/10 text-red-400 border-red-500/30",
};

interface LessonViewProps {
  flat: FlatLesson;
  progress: ProgressApi;
  onBack: (moduleId: string) => void;
  onOpenLesson: (lessonId: string) => void;
}

export default function LessonView({ flat, progress, onBack, onOpenLesson }: LessonViewProps) {
  const { lesson, module } = flat;
  const prevId = getPrevLessonId(lesson.id);
  const nextId = getNextLessonId(lesson.id);
  const done = progress.isDone(lesson.id);
  const bookmarked = progress.isBookmarked(lesson.id);

  useEffect(() => {
    progress.setLastLesson(lesson.id);
  }, [lesson.id, progress]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-in fade-in duration-400">
      <button
        onClick={() => onBack(module.id)}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gold-300 transition-colors mb-6 cursor-pointer"
      >
        <ArrowRight className="w-4 h-4" />
        فصل {module.number}: {module.title}
      </button>

      {/* title */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="outline" className={`text-[11px] gap-1 ${diffColor[lesson.difficulty] ?? ""}`}>
            <Gauge className="w-3 h-3" />
            {lesson.difficulty}
          </Badge>
          <Badge variant="outline" className="text-[11px] gap-1 border-gold-500/25 text-gold-400/90">
            <Clock className="w-3 h-3" />
            {lesson.duration}
          </Badge>
          <button
            onClick={() => progress.toggleBookmark(lesson.id)}
            className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
              bookmarked
                ? "border-gold-500/50 bg-gold-500/15 text-gold-300"
                : "border-gold-500/20 text-muted-foreground hover:text-gold-300 hover:border-gold-500/40"
            }`}
            aria-label={bookmarked ? "حذف نشانک" : "افزودن نشانک"}
          >
            {bookmarked ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            {bookmarked ? "نشانک‌دار" : "نشانک"}
          </button>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black leading-snug mb-2">{lesson.title}</h1>
        <p className="text-gold-300/90 text-sm sm:text-base">{lesson.subtitle}</p>
      </div>

      {/* intro */}
      <div className="rounded-2xl border border-gold-500/20 bg-gradient-to-bl from-card to-panel p-5 sm:p-6 mb-6">
        <p className="text-[15px] leading-8 text-foreground/90">{lesson.intro}</p>
      </div>

      {/* fade diagram */}
      {lesson.fadeType && (
        <div className="mb-6">
          <FadeDiagram type={lesson.fadeType} />
        </div>
      )}

      {/* tools */}
      <div className="rounded-2xl border border-gold-500/15 bg-card/60 p-5 sm:p-6 mb-8">
        <h2 className="flex items-center gap-2 font-bold text-gold-300 mb-3">
          <Wrench className="w-5 h-5" />
          ابزارهای لازم
        </h2>
        <div className="flex flex-wrap gap-2">
          {lesson.tools.map((t) => (
            <span
              key={t}
              className="text-xs sm:text-[13px] px-3 py-1.5 rounded-full bg-secondary/80 border border-gold-500/15 text-foreground/85"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* steps */}
      <h2 className="flex items-center gap-2 text-xl font-black mb-6">
        <ListOrdered className="w-5 h-5 text-gold-400" />
        آموزش مو به مو
      </h2>
      <div className="space-y-0 mb-10">
        {lesson.steps.map((step, i) => (
          <div key={i} className="step-item relative pb-6">
            <div className="step-line relative pr-14">
              <div className="absolute right-0 top-0 w-11 h-11 rounded-xl bg-gold-500/12 border border-gold-500/30 flex items-center justify-center">
                <span className="font-black text-gold-400">{(i + 1).toLocaleString("fa-IR")}</span>
              </div>
              <div className="pt-1">
                <h3 className="font-bold text-[15px] mb-2 text-gold-200">{step.title}</h3>
                <p className="text-[14.5px] leading-8 text-foreground/85">{step.detail}</p>
                {step.tip && (
                  <div className="mt-3 rounded-xl border border-gold-500/25 bg-gold-500/[0.07] px-4 py-3 flex gap-2.5">
                    <Lightbulb className="w-4.5 h-4.5 text-gold-400 shrink-0 mt-0.5" />
                    <p className="text-[13.5px] leading-7 text-gold-200/90">{step.tip}</p>
                  </div>
                )}
                {step.warning && (
                  <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/[0.06] px-4 py-3 flex gap-2.5">
                    <AlertTriangle className="w-4.5 h-4.5 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-[13.5px] leading-7 text-red-200/90">{step.warning}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* pro tips */}
      <div className="rounded-2xl border border-gold-500/30 bg-gradient-to-bl from-gold-500/[0.08] to-transparent p-5 sm:p-6 mb-6">
        <h2 className="flex items-center gap-2 font-black text-lg mb-4 text-gold-300">
          <Lightbulb className="w-5 h-5" />
          نکات حرفه‌ای
        </h2>
        <ul className="space-y-3">
          {lesson.proTips.map((tip, i) => (
            <li key={i} className="flex gap-3 text-[14.5px] leading-8 text-foreground/90">
              <span className="shrink-0 mt-2.5 w-2 h-2 rounded-full bg-gold-500" aria-hidden />
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* mistakes */}
      <div className="rounded-2xl border border-red-500/30 bg-gradient-to-bl from-red-500/[0.07] to-transparent p-5 sm:p-6 mb-10">
        <h2 className="flex items-center gap-2 font-black text-lg mb-4 text-red-300">
          <AlertTriangle className="w-5 h-5" />
          اشتباهات رایجی که نباید مرتکب شوید
        </h2>
        <ul className="space-y-3">
          {lesson.mistakes.map((m, i) => (
            <li key={i} className="flex gap-3 text-[14.5px] leading-8 text-foreground/90">
              <span className="shrink-0 mt-2.5 w-2 h-2 rounded-full bg-red-500" aria-hidden />
              {m}
            </li>
          ))}
        </ul>
      </div>

      {/* complete + navigation */}
      <div className="rounded-2xl border border-gold-500/20 bg-card/70 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-stretch gap-3 mb-5">
          <Button
            onClick={() => progress.toggleDone(lesson.id)}
            className={`flex-1 gap-2 h-12 font-bold cursor-pointer ${
              done
                ? "bg-emerald-600/90 hover:bg-emerald-500 text-white"
                : "bg-gold-500 hover:bg-gold-400 text-[#14100d]"
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            {done ? "این درس را کامل خواندم ✓ (برای لغو کلیک کنید)" : "این درس را کامل خواندم"}
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {prevId ? (
            <Button
              variant="outline"
              onClick={() => onOpenLesson(prevId)}
              className="gap-2 border-gold-500/25 hover:bg-gold-500/10 hover:text-gold-200 cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              درس قبلی
            </Button>
          ) : (
            <span />
          )}
          {nextId && (
            <Button
              variant="outline"
              onClick={() => onOpenLesson(nextId)}
              className="gap-2 border-gold-500/40 text-gold-300 hover:bg-gold-500/10 hover:text-gold-200 cursor-pointer"
            >
              درس بعدی
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
