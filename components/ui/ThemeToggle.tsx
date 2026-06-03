"use client";

import { useTimeTheme } from "@/hooks/useTimeTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { translations } from "@/lib/translations";
import type { TimeThemeMode } from "@/lib/theme-config";

const modes: TimeThemeMode[] = ["auto", "day", "night"];

export function ThemeToggle() {
  const language = useLanguage((state) => state.language);
  const mode = useTimeTheme((state) => state.mode);
  const resolvedTheme = useTimeTheme((state) => state.resolvedTheme);
  const setMode = useTimeTheme((state) => state.setMode);
  const t = translations[language];

  return (
    <div className="theme-control">
      <span className="theme-mode-status">
        <span aria-hidden="true">{resolvedTheme === "day" ? "☀" : "☾"}</span>
        {resolvedTheme === "day" ? t.dayMode : t.nightMode}
      </span>
      <div className="theme-toggle" role="group" aria-label={t.timeTheme}>
        {modes.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={mode === item}
            className={mode === item ? "active" : ""}
            onClick={() => setMode(item)}
          >
            {t[item]}
          </button>
        ))}
      </div>
    </div>
  );
}
