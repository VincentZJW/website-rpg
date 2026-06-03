"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { WorldTheme } from "@/lib/theme-config";

type SceneAtmosphereProps = {
  theme: WorldTheme;
};

export function SceneAtmosphere({ theme }: SceneAtmosphereProps) {
  const { scene } = useThree();
  const ambient = useRef<THREE.AmbientLight>(null);
  const directional = useRef<THREE.DirectionalLight>(null);
  const townGlow = useRef<THREE.PointLight>(null);
  const targetSky = useRef(new THREE.Color(theme.skyColor));
  const targetFog = useRef(new THREE.Color(theme.fogColor));

  useEffect(() => {
    targetSky.current.set(theme.skyColor);
    targetFog.current.set(theme.fogColor);
  }, [theme.fogColor, theme.skyColor]);

  useFrame((_, delta) => {
    const amount = 1 - Math.exp(-2.5 * delta);
    const background = scene.background as THREE.Color;
    const fog = scene.fog as THREE.Fog;

    background.lerp(targetSky.current, amount);
    fog.color.lerp(targetFog.current, amount);
    if (ambient.current) ambient.current.intensity = THREE.MathUtils.lerp(ambient.current.intensity, theme.ambientLight, amount);
    if (directional.current) {
      directional.current.intensity = THREE.MathUtils.lerp(
        directional.current.intensity,
        theme.directionalLight,
        amount,
      );
    }
    if (townGlow.current) {
      townGlow.current.intensity = THREE.MathUtils.lerp(townGlow.current.intensity, theme.pointLight, amount);
    }
  });

  return (
    <>
      <color attach="background" args={[theme.skyColor]} />
      <fog attach="fog" args={[theme.fogColor, 24, 58]} />
      <ambientLight ref={ambient} intensity={theme.ambientLight} />
      <hemisphereLight args={[theme.skyColor, theme.groundColor, theme.dialogTheme === "light" ? 1.35 : 0.32]} />
      <directionalLight
        ref={directional}
        position={[9, 16, 7]}
        intensity={theme.directionalLight}
        color={theme.dialogTheme === "light" ? "#fff3d0" : "#c6ecff"}
        castShadow
      />
      <pointLight ref={townGlow} position={[0, 8, 0]} intensity={theme.pointLight} color="#6f55ff" distance={34} />
    </>
  );
}
