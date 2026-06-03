"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { gameObjects, getNodeCopy } from "@/lib/game-data";
import { useGameStore } from "@/hooks/useGameStore";
import { useLanguage } from "@/hooks/useLanguage";
import { profileConfig } from "@/lib/profile-config";
import { translations } from "@/lib/translations";
import { NodeRichContent } from "@/components/ui/NodeRichContent";

export function DialogPanel() {
  const language = useLanguage((state) => state.language);
  const activeObjectId = useGameStore((state) => state.activeObjectId);
  const setActiveObject = useGameStore((state) => state.setActiveObject);
  const reduceMotion = useReducedMotion();
  const closeButton = useRef<HTMLButtonElement>(null);
  const activeObject = gameObjects.find((object) => object.id === activeObjectId);
  const copy = activeObject ? getNodeCopy(activeObject, language) : null;
  const t = translations[language];
  const objectType = activeObject?.type === "boss" ? t.bossType : activeObject?.type === "portal" ? t.portalType : t.npcType;

  useEffect(() => {
    if (!activeObject) return;
    closeButton.current?.focus();
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveObject(null);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [activeObject, setActiveObject]);

  return (
    <AnimatePresence>
      {activeObject && copy && (
        <motion.div
          className="dialog-backdrop"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setActiveObject(null);
          }}
          onTouchMove={(event) => event.stopPropagation()}
          onWheel={(event) => event.stopPropagation()}
        >
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            className={`dialog-panel dialog-panel-${activeObject.type} ${activeObject.companyRadar?.length ? "dialog-panel-radar" : ""}`}
            initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0 : 0.22 }}
            onPointerDown={(event) => event.stopPropagation()}
            onTouchMove={(event) => event.stopPropagation()}
            onWheel={(event) => event.stopPropagation()}
          >
            <button ref={closeButton} className="dialog-close" type="button" onClick={() => setActiveObject(null)} aria-label={t.closeDialog}>
              ×
            </button>
            <div className="dialog-profile">
              <div className="dialog-avatar-shell" style={{ color: activeObject.themeColor }}>
                <p className="dialog-icon">{activeObject.icon}</p>
              </div>
              <p className="dialog-eyebrow">{activeObject.type === "boss" ? t.encounter : t.characterRecord}</p>
              <p className="dialog-character">{copy.label}</p>
              <strong>{copy.zone}</strong>
              <span>
                {objectType} {"//"} {activeObject.id.toUpperCase()}
              </span>
            </div>
            <div className="dialog-main custom-scrollbar" tabIndex={0}>
              <h2 id="dialog-title">{copy.title}</h2>
              <h3>{copy.subtitle}</h3>
              <p className="dialog-content">{copy.content}</p>
              <NodeRichContent language={language} object={activeObject} />
              <div className="dialog-tags">
                {copy.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <div className="dialog-actions">
                {activeObject.type === "portal" ? (
                  <>
                    <a className="contact-action" href={profileConfig.links.linkedin} rel="noreferrer noopener" target="_blank">{t.linkedin}</a>
                    <a className="contact-action" href={profileConfig.links.github} rel="noreferrer noopener" target="_blank">{t.github}</a>
                    <a className="contact-action" href={`mailto:${profileConfig.links.email}`}>{t.email}</a>
                  </>
                ) : (
                  <>
                    <button className="dialog-cta" type="button" onClick={() => setActiveObject(null)}>
                      {copy.cta}
                    </button>
                    {activeObject.secondaryCta ? (
                      <button className="dialog-cta dialog-cta-secondary" type="button" onClick={() => setActiveObject("contact-portal")}>
                        {activeObject.secondaryCta[language]}
                      </button>
                    ) : null}
                  </>
                )}
              </div>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
