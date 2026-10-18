"use client";

import { useCallback, useEffect, useState } from "react";
import { Scissors, Search } from "lucide-react";
import { getModuleById, getLessonById, totalLessonCount } from "@/data/curriculum";
import { useProgress } from "@/lib/progress";
import { Button } from "@/components/ui/button";
import HomeView from "./HomeView";
import ModuleView from "./ModuleView";
import LessonView from "./LessonView";
import SearchDialog from "./SearchDialog";

type Route = { view: "home" } | { view: "module"; moduleId: string } | { view: "lesson"; lessonId: string };

export default function BarberApp() {
  const [route, setRoute] = useState<Route>({ view: "home" });
  const [searchOpen, setSearchOpen] = useState(false);
  const progress = useProgress();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [route]);

  const openModule = useCallback((moduleId: string) => {
    setRoute({ view: "module", moduleId });
  }, []);

  const openLesson = useCallback((lessonId: string) => {
    setRoute({ view: "lesson", lessonId });
  }, []);

  const goHome = useCallback(() => setRoute({ view: "home" }), []);

  // keyboard shortcut for search (Ctrl+K / Cmd+K)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const doneCount = progress.done.filter((id) => getLessonById(id)).length;
  const pct = Math.round((doneCount / totalLessonCount) * 100);

  let content: React.ReactNode;
  if (route.view === "home") {
    content = <HomeView progress={progress} onOpenModule={openModule} onOpenLesson={openLesson} />;
  } else if (route.view === "module") {
    const mod = getModuleById(route.moduleId);
    content = mod ? (
      <ModuleView module={mod} progress={progress} onBack={goHome} onOpenLesson={openLesson} />
    ) : (
      <HomeView progress={progress} onOpenModule={openModule} onOpenLesson={openLesson} />
    );
  } else {
    const flat = getLessonById(route.lessonId);
    content = flat ? (
      <LessonView flat={flat} progress={progress} onBack={openModule} onOpenLesson={openLesson} />
    ) : (
      <HomeView progress={progress} onOpenModule={openModule} onOpenLesson={openLesson} />
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* header */}
      <header className="sticky top-0 z-40 border-b border-gold-500/15 bg-background/85 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <button onClick={goHome} className="flex items-center gap-3 cursor-pointer group">
            <div className="relative w-9 h-9 rounded-xl bg-gold-500/15 border border-gold-500/35 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-x-0 bottom-0 h-1 barber-pole opacity-70" aria-hidden />
              <Scissors className="w-5 h-5 text-gold-400 relative" />
            </div>
            <div className="text-right leading-tight">
              <div className="font-black text-[15px] group-hover:text-gold-300 transition-colors">آکادمی آرایشگری مردانه</div>
              <div className="text-[11px] text-muted-foreground">از صفر تا استادی</div>
            </div>
          </button>

          <div className="flex items-center gap-2">
            {progress.mounted && (
              <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground border border-gold-500/20 rounded-full px-3 py-1.5">
                <div className="w-24 h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-gold-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-gold-300 font-bold">{pct.toLocaleString("fa-IR")}٪</span>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchOpen(true)}
              className="gap-2 border-gold-500/25 text-foreground/80 hover:bg-gold-500/10 hover:text-gold-200 cursor-pointer"
              aria-label="جستجو در درس‌ها"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">جستجو</span>
              <kbd className="hidden md:inline-flex h-5 select-none items-center rounded border border-gold-500/30 bg-secondary px-1.5 font-mono text-[10px] text-muted-foreground">
                Ctrl K
              </kbd>
            </Button>
          </div>
        </div>
      </header>

      {/* main */}
      <main className="flex-1">{content}</main>

      {/* footer — sticks to bottom, pushed naturally when content overflows */}
      <footer className="mt-auto border-t border-gold-500/15 bg-card/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Scissors className="w-4 h-4 text-gold-500/70" />
            <span>آکادمی آرایشگری مردانه — آموزش صفر تا صد به زبان فارسی</span>
          </div>
          <div className="text-xs">
            پیشرفت شما روی همین دستگاه ذخیره می‌شود • {totalLessonCount.toLocaleString("fa-IR")} درس رایگان
          </div>
        </div>
      </footer>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} onOpenLesson={openLesson} />
    </div>
  );
}
