"use client";

import { useMemo, useRef } from "react";
import { Html, Line, Sparkles } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CharacterModel } from "@/components/game/CharacterModel";
import { getNodeCopy, type GameObject } from "@/lib/game-data";
import { useCharacterAnimation } from "@/hooks/useCharacterAnimation";
import { useGameStore } from "@/hooks/useGameStore";
import { useInteractionFacing } from "@/hooks/useInteractionFacing";
import type { Language } from "@/lib/translations";

type BossProps = {
  data: GameObject;
  language: Language;
  reducedMotion: boolean;
  isNight: boolean;
};

export function Boss({ data, language, reducedMotion, isNight }: BossProps) {
  const group = useRef<THREE.Group>(null);
  const modelRoot = useRef<THREE.Group>(null);
  const fallbackRoot = useRef<THREE.Group>(null);
  const shardRoot = useRef<THREE.Group>(null);
  const fogRoot = useRef<THREE.Group>(null);
  const energyRing = useRef<THREE.Mesh>(null);
  const nearbyObjectId = useGameStore((state) => state.nearbyObjectId);
  const hasStarted = useGameStore((state) => state.hasStarted);
  const activeObjectId = useGameStore((state) => state.activeObjectId);
  const faceTowards = useInteractionFacing();
  const isNearby = nearbyObjectId === data.id;
  const isActive = activeObjectId === data.id;
  const isDialogOpen = Boolean(activeObjectId);
  const animationState = useCharacterAnimation({ role: "boss", isNearby, isInteracting: isActive });
  const copy = getNodeCopy(data, language);
  const shards = useMemo(
    () =>
      Array.from({ length: 9 }, (_, index) => ({
        angle: (Math.PI * 2 * index) / 9,
        radius: 1.9 + (index % 2) * 0.5,
        y: 1.26 + (index % 3) * 0.34,
      })),
    [],
  );
  const fogPuffs = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => ({
        angle: (Math.PI * 2 * index) / 7 + 0.32,
        radius: 2.45 + (index % 3) * 0.46,
        scale: 0.72 + (index % 2) * 0.28,
        y: 0.62 + (index % 3) * 0.36,
      })),
    [],
  );
  const explorationPath = useMemo(
    () =>
      [
        [-2.7, 0.54, -1.48],
        [-1.55, 0.78, -0.72],
        [-0.45, 0.68, -1.24],
        [0.62, 0.92, -0.34],
        [1.62, 0.82, 0.32],
        [2.54, 1.04, 1.26],
      ] as [number, number, number][],
    [],
  );

  useFrame((state, delta) => {
    if (!group.current) return;
    const elapsed = state.clock.elapsedTime;
    const [playerX, , playerZ] = useGameStore.getState().playerPosition;
    if (isNearby || isActive) {
      faceTowards(group.current, [data.position[0], data.position[2]], [playerX, playerZ], delta, isActive ? 3.6 : 2.6);
    } else {
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, Math.sin(elapsed * 0.24) * 0.16, 1.1, delta);
    }
    if (!reducedMotion) group.current.position.y = Math.sin(elapsed * 1.12) * 0.16 + (isActive ? 0.18 : 0);

    const pulse = 1 + Math.sin(elapsed * (isActive ? 5 : 2.4)) * (isActive ? 0.12 : isNearby ? 0.08 : 0.045);
    if (energyRing.current) energyRing.current.scale.setScalar(pulse);
    if (shardRoot.current && !reducedMotion) shardRoot.current.rotation.y -= delta * (isActive ? 1.2 : isNearby ? 0.72 : 0.3);
    if (fogRoot.current && !reducedMotion) fogRoot.current.rotation.y += delta * (isActive ? 0.28 : 0.12);

    const visualRoot = modelRoot.current ?? fallbackRoot.current;
    const head = visualRoot?.getObjectByName("Head");
    const leftWing = visualRoot?.getObjectByName("LeftWing");
    const rightWing = visualRoot?.getObjectByName("RightWing");
    const tailOne = visualRoot?.getObjectByName("TailOne");
    const tailTwo = visualRoot?.getObjectByName("TailTwo");
    const wingMotion = Math.sin(elapsed * (isActive ? 3.2 : 1.7)) * (isActive ? 0.22 : 0.1);
    if (head) head.rotation.x = THREE.MathUtils.damp(head.rotation.x, isActive ? -0.22 : Math.sin(elapsed) * 0.04, 4, delta);
    if (leftWing) leftWing.rotation.z = THREE.MathUtils.damp(leftWing.rotation.z, -0.34 - wingMotion, 4, delta);
    if (rightWing) rightWing.rotation.z = THREE.MathUtils.damp(rightWing.rotation.z, 0.34 + wingMotion, 4, delta);
    if (tailOne) tailOne.rotation.y = Math.sin(elapsed * 1.25) * 0.16;
    if (tailTwo) tailTwo.rotation.y = Math.sin(elapsed * 1.25 + 0.6) * 0.24;
  });

  return (
    <group position={data.position}>
      <group ref={group}>
        <CharacterModel
          animationState={animationState}
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
        <group ref={shardRoot}>
          {shards.map((shard, index) => (
            <mesh
              key={index}
              position={[Math.cos(shard.angle) * shard.radius, shard.y, Math.sin(shard.angle) * shard.radius]}
              rotation={[shard.angle, shard.angle, shard.angle]}
            >
              <coneGeometry args={[0.26, 1.05, 5]} />
              <meshStandardMaterial color={data.themeColor} emissive={data.themeColor} emissiveIntensity={isActive ? 1.28 : isNight ? 0.92 : 0.34} />
            </mesh>
          ))}
        </group>
        <group ref={fogRoot}>
          <Line points={explorationPath} color="#b8c7ff" lineWidth={1.1} transparent opacity={isActive ? 0.88 : 0.48} />
          {fogPuffs.map((puff, index) => (
            <mesh
              key={index}
              position={[Math.cos(puff.angle) * puff.radius, puff.y, Math.sin(puff.angle) * puff.radius]}
              scale={[puff.scale * 1.55, puff.scale * 0.68, puff.scale]}
            >
              <sphereGeometry args={[0.82, 12, 8]} />
              <meshStandardMaterial color="#7887d4" depthWrite={false} emissive="#4e4b92" emissiveIntensity={isNight ? 0.36 : 0.16} opacity={isActive ? 0.24 : 0.14} transparent />
            </mesh>
          ))}
        </group>
        <mesh ref={energyRing} position={[0, 1.74, 0]}>
          <torusGeometry args={[2.62, 0.09, 8, 42]} />
          <meshBasicMaterial color={data.themeColor} transparent opacity={isActive ? 0.82 : isNight ? 0.62 : 0.36} />
        </mesh>
        {!reducedMotion && <Sparkles count={isActive ? 38 : isNearby ? 26 : 16} scale={[6, 4.8, 6]} size={isActive ? 1.3 : 0.9} speed={isActive ? 0.5 : isNearby ? 0.34 : 0.2} color={data.themeColor} />}
      </group>
      <mesh position={[0, 0.055, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.18, isNearby ? 2.9 : 2.58, 42]} />
        <meshBasicMaterial color={data.themeColor} transparent opacity={isActive ? 1 : isNearby ? 0.94 : isNight ? 0.68 : 0.38} />
      </mesh>
      <pointLight position={[0, 1.7, 0]} color={data.themeColor} intensity={isActive ? 4.8 : isNearby ? 3.6 : isNight ? 2.8 : 0.9} distance={isActive ? 8 : 6.5} />
      {hasStarted && !isDialogOpen && (isNearby || isActive) && (
        <Html center position={[0, 5.35, 0]} distanceFactor={13}>
          <div className="npc-emote boss-emote">{isActive ? (language === "zh" ? "成长挑战" : "GROWTH CHALLENGE") : "!"}</div>
        </Html>
      )}
      {hasStarted && !isDialogOpen && isNearby && (
        <Html center position={[0, 4.62, 0]} distanceFactor={13}>
          <div className="world-label boss-label nearby">
            <span>{data.icon}</span>
            <strong>{copy.label}</strong>
            <small>{copy.zone}</small>
          </div>
        </Html>
      )}
    </group>
  );
}
