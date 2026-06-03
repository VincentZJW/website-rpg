"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import type { Language } from "@/lib/translations";
import type { ResolvedTimeTheme } from "@/lib/theme-config";
import { CameraRig } from "@/components/game/CameraRig";
import { InteractionSystem } from "@/components/game/InteractionSystem";
import { Player } from "@/components/game/Player";
import { World } from "@/components/game/World";

type GameCanvasProps = {
  language: Language;
  reducedMotion: boolean;
  timeTheme: ResolvedTimeTheme;
};

export default function GameCanvas({ language, reducedMotion, timeTheme }: GameCanvasProps) {
  return (
    <Canvas
      shadows
      camera={{ position: [7.6, 8.4, 10.6], fov: 47, near: 0.1, far: 90 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <Suspense fallback={null}>
        <World language={language} reducedMotion={reducedMotion} timeTheme={timeTheme} />
        <Player reducedMotion={reducedMotion} isNight={timeTheme === "night"} />
        <CameraRig />
        <InteractionSystem />
      </Suspense>
    </Canvas>
  );
}
