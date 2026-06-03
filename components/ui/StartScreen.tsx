"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useGameStore } from "@/hooks/useGameStore";
import { useLanguage } from "@/hooks/useLanguage";
import { translations } from "@/lib/translations";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { BgmControls } from "@/components/audio/BgmControls";
import { useBgm } from "@/hooks/useBgm";
import { bgmTracks } from "@/lib/bgm-config";

const SPAWN_DELAY_MS = 760;
const particles = Array.from({ length: 18 }, (_, index) => ({
  delay: -((index * 0.23) % 2.4),
  duration: 2.8 + (index % 5) * 0.24,
  size: 3 + (index % 3) * 2,
  x: ((index * 47) % 360) - 180,
}));

export function StartScreen() {
  const language = useLanguage((state) => state.language);
  const isSpawning = useGameStore((state) => state.isSpawning);
  const beginSpawn = useGameStore((state) => state.beginSpawn);
  const completeSpawn = useGameStore((state) => state.completeSpawn);
  const setClassicView = useGameStore((state) => state.setClassicView);
  const isPlaying = useBgm((state) => state.isPlaying);
  const pauseBgm = useBgm((state) => state.pause);
  const playOpeningMusic = useBgm((state) => state.playOpeningMusic);
  const prepareIntro = useBgm((state) => state.prepareIntro);
  const startIntro = useBgm((state) => state.startIntro);
  const reducedMotion = useReducedMotion();
  const timeoutRef = useRef<number | null>(null);
  const t = translations[language];
  const openingTrack = bgmTracks.spawnObeliskAwakening;

  useEffect(
    () => () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    },
    [],
  );

  useEffect(() => {
    prepareIntro();
  }, [prepareIntro]);

  const handleSpawn = () => {
    if (isSpawning) return;
    startIntro();
    beginSpawn();
    timeoutRef.current = window.setTimeout(completeSpawn, reducedMotion ? 80 : SPAWN_DELAY_MS);
  };

  return (
    <motion.section
      aria-label={t.startScreenLabel}
      className={`start-screen ${isSpawning ? "spawning" : ""}`}
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0 : isSpawning ? 0.72 : 0.36 }}
    >
      <div className="start-screen-controls">
        <BgmControls compact />
        <ThemeToggle />
        <LanguageToggle />
        <button className="hud-button" type="button" disabled={isSpawning} onClick={() => setClassicView(true)}>
          {t.classicView}
        </button>
      </div>

      <div className="start-screen-scene" aria-hidden="true">
        <div className="start-screen-horizon" />
        <div className="start-screen-building start-screen-building-left" />
        <div className="start-screen-building start-screen-building-right" />
        <div className="start-screen-tree start-screen-tree-left" />
        <div className="start-screen-tree start-screen-tree-right" />
        <div className="start-screen-lamp start-screen-lamp-left" />
        <div className="start-screen-lamp start-screen-lamp-right" />
        <div className="start-screen-plaza">
          <span className="start-screen-rune start-screen-rune-one" />
          <span className="start-screen-rune start-screen-rune-two" />
          <span className="start-screen-rune start-screen-rune-three" />
        </div>
        <div className="start-screen-obelisk">
          <span />
        </div>
        <div className="start-screen-hero">
          <span className="start-screen-hero-head" />
          <span className="start-screen-hero-body" />
          <span className="start-screen-hero-cape" />
          <span className="start-screen-hero-sword" />
        </div>
        <div className="start-screen-particles">
          {particles.map((particle, index) => (
            <span
              key={index}
              style={
                {
                  "--particle-delay": `${particle.delay}s`,
                  "--particle-duration": `${particle.duration}s`,
                  "--particle-size": `${particle.size}px`,
                  "--particle-x": `${particle.x}px`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      </div>

      <motion.div
        className="start-screen-copy"
        initial={reducedMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reducedMotion ? 0 : 0.2, duration: reducedMotion ? 0 : 0.45 }}
      >
        <p className="start-screen-kicker">{t.startScreenKicker}</p>
        <button className="start-screen-action" type="button" disabled={isSpawning} onClick={handleSpawn}>
          <strong>{isSpawning ? t.startScreenAwakening : t.startScreenAction}</strong>
          <span>{t.startScreenSubtitle}</span>
        </button>
        <button
          aria-pressed={isPlaying}
          className="start-screen-music"
          type="button"
          disabled={isSpawning}
          onClick={isPlaying ? pauseBgm : playOpeningMusic}
        >
          <span aria-hidden="true">{isPlaying ? "Ⅱ" : "♪"}</span>
          <strong>{isPlaying ? t.pauseMusic : t.playOpeningMusic}</strong>
          <small>{language === "zh" ? openingTrack.labelZh : openingTrack.labelEn}</small>
        </button>
        <small>{t.startScreenHint}</small>
      </motion.div>
    </motion.section>
  );
}
