"use client";

import { gameObjects, getNodeCopy } from "@/lib/game-data";
import { useGameStore } from "@/hooks/useGameStore";
import { useLanguage } from "@/hooks/useLanguage";
import { profileConfig } from "@/lib/profile-config";
import { translations } from "@/lib/translations";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { Minimap } from "@/components/ui/Minimap";
import { OnboardingGuide } from "@/components/ui/OnboardingGuide";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { BgmControls } from "@/components/audio/BgmControls";

export function HUD() {
  const language = useLanguage((state) => state.language);
  const nearbyObjectId = useGameStore((state) => state.nearbyObjectId);
  const activeObjectId = useGameStore((state) => state.activeObjectId);
  const discoveredObjectIds = useGameStore((state) => state.discoveredObjectIds);
  const setClassicView = useGameStore((state) => state.setClassicView);
  const resetProgress = useGameStore((state) => state.resetProgress);
  const t = translations[language];
  const nearbyObject = gameObjects.find((object) => object.id === nearbyObjectId);
  const nearbyCopy = nearbyObject ? getNodeCopy(nearbyObject, language) : null;
  const hasViewedAllSections = discoveredObjectIds.length === gameObjects.length;

  return (
    <header className="hud pointer-events-none">
      <a className="skip-link pointer-events-auto" href="#main-content">
        {t.skipToContent}
      </a>

      <div className="hud-top-left">
        <p className="hud-kicker">{t.personalWebsiteLabel}</p>
        <h1>{t.siteTitle}</h1>
        <p>{t.siteSubtitle}</p>
      </div>

      <div className="hud-top-right pointer-events-auto">
        <BgmControls />
        <ThemeToggle />
        <LanguageToggle />
        <button className="hud-button" type="button" onClick={() => setClassicView(true)}>
          {t.classicView}
        </button>
      </div>

      <OnboardingGuide />

      <div className="hud-left-stack">
        <div className="controls-card">
          <p className="hud-kicker">{t.controls}</p>
          <dl>
            <div>
              <dt>{t.move}</dt>
              <dd>{t.moveKeys}</dd>
            </div>
            <div>
              <dt>{t.interact}</dt>
              <dd>{t.interactKey}</dd>
            </div>
            <div>
              <dt>{t.close}</dt>
              <dd>{t.closeKey}</dd>
            </div>
          </dl>
          <div className="hud-mini-actions pointer-events-auto">
            <button type="button" onClick={resetProgress}>
              {t.resetProgress}
            </button>
          </div>
        </div>
      </div>

      <div className="hud-right-stack">
        <section className={`quest-card ${hasViewedAllSections ? "complete" : ""}`}>
          <p className="hud-kicker">{t.questTitle}</p>
          <strong>{t.profileProgress(discoveredObjectIds.length, gameObjects.length)}</strong>
          <div className="quest-progress">
            <span style={{ width: `${(discoveredObjectIds.length / gameObjects.length) * 100}%` }} />
          </div>
          <div className="quest-nodes" aria-label={t.journey}>
            {gameObjects.map((object) => {
              const copy = getNodeCopy(object, language);
              const isDiscovered = discoveredObjectIds.includes(object.id);
              return (
                <span className={isDiscovered ? "discovered" : ""} key={object.id} title={copy.label}>
                  {object.icon}
                </span>
              );
            })}
          </div>
          {hasViewedAllSections && <small>{t.questComplete}</small>}
        </section>
        <Minimap />
      </div>

      {!activeObjectId && (
        <div className={`interaction-card ${nearbyObject ? "visible" : ""}`} aria-live="polite">
          {nearbyObject && nearbyCopy ? (
            <>
              <p>{t.interactionWith}</p>
              <strong>
                <span>{nearbyObject.icon}</span>
                {nearbyCopy.label}
              </strong>
              <kbd>{t.interactionTarget(nearbyCopy.label)}</kbd>
            </>
          ) : (
            <>
              <p>{profileConfig.shortName}</p>
              <strong>{t.noNearbyTarget}</strong>
            </>
          )}
        </div>
      )}
    </header>
  );
}
