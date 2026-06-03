"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore } from "@/hooks/useGameStore";
import { gameObjects } from "@/lib/game-data";

const desiredPosition = new THREE.Vector3();
const targetPosition = new THREE.Vector3();
const interactionTarget = new THREE.Vector3();
const lookAt = new THREE.Vector3();

export function CameraRig() {
  const { camera } = useThree();

  useFrame((_, delta) => {
    const { activeObjectId, playerPosition } = useGameStore.getState();
    const [x, y, z] = playerPosition;
    const activeObject = gameObjects.find((object) => object.id === activeObjectId);
    const cameraDamping = activeObject ? 3.2 : 4.4;

    desiredPosition.set(x + (activeObject ? 6.5 : 7.6), y + (activeObject ? 7.7 : 8.4), z + (activeObject ? 9.4 : 10.6));
    targetPosition.set(x, y + 0.9, z);
    if (activeObject) {
      interactionTarget.set(activeObject.position[0], activeObject.position[1] + 1.45, activeObject.position[2]);
      targetPosition.lerp(interactionTarget, 0.3);
    }
    camera.position.lerp(desiredPosition, 1 - Math.exp(-cameraDamping * delta));
    lookAt.lerp(targetPosition, 1 - Math.exp(-7 * delta));
    camera.lookAt(lookAt);
  });

  return null;
}
