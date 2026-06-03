"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { translations } from "@/lib/translations";

export function LanguageToggle() {
  const language = useLanguage((state) => state.language);
  const setLanguage = useLanguage((state) => state.setLanguage);
  const t = translations[language];

  return (
    <div className="language-toggle" role="group" aria-label={t.languageLabel}>
      <button
        type="button"
        aria-pressed={language === "zh"}
        className={language === "zh" ? "active" : ""}
        onClick={() => setLanguage("zh")}
      >
        {t.chinese}
      </button>
      <button
        type="button"
        aria-pressed={language === "en"}
        className={language === "en" ? "active" : ""}
        onClick={() => setLanguage("en")}
      >
        {t.english}
      </button>
    </div>
  );
}
