"use client";

import { useEffect } from "react";
import { create } from "zustand";
import {
  resolveTimeTheme,
  type ResolvedTimeTheme,
  type TimeThemeMode,
} from "@/lib/theme-config";

const STORAGE_KEY = "vincent-ai-frontier-time-theme";

type TimeThemeState = {
  mode: TimeThemeMode;
  resolvedTheme: ResolvedTimeTheme;
  hasHydrated: boolean;
  hydrate: () => void;
  refresh: () => void;
  setMode: (mode: TimeThemeMode) => void;
};

function getAutomaticTheme() {
  return resolveTimeTheme(new Date().getHours());
}

export const useTimeTheme = create<TimeThemeState>((set, get) => ({
  mode: "auto",
  resolvedTheme: "night",
  hasHydrated: false,
  hydrate: () => {
    const savedMode = window.localStorage.getItem(STORAGE_KEY);
    const mode: TimeThemeMode =
      savedMode === "day" || savedMode === "night" || savedMode === "auto" ? savedMode : "auto";
    set({
      mode,
      resolvedTheme: mode === "auto" ? getAutomaticTheme() : mode,
      hasHydrated: true,
    });
  },
  refresh: () => {
    if (get().mode === "auto") set({ resolvedTheme: getAutomaticTheme() });
  },
  setMode: (mode) => {
    window.localStorage.setItem(STORAGE_KEY, mode);
    set({ mode, resolvedTheme: mode === "auto" ? getAutomaticTheme() : mode });
  },
}));

export function TimeThemeSync() {
  const hydrate = useTimeTheme((state) => state.hydrate);
  const refresh = useTimeTheme((state) => state.refresh);

  useEffect(() => {
    hydrate();
    const interval = window.setInterval(refresh, 60_000);
    return () => window.clearInterval(interval);
  }, [hydrate, refresh]);

  return null;
}
