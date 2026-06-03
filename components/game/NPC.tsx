"use client";

import { useRef, type RefObject } from "react";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CharacterModel } from "@/components/game/CharacterModel";
import { getNodeCopy, type GameObject } from "@/lib/game-data";
import { useCharacterAnimation } from "@/hooks/useCharacterAnimation";
import { useGameStore } from "@/hooks/useGameStore";
import { useInteractionFacing } from "@/hooks/useInteractionFacing";
import type { Language } from "@/lib/translations";
import type { CharacterExpression } from "@/types/models";

type NPCProps = {
  data: GameObject;
  language: Language;
  reducedMotion: boolean;
  isNight: boolean;
};

function NpcAmbientEffect({
  data,
  effectRoot,
  isNight,
}: {
  data: GameObject;
  effectRoot: RefObject<THREE.Group | null>;
  isNight: boolean;
}) {
  if (data.variant === "sage") {
    return (
      <group ref={effectRoot}>
        {[-0.72, 0, 0.72].map((offset) => (
          <mesh key={offset} position={[offset, 2.4 + Math.abs(offset) * 0.22, -0.18]}>
            <octahedronGeometry args={[0.14, 0]} />
            <meshStandardMaterial color={data.themeColor} emissive={data.themeColor} emissiveIntensity={isNight ? 1.2 : 0.32} />
          </mesh>
        ))}
      </group>
    );
  }
  if (data.variant === "guild-master") {
    return (
      <group ref={effectRoot}>
        <mesh position={[0, 2.46, 0.22]}>
          <octahedronGeometry args={[0.25, 0]} />
          <meshStandardMaterial color="#d8c4ff" emissive={data.themeColor} emissiveIntensity={isNight ? 1.24 : 0.28} />
        </mesh>
      </group>
    );
  }
  if (data.variant === "librarian") {
    return (
      <group ref={effectRoot}>
        {[-0.86, 0.86].map((x, index) => (
          <mesh key={x} position={[x, 2.14 + index * 0.22, 0.1]} rotation={[0.12, index * 0.22, 0.14]}>
            <boxGeometry args={[0.56, 0.055, 0.72]} />
            <meshStandardMaterial color="#fff0b1" emissive={data.themeColor} emissiveIntensity={isNight ? 0.76 : 0.12} />
          </mesh>
        ))}
      </group>
    );
  }
  return <group ref={effectRoot} />;
}

