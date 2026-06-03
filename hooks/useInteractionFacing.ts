"use client";

import { useCallback } from "react";
import * as THREE from "three";

export function useInteractionFacing() {
  return useCallback(
    (
      object: THREE.Object3D,
      source: readonly [number, number],
      target: readonly [number, number],
      delta: number,
      damping = 4.6,
    ) => {
      const heading = Math.atan2(target[0] - source[0], target[1] - source[1]);
      object.rotation.y = THREE.MathUtils.damp(object.rotation.y, heading, damping, delta);
    },
    [],
  );
}
