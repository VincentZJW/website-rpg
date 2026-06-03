"use client";

import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { gameObjects } from "@/lib/game-data";
import { modelPreloadPolicy } from "@/lib/model-config";
import { canLoadModel, getModelAsset } from "@/lib/model-registry";
import { useGameStore } from "@/hooks/useGameStore";
import type { ModelId } from "@/types/models";

const preloadedPaths = new Set<string>();

function preloadModel(modelId: ModelId) {
  if (!canLoadModel(modelId)) return;
  const asset = getModelAsset(modelId);
  if (preloadedPaths.has(asset.path)) return;
  preloadedPaths.add(asset.path);
  useGLTF.preload(asset.path, asset.compression === "draco", asset.compression === "meshopt");
}

export function useModelPreload() {
  const playerPosition = useGameStore((state) => state.playerPosition);

  useEffect(() => {
    const isCompactScreen = window.matchMedia(`(max-width: ${modelPreloadPolicy.mobileBreakpoint}px)`).matches;
    const nearestCount = isCompactScreen ? modelPreloadPolicy.mobileNearestCount : modelPreloadPolicy.desktopNearestCount;
    const [playerX, , playerZ] = playerPosition;
    const nearestModelIds = gameObjects
      .map((object) => ({
        modelId: object.modelId,
        distance: Math.hypot(playerX - object.position[0], playerZ - object.position[2]),
      }))
      .sort((left, right) => left.distance - right.distance)
      .slice(0, nearestCount)
      .map((object) => object.modelId);

    preloadModel("vincent-hero");
    nearestModelIds.forEach(preloadModel);
  }, [playerPosition]);
}

export function useShouldLoadModel(modelId: ModelId, worldPosition?: readonly [number, number, number], priority = false) {
  const playerPosition = useGameStore((state) => state.playerPosition);
  const asset = getModelAsset(modelId);

  if (priority) return canLoadModel(modelId);
  if (!worldPosition || !canLoadModel(modelId)) return false;
  return Math.hypot(playerPosition[0] - worldPosition[0], playerPosition[2] - worldPosition[2]) <= asset.preloadDistance;
}
