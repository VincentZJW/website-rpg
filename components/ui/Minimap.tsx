"use client";

import { gameObjects, getNodeCopy } from "@/lib/game-data";
import { useGameStore } from "@/hooks/useGameStore";
import { useLanguage } from "@/hooks/useLanguage";
import { translations } from "@/lib/translations";

const MAP_SCALE = 2.9;

export function Minimap() {
  const language = useLanguage((state) => state.language);
  const playerPosition = useGameStore((state) => state.playerPosition);
  const nearbyObjectId = useGameStore((state) => state.nearbyObjectId);
  const discoveredObjectIds = useGameStore((state) => state.discoveredObjectIds);
  const t = translations[language];

  return (
    <section className="minimap-card" aria-label={t.minimap}>
      <p className="hud-kicker">{t.minimap}</p>
      <div className="minimap">
        <span className="minimap-compass minimap-north">N</span>
        <span className="minimap-compass minimap-east">E</span>
        <span className="minimap-compass minimap-south">S</span>
        <span className="minimap-compass minimap-west">W</span>
        <span
          className="minimap-player"
          style={{
            left: `calc(50% + ${playerPosition[0] * MAP_SCALE}px)`,
            top: `calc(50% + ${playerPosition[2] * MAP_SCALE}px)`,
          }}
          aria-label={language === "zh" ? "玩家位置" : "Player position"}
        />
        {gameObjects.map((object) => {
          const copy = getNodeCopy(object, language);
          const isNearby = nearbyObjectId === object.id;
          const isDiscovered = discoveredObjectIds.includes(object.id);
          return (
            <span
              key={object.id}
              className={`minimap-node ${isNearby ? "nearby" : ""} ${isDiscovered ? "discovered" : ""}`}
              style={{
                "--node-color": object.themeColor,
                left: `calc(50% + ${object.position[0] * MAP_SCALE}px)`,
                top: `calc(50% + ${object.position[2] * MAP_SCALE}px)`,
              } as React.CSSProperties}
              aria-label={`${copy.label}${isDiscovered ? `, ${t.discoveredMark}` : ""}`}
              title={copy.label}
            />
          );
        })}
      </div>
    </section>
  );
}