export function NPC({ data, language, reducedMotion, isNight }: NPCProps) {
  const group = useRef<THREE.Group>(null);
  const modelRoot = useRef<THREE.Group>(null);
  const fallbackRoot = useRef<THREE.Group>(null);
  const effectRoot = useRef<THREE.Group>(null);
  const nearbyObjectId = useGameStore((state) => state.nearbyObjectId);
  const hasStarted = useGameStore((state) => state.hasStarted);
  const activeObjectId = useGameStore((state) => state.activeObjectId);
  const discoveredObjectIds = useGameStore((state) => state.discoveredObjectIds);
  const faceTowards = useInteractionFacing();
  const isNearby = nearbyObjectId === data.id;
  const isActive = activeObjectId === data.id;
  const isDialogOpen = Boolean(activeObjectId);
  const isDiscovered = discoveredObjectIds.includes(data.id);
  const animationState = useCharacterAnimation({ role: "npc", isNearby, isInteracting: isActive });
  const expression: CharacterExpression = isActive ? "talking" : isNearby ? "noticed" : isDiscovered ? "completed" : "neutral";
  const copy = getNodeCopy(data, language);

  useFrame((state, delta) => {
    if (!group.current) return;
    const elapsed = state.clock.elapsedTime;
    const responseBoost = isActive ? 0.15 : isNearby ? 0.08 : 0;
    if (!reducedMotion) group.current.position.y = Math.sin(elapsed * 1.7 + data.position[0]) * 0.1 + responseBoost;

    const [playerX, , playerZ] = useGameStore.getState().playerPosition;
    if (isNearby || isActive) {
      faceTowards(group.current, [data.position[0], data.position[2]], [playerX, playerZ], delta, isActive ? 5.4 : 4.6);
    } else {
      group.current.rotation.y = THREE.MathUtils.damp(
        group.current.rotation.y,
        (data.initialRotation ?? 0) + Math.sin(elapsed * 0.28 + data.position[0]) * 0.08,
        1.8,
        delta,
      );
    }

    const visualRoot = modelRoot.current ?? fallbackRoot.current;
    const head = visualRoot?.getObjectByName("Head");
    const eyes = visualRoot?.getObjectByName("Eyes");
    const rightArm = visualRoot?.getObjectByName("RightArm");
    const orb = visualRoot?.getObjectByName("Orb");
    const beacon = visualRoot?.getObjectByName("Beacon");
    if (head) {
      const scan = data.variant === "scout" && !isNearby ? Math.sin(elapsed * 1.6) * 0.48 : 0;
      head.rotation.y = THREE.MathUtils.damp(head.rotation.y, scan, 5, delta);
      head.rotation.x = THREE.MathUtils.damp(head.rotation.x, isActive ? -0.12 : isNearby ? -0.05 : 0, 5, delta);
    }
    if (eyes) eyes.scale.x = 1 + Math.sin(elapsed * 3.2) * (isActive ? 0.12 : isNearby ? 0.06 : 0.02);
    if (rightArm) rightArm.rotation.x = THREE.MathUtils.damp(rightArm.rotation.x, isActive ? -0.56 : Math.sin(elapsed * 1.4) * 0.08, 5, delta);
    if (orb) orb.rotation.y += delta * (isNearby ? 2.4 : 1.2);
    if (beacon) beacon.scale.setScalar(1 + Math.sin(elapsed * 4) * (isNearby ? 0.18 : 0.08));
    if (effectRoot.current && !reducedMotion) {
      effectRoot.current.rotation.y += delta * (isNearby ? 1.25 : 0.52);
      effectRoot.current.position.y = Math.sin(elapsed * 1.8) * 0.08;
    }
  });

  return (
    <group position={data.position}>
      <group ref={group} rotation={[0, data.initialRotation ?? 0, 0]}>
        <CharacterModel
          animationState={animationState}
          expression={expression}
          fallbackRef={fallbackRoot}
          fallbackType={data.fallbackType}
          isActive={isNearby || isActive}
          isNight={isNight}
          modelId={data.modelId}
          modelRef={modelRoot}
          reducedMotion={reducedMotion}
          themeColor={data.themeColor}
          worldPosition={data.position}
        />
        <NpcAmbientEffect data={data} effectRoot={effectRoot} isNight={isNight} />
      </group>
      <mesh position={[0, 0.055, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[isNearby ? 1.12 : 1.02, isNearby ? 1.44 : 1.24, 32]} />
        <meshBasicMaterial color={data.themeColor} transparent opacity={isNearby ? 0.98 : isNight ? 0.64 : 0.32} />
      </mesh>
      {isNight && <pointLight position={[0, 1.25, 0]} color={data.themeColor} intensity={isNearby ? 2.2 : 0.7} distance={4.8} />}
      {hasStarted && !isDialogOpen && (isNearby || isActive) && (
        <Html center position={[0, 3.72, 0]} distanceFactor={12}>
          <div className={`npc-emote ${isActive ? "active" : ""}`}>{isActive ? "✦" : "!"}</div>
        </Html>
      )}
      {hasStarted && !isDialogOpen && isNearby && (
        <Html center position={[0, 3.15, 0]} distanceFactor={12}>
          <div className="world-label nearby">
            <span>{data.icon}</span>
            <strong>{copy.label}</strong>
            <small>{copy.zone}</small>
          </div>
        </Html>
      )}
    </group>
  );
}
