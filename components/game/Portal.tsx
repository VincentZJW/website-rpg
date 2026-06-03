"use client";

import { useRef } from "react";
import { Html, Sparkles } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CharacterModel } from "@/components/game/CharacterModel";
import { getNodeCopy, type GameObject } from "@/lib/game-data";
import { useCharacterAnimation } from "@/hooks/useCharacterAnimation";
import { useGameStore } from "@/hooks/useGameStore";
import { useInteractionFacing } from "@/hooks/useInteractionFacing";
import type { Language } from "@/lib/translations";

type PortalProps = {
  data: GameObject;
  language: Language;
  reducedMotion: boolean;
  isNight: boolean;
};

export function Portal({ data, language, reducedMotion, isNight }: PortalProps) {
  const portalRoot = useRef<THREE.Group>(null);
  const portalFallbackRoot = useRef<THREE.Group>(null);
  const guideAnchor = useRef<THREE.Group>(null);
  const guideRoot = useRef<THREE.Group>(null);
  const guideFallbackRoot = useRef<THREE.Group>(null);
  const nearbyObjectId = useGameStore((state) => state.nearbyObjectId);
  const hasStarted = useGameStore((state) => state.hasStarted);
  const activeObjectId = useGameStore((state) => state.activeObjectId);
  const faceTowards = useInteractionFacing();
  const isNearby = nearbyObjectId === data.id;
  const isActive = activeObjectId === data.id;
  const isDialogOpen = Boolean(activeObjectId);
  const animationState = useCharacterAnimation({ role: "portal", isNearby, isInteracting: isActive });
  const guideAnimationState = useCharacterAnimation({ role: "npc", isNearby, isInteracting: isActive });
  const copy = getNodeCopy(data, language);

  useFrame((state, delta) => {
    const portalVisual = portalRoot.current ?? portalFallbackRoot.current;
    const rings = portalVisual?.getObjectByName("PortalRings") ?? portalVisual;
    if (rings && !reducedMotion) rings.rotation.z += delta * (isActive ? 1.5 : isNearby ? 0.92 : 0.42);
    if (guideAnchor.current && !reducedMotion) {
      const [playerX, , playerZ] = useGameStore.getState().playerPosition;
      guideAnchor.current.position.y = Math.sin(state.clock.elapsedTime * 2.4) * 0.24;
      faceTowards(guideAnchor.current, [data.position[0] + 1.9, data.position[2] + 0.35], [playerX, playerZ], delta, isNearby ? 4.2 : 1.8);
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3.2) * (isNearby ? 0.16 : 0.06);
      guideAnchor.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={data.position}>
      <CharacterModel
        animationState={animationState}
        fallbackRef={portalFallbackRoot}
        fallbackType={data.fallbackType}
        isActive={isNearby || isActive}
        isNight={isNight}
        modelId={data.modelId}
        modelRef={portalRoot}
        reducedMotion={reducedMotion}
        themeColor={data.themeColor}
        worldPosition={data.position}
      />
      <group ref={guideAnchor} position={[1.9, 3.28, 0.35]}>
        <CharacterModel
          animationState={guideAnimationState}
          fallbackRef={guideFallbackRoot}
          fallbackType="guide-spirit-procedural"
          isActive={isNearby || isActive}
          isNight={isNight}
          modelId="guide-spirit"
          modelRef={guideRoot}
          reducedMotion={reducedMotion}
          themeColor={data.themeColor}
          worldPosition={data.position}
        />
      </group>
      {!reducedMotion && <Sparkles count={isActive ? 58 : isNearby ? 42 : 28} scale={[3.8, 5.7, 2.4]} size={isActive ? 1.7 : 1.2} speed={isActive ? 0.78 : 0.35} color={data.themeColor} />}
      <mesh position={[0, 0.055, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.9, isNearby ? 2.48 : 2.2, 40]} />
        <meshBasicMaterial color={data.themeColor} transparent opacity={isActive ? 1 : isNearby ? 0.98 : isNight ? 0.74 : 0.42} />
      </mesh>
      <pointLight position={[0, 2.2, 0]} color={data.themeColor} intensity={isActive ? 7.5 : isNearby ? 6.2 : isNight ? 5.4 : 1.45} distance={isActive ? 9 : 7.5} />
      {hasStarted && !isDialogOpen && isNearby && (
        <Html center position={[0, 5, 0]} distanceFactor={13}>
          <div className="world-label portal-label nearby">
            <span>{data.icon}</span>
            <strong>{copy.label}</strong>
            <small>{copy.zone}</small>
          </div>
        </Html>
      )}
    </group>
  );
}
