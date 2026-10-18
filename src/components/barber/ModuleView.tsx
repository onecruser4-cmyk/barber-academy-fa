"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Gauge,
  ChevronLeft,
  Scissors,
  Wrench,
  Zap,
  Crown,
  Sparkles,
  Flame,
  User,
  Briefcase,
} from "lucide-react";
import { Module } from "@/data/types";
import { ProgressApi } from "@/lib/progress";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const iconMap: Record<string, typeof Scissors> = {
  scissors: Scissors,
  wrench: Wrench,
  zap: Zap,
  crown: Crown,
  sparkles: Sparkles,
  flame: Flame,
  user: User,
  briefcase: Briefcase,
};

const diffColor: Record<string, string> = {
  "مبتدی": "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  "متوسط": "bg-amber-500/10 text-amber-400 border-amber-500/30",
  "پیشرفته": "bg-red-500/10 text-red-400 border-red-500/30",
};

interface ModuleViewProps {
  module: Module;
  progress: ProgressApi;
  onBack: () => void;
  onOpenLesson: (lessonId: string) => void;
}

export default function ModuleView({ module, progress, onBack, onOpenLesson }: ModuleViewProps) {
  const Icon = iconMap[module.icon] ?? Scissors;
  const doneCount = module.lessons.filter((l) => progress.isDone(l.id)).length;
  const pct = Math.round((doneCount / module.lessons.length) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-in fade-in duration-400">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gold-300 transition-colors mb-6 cursor-pointer"
      >
        <ArrowRight className="w-4 h-4" />
        بازگشت به مسیر یادگیری
      </button>

      {/* header */}
      <div className="rounded-2xl border border-gold-500/20 bg-gradient-to-bl from-card to-panel p-6 sm:p-8 mb-8 relative overflow-hidden">
        <div className="absolute -top-6 -left-4 text-[7rem] font-black text-gold-500/8 leading-none select-none" aria-hidden>
          {module.number}
        </div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center">
              <Icon className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <div className="text-xs text-gold-400/80 mb-0.5">فصل {module.number}</div>
              <h1 className="text-2xl sm:text-3xl font-black">{module.title}</h1>
            </div>
          </div>
          <p className="text-gold-300/90 text-sm font-medium mb-3">{module.tagline}</p>
          <p className="text-sm text-muted-foreground leading-7 mb-5">{module.description}</p>
          {progress.mounted && (
            <div className="max-w-md">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                <span>{doneCount.toLocaleString("fa-IR")} از {module.lessons.length.toLocaleString("fa-IR")} درس</span>
                <span>{pct.toLocaleString("fa-IR")}٪</span>
              </div>
              <Progress value={pct} className="h-2 bg-secondary" />
            </div>
          )}
        </div>
      </div>

      {/* lessons */}
      <div className="space-y-4">
        {module.lessons.map((lesson, i) => {
          const done = progress.isDone(lesson.id);
          const bookmarked = progress.isBookmarked(lesson.id);
          return (
            <motion.button
              key={lesson.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.35 }}
              onClick={() => onOpenLesson(lesson.id)}
              className={`w-full text-right rounded-2xl border p-5 transition-all cursor-pointer group focus-visible:outline-2 focus-visible:outline-gold-500 ${
                done
                  ? "border-emerald-500/30 bg-emerald-500/[0.04] hover:border-emerald-500/50"
                  : "border-gold-500/15 bg-card/60 hover:border-gold-500/40 hover:bg-card"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                    done
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/40"
                      : "bg-gold-500/10 text-gold-400 border border-gold-500/25"
                  }`}
                >
                  {done ? <CheckCircle2 className="w-5 h-5" /> : (i + 1).toLocaleString("fa-IR")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-bold group-hover:text-gold-300 transition-colors">{lesson.title}</h3>
                    {bookmarked && <span className="text-gold-400 text-xs">★</span>}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 leading-6">{lesson.subtitle}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className={`text-[11px] gap-1 ${diffColor[lesson.difficulty] ?? ""}`}>
                      <Gauge className="w-3 h-3" />
                      {lesson.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-[11px] gap-1 border-gold-500/25 text-gold-400/90">
                      <Clock className="w-3 h-3" />
                      {lesson.duration}
                    </Badge>
                  </div>
                </div>
                <ChevronLeft className="shrink-0 w-5 h-5 text-gold-500/40 group-hover:text-gold-400 group-hover:-translate-x-0.5 transition-all mt-1" />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
