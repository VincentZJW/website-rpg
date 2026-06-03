"use client";

import { useRef } from "react";
import { Sparkles } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore } from "@/hooks/useGameStore";
import { spawnPlazaPosition } from "@/lib/game-data";
import type { WorldTheme } from "@/lib/theme-config";

type SpawnVignetteProps = {
  theme: WorldTheme;
  reducedMotion: boolean;
};

export function SpawnVignette({ theme, reducedMotion }: SpawnVignetteProps) {
  const runeRoot = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Mesh>(null);
  const altarLight = useRef<THREE.PointLight>(null);
  const hasStarted = useGameStore((state) => state.hasStarted);
  const isSpawning = useGameStore((state) => state.isSpawning);
  const strength = isSpawning ? 1 : hasStarted ? 0.26 : 0.62;

  useFrame((state, delta) => {
    const elapsed = state.clock.elapsedTime;
    const pulse = 1 + Math.sin(elapsed * (isSpawning ? 6.4 : 2.1)) * (isSpawning ? 0.16 : 0.045);
    if (runeRoot.current) runeRoot.current.scale.setScalar(pulse);
    if (halo.current && !reducedMotion) {
      halo.current.rotation.x += delta * (isSpawning ? 1.2 : 0.36);
      halo.current.rotation.y += delta * (isSpawning ? 1.7 : 0.52);
    }
    if (altarLight.current) altarLight.current.intensity = (isSpawning ? 9 : hasStarted ? 1.2 : 4.2) * pulse;
  });

  return (
    <group position={spawnPlazaPosition}>
      <group ref={runeRoot}>
        {[2.05, 2.64, 3.18].map((radius, index) => (
          <mesh key={radius} position={[0, 0.36 + index * 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[radius, radius + (isSpawning ? 0.105 : 0.055), 48]} />
            <meshBasicMaterial color={theme.accentColor} transparent opacity={strength * (0.82 - index * 0.16)} />
          </mesh>
        ))}
      </group>
      <mesh ref={halo} position={[0, 2.34, 0]}>
        <torusGeometry args={[0.88, isSpawning ? 0.075 : 0.045, 8, 32]} />
        <meshBasicMaterial color={theme.accentColor} transparent opacity={strength} />
      </mesh>
      <pointLight ref={altarLight} position={[0, 2.15, 0]} color={theme.accentColor} intensity={4.2} distance={isSpawning ? 11 : 7} />
      {!reducedMotion && (
        <Sparkles
          color={theme.accentColor}
          count={isSpawning ? 52 : hasStarted ? 10 : 30}
          scale={[6.5, 5, 6.5]}
          size={isSpawning ? 1.8 : 1}
          speed={isSpawning ? 0.86 : 0.28}
        />
      )}
    </group>
  );
}
