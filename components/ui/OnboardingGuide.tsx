"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useGameStore } from "@/hooks/useGameStore";
import { useLanguage } from "@/hooks/useLanguage";
import { translations } from "@/lib/translations";

export function OnboardingGuide() {
  const language = useLanguage((state) => state.language);
  const hasDismissedGuide = useGameStore((state) => state.hasDismissedGuide);
  const dismissGuide = useGameStore((state) => state.dismissGuide);
  const reducedMotion = useReducedMotion();
  const t = translations[language];

  return (
    <AnimatePresence>
      {!hasDismissedGuide && (
        <motion.aside
          className="onboarding-guide pointer-events-auto"
          initial={reducedMotion ? false : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
        >
          <p className="hud-kicker">{t.guideTitle}</p>
          <strong>{t.guideContent}</strong>
          <button type="button" onClick={dismissGuide}>
            {t.gotIt}
          </button>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
