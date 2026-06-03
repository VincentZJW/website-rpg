"use client";

import { motion, useReducedMotion } from "framer-motion";
import { gameObjects, getNodeCopy } from "@/lib/game-data";
import { useGameStore } from "@/hooks/useGameStore";
import { useLanguage } from "@/hooks/useLanguage";
import { profileConfig } from "@/lib/profile-config";
import { translations } from "@/lib/translations";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { NodeRichContent } from "@/components/ui/NodeRichContent";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { BgmControls } from "@/components/audio/BgmControls";

export function ClassicView() {
  const language = useLanguage((state) => state.language);
  const discoveredObjectIds = useGameStore((state) => state.discoveredObjectIds);
  const setClassicView = useGameStore((state) => state.setClassicView);
  const reduceMotion = useReducedMotion();
  const t = translations[language];
  const overviewItems = [
    [t.about, t.aboutSummary],
    [t.focusAreas, t.focusAreasSummary],
    [t.projects, t.projectsSummary],
    [t.industryNotes, t.industryNotesSummary],
    [t.experience, t.experienceSummary],
    [t.contact, t.contactSummary],
  ];

  return (
    <motion.main
      id="main-content"
      className="classic-view"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.32 }}
    >
      <nav className="classic-nav">
        <span className="hud-kicker">VINCENT.ZHOU // AI FRONTIER</span>
        <div className="classic-nav-actions">
          <BgmControls />
          <ThemeToggle />
          <LanguageToggle />
          <button className="hud-button" type="button" onClick={() => setClassicView(false)}>
            {t.gameView}
          </button>
        </div>
      </nav>

      <section className="classic-hero">
        <p className="classic-eyebrow">{t.classicEyebrow}</p>
        <h1>{t.classicTitle}</h1>
        <p>{t.classicDescription}</p>
        <div className="classic-profile">
          <span>{profileConfig.name}</span>
          <span>{profileConfig.role[language]}</span>
          <span>{profileConfig.focus[language]}</span>
        </div>
      </section>

      <section className="classic-overview" aria-label={t.profileOverview}>
        <p className="classic-eyebrow">{t.profileOverview}</p>
        <div className="classic-overview-grid">
          {overviewItems.map(([title, summary]) => (
            <article key={title}>
              <h2>{title}</h2>
              <p>{summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="classic-journey">
        <div>
          <p className="classic-eyebrow">{t.journey}</p>
          <h2>{t.questTitle}</h2>
          <p>{t.journeyDescription}</p>
        </div>
        <div className="journey-progress">
          {gameObjects.map((object, index) => {
            const copy = getNodeCopy(object, language);
            const isDiscovered = discoveredObjectIds.includes(object.id);
            return (
              <div key={object.id} className={isDiscovered ? "discovered" : ""}>
                <span>{index + 1}</span>
                <strong>{copy.zone}</strong>
                <small>{isDiscovered ? t.discoveredMark : t.undiscoveredMark}</small>
              </div>
            );
          })}
        </div>
      </section>

      <section className="classic-grid" id="profile-sections" aria-label={t.classicTitle}>
        {gameObjects.map((object, index) => {
          const copy = getNodeCopy(object, language);
          return (
            <motion.article
              key={object.id}
              className={`classic-card classic-card-${object.type} ${object.companyRadar?.length ? "classic-card-wide" : ""}`}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: reduceMotion ? 0 : Math.min(index * 0.06, 0.24) }}
              style={{ "--accent": object.themeColor } as React.CSSProperties}
            >
              <div className="classic-card-topline">
                <span>{copy.zone}</span>
                <span>{object.icon}</span>
              </div>
              <p>{copy.label}</p>
              <h2>{copy.title}</h2>
              <h3>{copy.subtitle}</h3>
              <div className="classic-card-rule" />
              <p className="classic-card-content">{copy.content}</p>
              <NodeRichContent language={language} object={object} />
              <div className="classic-tags">
                {copy.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              {object.type === "portal" && (
                <div className="contact-actions">
                  <a className="contact-action" href={profileConfig.links.linkedin} rel="noreferrer noopener" target="_blank">{t.linkedin}</a>
                  <a className="contact-action" href={profileConfig.links.github} rel="noreferrer noopener" target="_blank">{t.github}</a>
                  <a className="contact-action" href={`mailto:${profileConfig.links.email}`}>{t.email}</a>
                </div>
              )}
            </motion.article>
          );
        })}
      </section>

      <section className="classic-contact">
        <div>
          <p className="classic-eyebrow">{t.contact}</p>
          <h2>{t.classicContactTitle}</h2>
          <p>{t.classicContactDescription}</p>
        </div>
        <div className="contact-actions">
          <a className="contact-action" href={profileConfig.links.linkedin} rel="noreferrer noopener" target="_blank">{t.linkedin}</a>
          <a className="contact-action" href={profileConfig.links.github} rel="noreferrer noopener" target="_blank">{t.github}</a>
          <a className="contact-action" href={`mailto:${profileConfig.links.email}`}>{t.email}</a>
        </div>
      </section>

      <footer className="classic-footer">{t.footer}</footer>
    </motion.main>
  );
}
