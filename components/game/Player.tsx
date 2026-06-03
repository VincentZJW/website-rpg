"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CharacterModel } from "@/components/game/CharacterModel";
import { collisionObstacles, gameObjects, playerSpawnPosition } from "@/lib/game-data";
import { useCharacterAnimation } from "@/hooks/useCharacterAnimation";
import { useGameStore } from "@/hooks/useGameStore";
import { useInteractionFacing } from "@/hooks/useInteractionFacing";

const MOVEMENT_KEYS = new Set([
  "KeyW",
  "KeyA",
  "KeyS",
  "KeyD",
  "ArrowUp",
  "ArrowLeft",
  "ArrowDown",
  "ArrowRight",
]);
const WORLD_LIMIT = 20;
const PLAYER_RADIUS = 0.62;

function collidesWithObstacle(x: number, z: number) {
  return collisionObstacles.some(({ position, radius }) => {
    const distance = Math.hypot(x - position[0], z - position[1]);
    return distance < radius + PLAYER_RADIUS;
  });
}

export function Player({ reducedMotion, isNight }: { reducedMotion: boolean; isNight: boolean }) {
  const group = useRef<THREE.Group>(null);
  const modelRoot = useRef<THREE.Group>(null);
  const fallbackRoot = useRef<THREE.Group>(null);
  const activeKeys = useRef(new Set<string>());
  const velocity = useRef(new THREE.Vector3());
  const movement = useRef(new THREE.Vector3());
  const storeUpdateElapsed = useRef(0);
  const [isMoving, setIsMoving] = useState(false);
  const hasStarted = useGameStore((state) => state.hasStarted);
  const activeObjectId = useGameStore((state) => state.activeObjectId);
  const setPlayerPosition = useGameStore((state) => state.setPlayerPosition);
  const faceTowards = useInteractionFacing();
  const animationState = useCharacterAnimation({
    role: "player",
    isMoving,
    isInteracting: Boolean(activeObjectId),
  });

  useEffect(() => {
    const updateMovingState = () => setIsMoving(activeKeys.current.size > 0);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!MOVEMENT_KEYS.has(event.code)) return;
      const { activeObjectId: openObjectId, hasStarted: canMove } = useGameStore.getState();
      if (!canMove || openObjectId) return;
      event.preventDefault();
      activeKeys.current.add(event.code);
      updateMovingState();
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      activeKeys.current.delete(event.code);
      updateMovingState();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (hasStarted && !activeObjectId) return;
    activeKeys.current.clear();
    velocity.current.set(0, 0, 0);
  }, [activeObjectId, hasStarted]);

  useFrame((state, delta) => {
    if (!group.current) return;

    const keys = activeKeys.current;
    const direction = movement.current.set(
      hasStarted
        ? Number(keys.has("KeyD") || keys.has("ArrowRight")) -
            Number(keys.has("KeyA") || keys.has("ArrowLeft"))
        : 0,
      0,
      hasStarted
        ? Number(keys.has("KeyS") || keys.has("ArrowDown")) -
            Number(keys.has("KeyW") || keys.has("ArrowUp"))
        : 0,
    );

    if (direction.lengthSq() > 0) direction.normalize();

    const moving = direction.lengthSq() > 0 || velocity.current.lengthSq() > 0.08;
    const targetSpeed = direction.lengthSq() > 0 ? 5.25 : 0;
    const responsiveness = direction.lengthSq() > 0 ? 7.2 : 10;
    velocity.current.x = THREE.MathUtils.damp(velocity.current.x, direction.x * targetSpeed, responsiveness, delta);
    velocity.current.z = THREE.MathUtils.damp(velocity.current.z, direction.z * targetSpeed, responsiveness, delta);

    const current = group.current.position;
    const nextX = THREE.MathUtils.clamp(current.x + velocity.current.x * delta, -WORLD_LIMIT, WORLD_LIMIT);
    const nextZ = THREE.MathUtils.clamp(current.z + velocity.current.z * delta, -WORLD_LIMIT, WORLD_LIMIT);

    if (!collidesWithObstacle(nextX, current.z)) current.x = nextX;
    else velocity.current.x = 0;
    if (!collidesWithObstacle(current.x, nextZ)) current.z = nextZ;
    else velocity.current.z = 0;

    const activeObject = gameObjects.find((object) => object.id === activeObjectId);
    if (activeObject && direction.lengthSq() === 0) {
      faceTowards(group.current, [current.x, current.z], [activeObject.position[0], activeObject.position[2]], delta, 8);
    } else if (velocity.current.lengthSq() > 0.05) {
      faceTowards(group.current, [current.x, current.z], [current.x + velocity.current.x, current.z + velocity.current.z], delta, 11);
    }

    const elapsed = state.clock.elapsedTime;
    const walk = reducedMotion || !moving ? 0 : Math.sin(elapsed * 10) * 0.58;
    const idle = reducedMotion ? 0 : Math.sin(elapsed * 2.5) * 0.035;
    current.y = moving ? Math.abs(Math.sin(elapsed * 10)) * 0.065 : idle;

    const visualRoot = modelRoot.current ?? fallbackRoot.current;
    if (visualRoot) {
      const interactionLift = activeObjectId ? -0.48 : 0;
      const leftArm = visualRoot.getObjectByName("LeftArm");
      const rightArm = visualRoot.getObjectByName("RightArm");
      const leftLeg = visualRoot.getObjectByName("LeftLeg");
      const rightLeg = visualRoot.getObjectByName("RightLeg");
      const cape = visualRoot.getObjectByName("Cape");
      if (leftArm) leftArm.rotation.x = THREE.MathUtils.damp(leftArm.rotation.x, walk * 0.72, 10, delta);
      if (rightArm) rightArm.rotation.x = THREE.MathUtils.damp(rightArm.rotation.x, -walk * 0.72 + interactionLift, 10, delta);
      if (leftLeg) leftLeg.rotation.x = THREE.MathUtils.damp(leftLeg.rotation.x, -walk * 0.78, 10, delta);
      if (rightLeg) rightLeg.rotation.x = THREE.MathUtils.damp(rightLeg.rotation.x, walk * 0.78, 10, delta);
      if (cape) cape.rotation.x = THREE.MathUtils.damp(cape.rotation.x, -0.18 + Math.abs(walk) * 0.18 + idle, 6, delta);
    }

    storeUpdateElapsed.current += delta;
    if (storeUpdateElapsed.current > 0.065) {
      storeUpdateElapsed.current = 0;
      setPlayerPosition([current.x, 0, current.z]);
    }
  });

  return (
    <group ref={group} position={playerSpawnPosition}>
      <CharacterModel
        animationState={animationState}
        fallbackRef={fallbackRoot}
        fallbackType="hero-adventurer"
        isActive={Boolean(activeObjectId)}
        isNight={isNight}
        modelId="vincent-hero"
        modelRef={modelRoot}
        priority
        reducedMotion={reducedMotion}
        themeColor="#4de8ff"
      />
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.62, 0.82, 28]} />
        <meshBasicMaterial color="#4de8ff" transparent opacity={isNight ? 0.86 : 0.45} />
      </mesh>
      {isNight && <pointLight position={[0, 1.4, 0]} color="#4de8ff" intensity={0.88} distance={3.4} />}
    </group>
  );
}
