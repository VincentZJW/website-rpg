"use client";

import { Grid, Sparkles, Stars } from "@react-three/drei";
import { gameObjects } from "@/lib/game-data";
import { getWorldTheme, type ResolvedTimeTheme } from "@/lib/theme-config";
import { useModelPreload } from "@/hooks/useModelPreload";
import type { Language } from "@/lib/translations";
import { Boss } from "@/components/game/Boss";
import { TownBuildings } from "@/components/game/Buildings";
import { TownEnvironment } from "@/components/game/Environment";
import { NPC } from "@/components/game/NPC";
import { Portal } from "@/components/game/Portal";
import { SceneAtmosphere } from "@/components/game/SceneAtmosphere";
import { SpawnVignette } from "@/components/game/SpawnVignette";
import { TownRoads } from "@/components/game/TownDecor";

type WorldProps = {
  language: Language;
  reducedMotion: boolean;
  timeTheme: ResolvedTimeTheme;
};

export function World({ language, reducedMotion, timeTheme }: WorldProps) {
  useModelPreload();
  const theme = getWorldTheme(timeTheme);
  const isNight = timeTheme === "night";

  return (
    <>
      <SceneAtmosphere theme={theme} />
      {isNight && <Stars radius={64} depth={20} count={reducedMotion ? 440 : 1000} factor={3} fade speed={0.28} />}
      {!reducedMotion && (
        <Sparkles
          count={isNight ? 56 : 22}
          scale={[46, 7, 46]}
          size={isNight ? 1.3 : 0.8}
          speed={0.15}
          color={theme.accentColor}
        />
      )}

      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]}>
        <planeGeometry args={[48, 48]} />
        <meshStandardMaterial color={theme.groundColor} metalness={isNight ? 0.28 : 0.02} roughness={isNight ? 0.82 : 0.97} />
      </mesh>
      <Grid
        args={[48, 48]}
        cellColor={theme.gridColor}
        cellSize={1}
        cellThickness={isNight ? 0.26 : 0.1}
        fadeDistance={46}
        fadeStrength={1}
        infiniteGrid={false}
        position={[0, -0.018, 0]}
        sectionColor={theme.gridSectionColor}
        sectionSize={5}
        sectionThickness={isNight ? 0.5 : 0.18}
      />

      <TownRoads theme={theme} isNight={isNight} />
      <TownBuildings theme={theme} isNight={isNight} reducedMotion={reducedMotion} />
      <SpawnVignette theme={theme} reducedMotion={reducedMotion} />
      <TownEnvironment theme={theme} isNight={isNight} />

      {gameObjects.map((object) => {
        if (object.type === "boss") {
          return <Boss key={object.id} data={object} language={language} reducedMotion={reducedMotion} isNight={isNight} />;
        }
        if (object.type === "portal") {
          return <Portal key={object.id} data={object} language={language} reducedMotion={reducedMotion} isNight={isNight} />;
        }
        return <NPC key={object.id} data={object} language={language} reducedMotion={reducedMotion} isNight={isNight} />;
      })}
    </>
  );
}
