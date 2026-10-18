"use client";

import { motion } from "framer-motion";
import {
  Scissors,
  Wrench,
  Zap,
  Crown,
  Sparkles,
  Flame,
  User,
  Briefcase,
  ArrowLeft,
  Play,
  CheckCircle2,
  BookOpen,
  GraduationCap,
  Clock,
  Layers,
} from "lucide-react";
import { Module } from "@/data/types";
import { modules, totalLessonCount } from "@/data/curriculum";
import { ProgressApi } from "@/lib/progress";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

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

interface HomeViewProps {
  progress: ProgressApi;
  onOpenModule: (moduleId: string) => void;
  onOpenLesson: (lessonId: string) => void;
}

export default function HomeView({ progress, onOpenModule, onOpenLesson }: HomeViewProps) {
  const doneCount = progress.done.length;
  const overallPct = Math.round((doneCount / totalLessonCount) * 100);

  const last = progress.lastLesson;
  const lastFlat = last ? modules.flatMap((m) => m.lessons).find((l) => l.id === last) : undefined;
  const nextTarget =
    modules.flatMap((m) => m.lessons).find((l) => !progress.isDone(l.id)) ??
    lastFlat;

  const continueTitle = lastFlat
    ? (progress.isDone(lastFlat.id) ? (nextTarget?.title ?? "دوره تکمیل شد") : lastFlat.title)
    : (nextTarget?.title ?? "دوره تکمیل شد");
  const continueId = lastFlat && !progress.isDone(lastFlat.id) ? lastFlat.id : nextTarget?.id;

  return (
    <div className="animate-in fade-in duration-500">
      {/* ---------- HERO ---------- */}
      <section className="relative hero-glow border-b border-gold-500/15 overflow-hidden">
        <div className="absolute top-0 right-8 h-64 w-2.5 barber-pole rounded-full opacity-60 hidden md:block" aria-hidden />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-1.5 text-sm text-gold-300 mb-6">
              <GraduationCap className="w-4 h-4" />
              دوره کامل فارسی — رایگان و گام‌به‌گام
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.15] mb-5">
              آرایشگری مردانه
              <br />
              <span className="gold-text">از صفر تا استادی</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-8 mb-8">
              از شناخت ابزار و پاس‌ها تا فیدهای حرفه‌ای، کوتاهی‌های کلاسیک، سبک‌های مدرن،
              سنتی و کوچه‌بازاری و حتی ریش و راه‌اندازی کار — همه‌چیز مو به مو، مرحله‌به‌مرحله
              و به زبان ساده فارسی. نه کلیپ یوتیوب لازم است، نه استادیوم؛ فقط دست و صبر.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <Button
                size="lg"
                onClick={() => onOpenModule(modules[0].id)}
                className="bg-gold-500 hover:bg-gold-400 text-[#14100d] font-bold gap-2 h-12 px-6"
              >
                <Play className="w-5 h-5" />
                شروع از فصل اول
              </Button>
              {continueId && (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => onOpenLesson(continueId)}
                  className="border-gold-500/40 text-gold-300 hover:bg-gold-500/10 hover:text-gold-200 gap-2 h-12 px-6"
                >
                  <ArrowLeft className="w-5 h-5" />
                  ادامه یادگیری: {continueTitle.length > 26 ? continueTitle.slice(0, 26) + "…" : continueTitle}
                </Button>
              )}
            </div>

            {/* stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: BookOpen, label: "فصل آموزشی", value: "۹ فصل" },
                { icon: Layers, label: "درس کامل", value: `${totalLessonCount.toLocaleString("fa-IR")} درس` },
                { icon: Scissors, label: "مدل و تکنیک", value: "۳۰+ مدل" },
                { icon: Clock, label: "زمان مطالعه", value: "۱۰+ ساعت" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-gold-500/15 bg-card/60 backdrop-blur px-4 py-3">
                  <s.icon className="w-5 h-5 text-gold-400 mb-2" />
                  <div className="text-lg font-bold text-gold-300">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------- PROGRESS STRIP ---------- */}
      {progress.mounted && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-0 pt-8">
          <div className="rounded-2xl border border-gold-500/20 bg-card/70 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gold-300">پیشرفت شما در دوره</span>
                <span className="text-sm text-muted-foreground">
                  {doneCount.toLocaleString("fa-IR")} از {totalLessonCount.toLocaleString("fa-IR")} درس ({overallPct.toLocaleString("fa-IR")}٪)
                </span>
              </div>
              <Progress value={overallPct} className="h-2.5 bg-secondary" />
            </div>
            <div className="shrink-0 text-center">
              <div className="text-2xl font-black gold-text">{overallPct.toLocaleString("fa-IR")}٪</div>
              <div className="text-xs text-muted-foreground">تکمیل‌شده</div>
            </div>
          </div>
        </section>
      )}

      {/* ---------- MODULES ---------- */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-2xl sm:text-3xl font-black mb-2">مسیر یادگیری</h2>
        <p className="text-muted-foreground mb-8">
          به ترتیب پیش بروید یا مستقیم به فصل مورد علاقه‌تان بپرید؛ هر درس مستقل و کامل است.
        </p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m: Module, i) => {
            const Icon = iconMap[m.icon] ?? Scissors;
            const modDone = m.lessons.filter((l) => progress.isDone(l.id)).length;
            const modPct = Math.round((modDone / m.lessons.length) * 100);
            return (
              <motion.button
                key={m.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                onClick={() => onOpenModule(m.id)}
                className="group text-right rounded-2xl border border-gold-500/15 bg-card/70 p-5 hover:border-gold-500/40 hover:bg-card transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-gold-500"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-11 h-11 rounded-xl bg-gold-500/12 border border-gold-500/25 flex items-center justify-center">
                    <Icon className="w-5.5 h-5.5 text-gold-400" />
                  </div>
                  <span className="text-4xl font-black text-gold-500/20 group-hover:text-gold-500/40 transition-colors leading-none">
                    {m.number}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-1 group-hover:text-gold-300 transition-colors">{m.title}</h3>
                <p className="text-sm text-gold-400/80 mb-2">{m.tagline}</p>
                <p className="text-sm text-muted-foreground leading-6 mb-4 line-clamp-2">{m.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>{m.lessons.length.toLocaleString("fa-IR")} درس</span>
                  {progress.mounted && (
                    <span className="flex items-center gap-1 text-emerald-500/90">
                      {modDone > 0 && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {modDone.toLocaleString("fa-IR")} انجام شد
                    </span>
                  )}
                </div>
                {progress.mounted && <Progress value={modPct} className="h-1.5 bg-secondary" />}
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* ---------- WHY ---------- */}
      <section className="border-t border-gold-500/10 bg-card/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl font-black mb-8 text-center">چرا این دوره؟</h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              {
                icon: Scissors,
                title: "مو به مو و مرحله‌به‌مرحله",
                desc: "هر تکنیک با شماره‌گذاری دقیق مراحل، زاویه ماشین، شماره پاس و نکات مچ دست توضیح داده شده؛ دقیقاً همان‌طور که استاد کنار سر شما می‌گوید.",
              },
              {
                icon: Zap,
                title: "تمرکز ویژه روی فید",
                desc: "بزرگ‌ترین فصل دوره برای فیدهاست: لو، مید، های، اسکین، تیپر، برست و دراپ — هرکدام با نقشه ارتفاع و تکنیک پولیش حرفه‌ای.",
              },
              {
                icon: Flame,
                title: "از سنتی تا مدرن",
                desc: "هم خوردگی و اصلاح سنتی و آتش‌گیری ایرانی، هم تکستچد کراپ و مولت و ولف کات؛ کامل‌ترین مجموعه فارسی برای همه سلیقه‌ها.",
              },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-gold-500/15 bg-background/60 p-6 text-center sm:text-right">
                <div className="w-12 h-12 mx-auto sm:mx-0 rounded-xl bg-gold-500/12 border border-gold-500/25 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-gold-400" />
                </div>
                <h3 className="font-bold mb-2 text-gold-300">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-7">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
