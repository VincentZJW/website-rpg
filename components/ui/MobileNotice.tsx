"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useGameStore } from "@/hooks/useGameStore";
import { useLanguage } from "@/hooks/useLanguage";
import { translations } from "@/lib/translations";

export function MobileNotice({ isMobile }: { isMobile: boolean }) {
  const hasDismissedMobileNotice = useGameStore((state) => state.hasDismissedMobileNotice);
  const dismissMobileNotice = useGameStore((state) => state.dismissMobileNotice);
  const setClassicView = useGameStore((state) => state.setClassicView);
  const language = useLanguage((state) => state.language);
  const reduceMotion = useReducedMotion();
  const t = translations[language];
  const isOpen = isMobile && !hasDismissedMobileNotice;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          className="mobile-notice"
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 14 }}
        >
          <p className="hud-kicker">{t.mobileTitle}</p>
          <p>{t.mobileDescription}</p>
          <div>
            <button type="button" onClick={() => setClassicView(true)}>
              {t.useClassicView}
            </button>
            <button type="button" onClick={dismissMobileNotice}>
              {t.lightweightExplore}
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
