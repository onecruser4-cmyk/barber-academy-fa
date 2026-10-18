"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "barber-academy-progress-v1";

export interface ProgressState {
  done: string[];
  bookmarks: string[];
  lastLesson?: string;
}

const emptyState: ProgressState = { done: [], bookmarks: [] };

type Listener = () => void;

class ProgressStore {
  private state: ProgressState = emptyState;
  private listeners = new Set<Listener>();
  private loaded = false;

  private load() {
    if (this.loaded || typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ProgressState;
        this.state = {
          done: parsed.done ?? [],
          bookmarks: parsed.bookmarks ?? [],
          lastLesson: parsed.lastLesson,
        };
      }
    } catch {
      /* ignore */
    }
    this.loaded = true;
  }

  subscribe = (listener: Listener): (() => void) => {
    this.load();
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = (): ProgressState => {
    this.load();
    return this.state;
  };

  getServerSnapshot = (): ProgressState => emptyState;

  private emit(next: ProgressState) {
    this.state = next;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    this.listeners.forEach((l) => l());
  }

  toggleDone(id: string) {
    this.load();
    const done = this.state.done.includes(id)
      ? this.state.done.filter((x) => x !== id)
      : [...this.state.done, id];
    this.emit({ ...this.state, done });
  }

  markDone(id: string) {
    this.load();
    if (this.state.done.includes(id)) return;
    this.emit({ ...this.state, done: [...this.state.done, id] });
  }

  toggleBookmark(id: string) {
    this.load();
    const bookmarks = this.state.bookmarks.includes(id)
      ? this.state.bookmarks.filter((x) => x !== id)
      : [...this.state.bookmarks, id];
    this.emit({ ...this.state, bookmarks });
  }

  setLastLesson(id: string) {
    this.load();
    if (this.state.lastLesson === id) return;
    this.emit({ ...this.state, lastLesson: id });
  }
}

export const progressStore = new ProgressStore();

const emptySubscribe = () => () => {};

export function useProgress() {
  // detect client hydration without setState-in-effect
  const hydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const state = useSyncExternalStore(
    progressStore.subscribe,
    progressStore.getSnapshot,
    progressStore.getServerSnapshot
  );

  const isDone = useCallback((id: string) => state.done.includes(id), [state.done]);
  const isBookmarked = useCallback((id: string) => state.bookmarks.includes(id), [state.bookmarks]);

  return {
    mounted: hydrated,
    done: state.done,
    bookmarks: state.bookmarks,
    lastLesson: state.lastLesson,
    isDone,
    isBookmarked,
    toggleDone: (id: string) => progressStore.toggleDone(id),
    markDone: (id: string) => progressStore.markDone(id),
    toggleBookmark: (id: string) => progressStore.toggleBookmark(id),
    setLastLesson: (id: string) => progressStore.setLastLesson(id),
  };
}

export type ProgressApi = ReturnType<typeof useProgress>;
