"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Search, Clock, Gauge, Scissors, Wrench, Zap, Crown, Sparkles, Flame, User, Briefcase } from "lucide-react";
import { searchLessons } from "@/data/curriculum";

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

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenLesson: (lessonId: string) => void;
}

export default function SearchDialog({ open, onOpenChange, onOpenLesson }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ReturnType<typeof searchLessons>>([]);

  useEffect(() => {
    setResults(searchLessons(query));
  }, [query]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader className="sr-only">
        <DialogTitle>جستجو در درس‌ها</DialogTitle>
        <DialogDescription>در عنوان و متن همه درس‌ها جستجو کنید</DialogDescription>
      </DialogHeader>
      <DialogContent className="overflow-hidden p-0" showCloseButton>
        <Command
          shouldFilter={false}
          className="bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5"
        >
          <CommandInput
            placeholder="جستجو در درس‌ها… (مثلاً: اسکین فید، تیج، ریش)"
            onValueChange={setQuery}
          />
          <CommandList className="thin-scroll min-h-72 max-h-[60vh]">
        {results.length === 0 && (
          <CommandEmpty>
            {query.trim() ? "چیزی پیدا نشد؛ عبارت دیگری امتحان کنید." : "عبارتی بنویسید تا در ۳۷ درس جستجو کنیم."}
          </CommandEmpty>
        )}
        {results.length > 0 && (
          <CommandGroup heading={`${results.length.toLocaleString("fa-IR")} نتیجه`}>
            {results.slice(0, 14).map((r) => {
              const Icon = iconMap["scissors"] ?? Scissors;
              return (
                <CommandItem
                  key={r.lesson.id}
                  onSelect={() => {
                    onOpenChange(false);
                    onOpenLesson(r.lesson.id);
                  }}
                  className="gap-3 cursor-pointer"
                >
                  <Icon className="w-4 h-4 text-gold-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate">{r.lesson.title}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <span>فصل {r.moduleNumber}: {r.moduleTitle}</span>
                      <span className="flex items-center gap-1"><Gauge className="w-3 h-3" />{r.lesson.difficulty}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{r.lesson.duration}</span>
                    </div>
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
