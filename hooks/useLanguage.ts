"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Language } from "@/lib/translations";

type LanguageState = {
  language: Language;
  setLanguage: (language: Language) => void;
};

export const useLanguage = create<LanguageState>()(
  persist(
    (set) => ({
      language: "zh",
      setLanguage: (language) => set({ language }),
    }),
    {
      name: "vincent-ai-frontier-language",
    },
  ),
);
