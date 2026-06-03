"use client";

import { Suspense, useEffect, useMemo, type RefObject } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";
import { CharacterFallback } from "@/components/game/CharacterFallback";
import { ModelErrorBoundary } from "@/components/game/ModelErrorBoundary";
import { withBasePath } from "@/lib/asset-path";
import { canLoadModel, getModelAsset } from "@/lib/model-registry";
import type { CharacterAnimationState, CharacterExpression, FallbackType, ModelId } from "@/types/models";

type ModelLoaderProps = {
  modelId: ModelId;
  fallbackType?: FallbackType;
  animationState: CharacterAnimationState;
  expression?: CharacterExpression;
  themeColor: string;
  isNight: boolean;
  isActive?: boolean;
  reducedMotion: boolean;
  shouldLoad?: boolean;
  modelRef?: RefObject<THREE.Group | null>;
  fallbackRef?: RefObject<THREE.Group | null>;
};

type LoadedModelProps = Omit<ModelLoaderProps, "fallbackType" | "fallbackRef" | "shouldLoad">;

function updateExpression(scene: THREE.Object3D, expression: CharacterExpression) {
  const activeTarget = expression === "talking" ? "talking" : expression === "noticed" ? "attentive" : expression === "completed" ? "smile" : "neutral";
  scene.traverse((node) => {
    if (!(node instanceof THREE.Mesh) || !node.morphTargetDictionary || !node.morphTargetInfluences) return;
    for (const [name, index] of Object.entries(node.morphTargetDictionary)) {
      node.morphTargetInfluences[index] = name.toLowerCase() === activeTarget ? 1 : 0;
    }
  });
}

function LoadedModel({
  modelId,
  animationState,
  expression = "neutral",
  themeColor,
  isNight,
  isActive = false,
  reducedMotion,
  modelRef,
}: LoadedModelProps) {
  const asset = getModelAsset(modelId);
  const modelPath = withBasePath(asset.path);
  const { scene, animations } = useGLTF(modelPath, asset.compression === "draco", asset.compression === "meshopt");
  const sceneClone = useMemo(() => {
    const clone = SkeletonUtils.clone(scene);
    clone.traverse((node) => {
      if (!(node instanceof THREE.Mesh)) return;
      node.castShadow = true;
      node.receiveShadow = true;
      node.material = Array.isArray(node.material)
        ? node.material.map((material) => material.clone())
        : node.material.clone();
    });
    return clone;
  }, [scene]);
  const { actions } = useAnimations(animations, sceneClone);

  useEffect(() => {
    const clipName = asset.animations[animationState] ?? asset.animations.idle ?? asset.animations.hover ?? asset.animations.bossIdle;
    const action = clipName ? actions[clipName] : undefined;
    if (!action || reducedMotion) return;
    action.reset().fadeIn(0.24).play();
    return () => {
      action.fadeOut(0.2);
    };
  }, [actions, animationState, asset.animations, reducedMotion]);

  useEffect(() => {
    const accent = new THREE.Color(themeColor);
    sceneClone.traverse((node) => {
      if (!(node instanceof THREE.Mesh)) return;
      const materials = Array.isArray(node.material) ? node.material : [node.material];
      for (const material of materials) {
        if (!(material instanceof THREE.MeshStandardMaterial)) continue;
        if (material.emissive.getHex() === 0) material.emissive.copy(accent).multiplyScalar(0.14);
        material.emissiveIntensity = isActive ? (isNight ? 1.35 : 0.72) : isNight ? 0.72 : 0.3;
      }
    });
    updateExpression(sceneClone, expression);
  }, [expression, isActive, isNight, sceneClone, themeColor]);

  useEffect(
    () => () => {
      sceneClone.traverse((node) => {
        if (!(node instanceof THREE.Mesh)) return;
        const materials = Array.isArray(node.material) ? node.material : [node.material];
        materials.forEach((material) => material.dispose());
      });
    },
    [sceneClone],
  );

  return (
    <group
      ref={modelRef}
      position={asset.positionOffset}
      rotation={asset.rotationOffset}
      scale={asset.scale}
    >
      <primitive object={sceneClone} />
    </group>
  );
}

export function ModelLoader({
  modelId,
  fallbackType,
  animationState,
  expression,
  themeColor,
  isNight,
  isActive,
  reducedMotion,
  shouldLoad = true,
  modelRef,
  fallbackRef,
}: ModelLoaderProps) {
  const asset = getModelAsset(modelId);
  const fallback = (
    <CharacterFallback
      fallbackType={fallbackType ?? asset.fallbackType}
      isNight={isNight}
      modelRef={fallbackRef}
      themeColor={themeColor}
    />
  );

  if (!shouldLoad || !canLoadModel(modelId)) return fallback;

  return (
    <ModelErrorBoundary fallback={fallback} modelId={modelId}>
      <Suspense fallback={fallback}>
        <LoadedModel
          animationState={animationState}
          expression={expression}
          isActive={isActive}
          isNight={isNight}
          modelId={modelId}
          modelRef={modelRef}
          reducedMotion={reducedMotion}
          themeColor={themeColor}
        />
      </Suspense>
    </ModelErrorBoundary>
  );
}
