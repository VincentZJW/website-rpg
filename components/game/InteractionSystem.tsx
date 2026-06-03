"use client";

import { useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { gameObjects } from "@/lib/game-data";
import { useGameStore } from "@/hooks/useGameStore";

const INTERACTION_DISTANCE = 4.4;

export function InteractionSystem() {
  const setNearbyObject = useGameStore((state) => state.setNearbyObject);

  useFrame(() => {
    if (!useGameStore.getState().hasStarted) {
      if (useGameStore.getState().nearbyObjectId) setNearbyObject(null);
      return;
    }

    const [playerX, , playerZ] = useGameStore.getState().playerPosition;
    let nearestId: string | null = null;
    let nearestDistance = Number.POSITIVE_INFINITY;

    for (const object of gameObjects) {
      const distance = Math.hypot(playerX - object.position[0], playerZ - object.position[2]);
      if (distance < INTERACTION_DISTANCE && distance < nearestDistance) {
        nearestId = object.id;
        nearestDistance = distance;
      }
    }

    if (useGameStore.getState().nearbyObjectId !== nearestId) setNearbyObject(nearestId);
  });

  useEffect(() => {
    const handleInteraction = (event: KeyboardEvent) => {
      if (event.code !== "KeyE" || event.repeat) return;
      const { activeObjectId, hasStarted, nearbyObjectId, setActiveObject } = useGameStore.getState();
      if (hasStarted && !activeObjectId && nearbyObjectId) setActiveObject(nearbyObjectId);
    };

    window.addEventListener("keydown", handleInteraction);
    return () => window.removeEventListener("keydown", handleInteraction);
  }, []);

  return null;
}
