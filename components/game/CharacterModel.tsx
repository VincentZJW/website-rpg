"use client";

import type { RefObject } from "react";
import * as THREE from "three";
import { ModelLoader } from "@/components/game/ModelLoader";
import { useShouldLoadModel } from "@/hooks/useModelPreload";
import type { CharacterAnimationState, CharacterExpression, FallbackType, ModelId } from "@/types/models";

type CharacterModelProps = {
  modelId: ModelId;
  fallbackType?: FallbackType;
  animationState: CharacterAnimationState;
  expression?: CharacterExpression;
  themeColor: string;
  isNight: boolean;
  isActive?: boolean;
  reducedMotion: boolean;
  priority?: boolean;
  worldPosition?: readonly [number, number, number];
  modelRef?: RefObject<THREE.Group | null>;
  fallbackRef?: RefObject<THREE.Group | null>;
};

export function CharacterModel({ modelId, priority = false, worldPosition, ...props }: CharacterModelProps) {
  const shouldLoad = useShouldLoadModel(modelId, worldPosition, priority);
  return <ModelLoader {...props} modelId={modelId} shouldLoad={shouldLoad} />;
}
