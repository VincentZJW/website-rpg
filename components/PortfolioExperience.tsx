"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { gameObjects, getNodeCopy } from "@/lib/game-data";
import { useGameStore } from "@/hooks/useGameStore";
import { useLanguage } from "@/hooks/useLanguage";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { TimeThemeSync, useTimeTheme } from "@/hooks/useTimeTheme";
import { translations } from "@/lib/translations";
import { ClassicView } from "@/components/ui/ClassicView";
import { DialogPanel } from "@/components/ui/DialogPanel";
import { HUD } from "@/components/ui/HUD";
import { MobileNotice } from "@/components/ui/MobileNotice";
import { StartScreen } from "@/components/ui/StartScreen";
import { BgmProvider } from "@/components/audio/BgmProvider";

const GameCanvas = dynamic(() => import("@/components/game/GameCanvas"), {
  ssr: false,
});

export function PortfolioExperience() {
  const language = useLanguage((state) => state.language);
  const hasStarted = useGameStore((state) => state.hasStarted);
  const isClassicView = useGameStore((state) => state.isClassicView);
  const timeTheme = useTimeTheme((state) => state.resolvedTheme);
  const isMobile = useMediaQuery("(max-width: 760px)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const t = translations[language];

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  }, [language]);

  useEffect(() => {
    document.documentElement.dataset.timeTheme = timeTheme;
  }, [timeTheme]);

  return (
    <BgmProvider>
      <TimeThemeSync />
      <div className="sr-only" aria-label={t.siteTitle}>
        <h2>{t.siteTitle}</h2>
        <p>{t.siteSubtitle}</p>
        {gameObjects.map((object) => (
          <section key={object.id}>
            <h3>{getNodeCopy(object, language).title}</h3>
            <p>{getNodeCopy(object, language).content}</p>
          </section>
        ))}
      </div>

      {isClassicView ? (
        <ClassicView />
      ) : (
        <main id="main-content" className="game-shell">
          <Suspense fallback={<div className="world-loading">{t.loadingWorld}</div>}>
            <GameCanvas language={language} reducedMotion={reducedMotion} timeTheme={timeTheme} />
          </Suspense>
          {hasStarted && <HUD />}
          {hasStarted && <DialogPanel />}
          {hasStarted && <MobileNotice isMobile={isMobile} />}
          <AnimatePresence>{!hasStarted && <StartScreen />}</AnimatePresence>
        </main>
      )}
    </BgmProvider>
  );
}
