"use client";

import { useMemo } from "react";
import type { CharacterAnimationState, CharacterRole } from "@/types/models";

type CharacterAnimationOptions = {
  role: CharacterRole;
  isMoving?: boolean;
  isNearby?: boolean;
  isInteracting?: boolean;
};

export function useCharacterAnimation({ role, isMoving = false, isNearby = false, isInteracting = false }: CharacterAnimationOptions) {
  return useMemo<CharacterAnimationState>(() => {
    if (role === "player") return isInteracting ? "interact" : isMoving ? "walk" : "idle";
    if (role === "boss") return isInteracting ? "bossInteract" : isNearby ? "pulse" : "bossIdle";
    if (role === "portal") return isInteracting ? "portalInteract" : isNearby ? "pulse" : "idle";
    return isInteracting ? "interact" : isNearby ? "greet" : "hover";
  }, [isInteracting, isMoving, isNearby, role]);
}

export function getProceduralMotion(animationState: CharacterAnimationState) {
  return {
    attention: ["greet", "interact", "pulse", "bossInteract", "portalInteract"].includes(animationState),
    interacting: ["interact", "bossInteract", "portalInteract"].includes(animationState),
    pulseStrength: ["pulse", "bossInteract", "portalInteract"].includes(animationState) ? 1 : 0.45,
    speed: ["walk", "bossInteract", "portalInteract"].includes(animationState) ? 1.7 : 1,
  };
}
