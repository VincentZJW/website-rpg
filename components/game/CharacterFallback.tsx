"use client";

import type { RefObject } from "react";
import * as THREE from "three";
import type { FallbackType } from "@/types/models";

type CharacterFallbackProps = {
  fallbackType: FallbackType;
  modelRef?: RefObject<THREE.Group | null>;
  themeColor: string;
  isNight: boolean;
};

function HeroFallback({ themeColor, isNight }: Pick<CharacterFallbackProps, "themeColor" | "isNight">) {
  return (
    <>
      <mesh name="Cape" position={[0, 1.05, -0.31]} rotation={[0.22, 0, 0]} castShadow>
        <coneGeometry args={[0.68, 1.25, 5]} />
        <meshStandardMaterial color="#5b4a91" emissive="#9a7cff" emissiveIntensity={isNight ? 0.28 : 0.03} />
      </mesh>
      <mesh position={[0, 1.06, 0]} castShadow>
        <capsuleGeometry args={[0.39, 0.56, 5, 9]} />
        <meshStandardMaterial color="#e9f4f5" emissive={themeColor} emissiveIntensity={isNight ? 0.16 : 0.02} roughness={0.42} />
      </mesh>
      <mesh position={[0, 1.19, 0.34]}>
        <octahedronGeometry args={[0.17, 0]} />
        <meshStandardMaterial color={themeColor} emissive={themeColor} emissiveIntensity={isNight ? 1.2 : 0.32} />
      </mesh>
      <group name="Head" position={[0, 1.78, 0]}>
        <mesh castShadow>
          <icosahedronGeometry args={[0.55, 1]} />
          <meshStandardMaterial color="#e7f5f5" roughness={0.34} />
        </mesh>
        <mesh position={[0, 0.01, 0.48]}>
          <boxGeometry args={[0.68, 0.16, 0.08]} />
          <meshStandardMaterial color="#12253b" emissive="#55eaff" emissiveIntensity={isNight ? 2.2 : 0.7} />
        </mesh>
        <mesh position={[0, 0.38, -0.04]}>
          <boxGeometry args={[0.72, 0.16, 0.62]} />
          <meshStandardMaterial color="#23445e" />
        </mesh>
      </group>
      <mesh position={[0, 1.21, -0.46]} castShadow>
        <boxGeometry args={[0.56, 0.65, 0.28]} />
        <meshStandardMaterial color="#264d70" emissive={themeColor} emissiveIntensity={isNight ? 0.28 : 0.03} />
      </mesh>
      <group name="LeftArm" position={[-0.48, 1.2, 0]}>
        <mesh position={[0, -0.25, 0]} castShadow>
          <capsuleGeometry args={[0.13, 0.36, 4, 7]} />
          <meshStandardMaterial color="#315879" />
        </mesh>
      </group>
      <group name="RightArm" position={[0.48, 1.2, 0]}>
        <mesh position={[0, -0.25, 0]} castShadow>
          <capsuleGeometry args={[0.13, 0.36, 4, 7]} />
          <meshStandardMaterial color="#315879" />
        </mesh>
        <mesh position={[0, -0.52, 0.12]} rotation={[-0.35, 0, 0]}>
          <boxGeometry args={[0.42, 0.06, 0.3]} />
          <meshStandardMaterial color="#153b59" emissive={themeColor} emissiveIntensity={isNight ? 1.2 : 0.24} />
        </mesh>
      </group>
      <group name="LeftLeg" position={[-0.22, 0.72, 0]}>
        <mesh position={[0, -0.34, 0]} castShadow>
          <capsuleGeometry args={[0.15, 0.42, 4, 7]} />
          <meshStandardMaterial color="#193654" />
        </mesh>
      </group>
      <group name="RightLeg" position={[0.22, 0.72, 0]}>
        <mesh position={[0, -0.34, 0]} castShadow>
          <capsuleGeometry args={[0.15, 0.42, 4, 7]} />
          <meshStandardMaterial color="#193654" />
        </mesh>
      </group>
      <mesh position={[-0.54, 1.26, -0.52]} rotation={[0, 0, -0.5]} castShadow>
        <boxGeometry args={[0.12, 1.65, 0.12]} />
        <meshStandardMaterial color="#bafaff" emissive={themeColor} emissiveIntensity={isNight ? 0.72 : 0.18} />
      </mesh>
      <mesh position={[-0.2, 0.72, -0.52]} rotation={[0, 0, -0.5]}>
        <boxGeometry args={[0.52, 0.12, 0.16]} />
        <meshStandardMaterial color="#f6c56b" />
      </mesh>
    </>
  );
}

function NpcFallback({
  fallbackType,
  themeColor,
  isNight,
}: Pick<CharacterFallbackProps, "fallbackType" | "themeColor" | "isNight">) {
  const isSage = fallbackType === "data-sage-procedural";
  const isScout = fallbackType === "robotics-scout-procedural";
  const isGuildMaster = fallbackType === "guild-master-procedural";
  const isLibrarian = fallbackType === "insight-librarian-procedural";

  return (
    <>
      <mesh position={[0, 1.08, 0]} castShadow>
        <capsuleGeometry args={[0.42, 0.58, 4, 8]} />
        <meshStandardMaterial color={isScout ? "#c4d9dc" : "#e7f4f0"} emissive={themeColor} emissiveIntensity={isNight ? 0.18 : 0.03} roughness={0.48} />
      </mesh>
      <group name="Head" position={[0, 1.87, 0]}>
        <mesh castShadow>
          <icosahedronGeometry args={[0.58, 1]} />
          <meshStandardMaterial color={isScout ? "#7894a0" : themeColor} emissive={themeColor} emissiveIntensity={isNight ? 0.5 : 0.08} roughness={0.3} />
        </mesh>
        <mesh name="Eyes" position={[0, 0.01, 0.5]}>
          <boxGeometry args={[0.64, 0.12, 0.07]} />
          <meshStandardMaterial color="#0c1d35" emissive="#e9ffff" emissiveIntensity={isNight ? 1.5 : 0.45} />
        </mesh>
      </group>
      <group name="LeftArm" position={[-0.5, 1.12, 0]}>
        <mesh position={[0, -0.2, 0]}>
          <capsuleGeometry args={[0.12, 0.35, 4, 7]} />
          <meshStandardMaterial color="#315879" />
        </mesh>
      </group>
      <group name="RightArm" position={[0.5, 1.12, 0]}>
        <mesh position={[0, -0.2, 0]}>
          <capsuleGeometry args={[0.12, 0.35, 4, 7]} />
          <meshStandardMaterial color="#315879" />
        </mesh>
      </group>
      {isSage && (
        <>
          <mesh position={[0.68, 1.18, 0]}>
            <cylinderGeometry args={[0.05, 0.07, 1.45, 8]} />
            <meshStandardMaterial color="#9acaf2" emissive={themeColor} emissiveIntensity={isNight ? 0.86 : 0.14} />
          </mesh>
          <mesh name="Orb" position={[0.68, 1.98, 0]}>
            <icosahedronGeometry args={[0.24, 0]} />
            <meshStandardMaterial color={themeColor} emissive={themeColor} emissiveIntensity={1.2} />
          </mesh>
        </>
      )}
      {isScout && (
        <>
          <mesh position={[0, 2.22, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.52, 6]} />
            <meshStandardMaterial color="#35636d" />
          </mesh>
          <mesh name="Beacon" position={[0, 2.51, 0]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshStandardMaterial color={themeColor} emissive={themeColor} emissiveIntensity={1.35} />
          </mesh>
        </>
      )}
      {isGuildMaster && (
        <>
          <mesh position={[0, 1.12, 0.42]}>
            <octahedronGeometry args={[0.28, 0]} />
            <meshStandardMaterial color="#d5c0ff" emissive={themeColor} emissiveIntensity={isNight ? 0.86 : 0.14} />
          </mesh>
          <mesh name="Cape" position={[0, 1.12, -0.25]} rotation={[0.2, 0, 0]}>
            <coneGeometry args={[0.76, 1.1, 5]} />
            <meshStandardMaterial color="#634f9e" emissive={themeColor} emissiveIntensity={isNight ? 0.3 : 0.04} />
          </mesh>
        </>
      )}
      {isLibrarian &&
        [-0.62, 0.62].map((x, index) => (
          <mesh name={`Book${index + 1}`} key={x} position={[x, 1.44 + index * 0.26, 0.16]} rotation={[0.1, 0.1 * index, 0.14]}>
            <boxGeometry args={[0.56, 0.06, 0.7]} />
            <meshStandardMaterial color="#fff0b1" emissive={themeColor} emissiveIntensity={isNight ? 0.86 : 0.14} />
          </mesh>
        ))}
    </>
  );
}

function DragonFallback({ themeColor, isNight }: Pick<CharacterFallbackProps, "themeColor" | "isNight">) {
  return (
    <>
      <mesh position={[0, 1.76, 0]} castShadow>
        <dodecahedronGeometry args={[1.16, 0]} />
        <meshStandardMaterial color="#293568" emissive={themeColor} emissiveIntensity={isNight ? 0.92 : 0.34} metalness={0.5} roughness={0.26} />
      </mesh>
      <group name="Head" position={[0, 1.88, 1.04]}>
        <mesh castShadow>
          <coneGeometry args={[0.75, 1.25, 5]} />
          <meshStandardMaterial color="#40538d" emissive={themeColor} emissiveIntensity={isNight ? 0.7 : 0.26} />
        </mesh>
      </group>
      {[-0.52, 0.52].map((x) => (
        <mesh key={x} position={[x, 2.62, 0.42]} rotation={[-0.2, 0, x > 0 ? -0.42 : 0.42]}>
          <coneGeometry args={[0.18, 0.9, 5]} />
          <meshStandardMaterial color="#c5bbff" emissive={themeColor} emissiveIntensity={0.62} />
        </mesh>
      ))}
      {[-1.48, 1.48].map((x, index) => (
        <mesh name={index === 0 ? "LeftWing" : "RightWing"} key={x} position={[x, 1.82, -0.12]} rotation={[0, x > 0 ? -0.34 : 0.34, x > 0 ? 0.24 : -0.24]}>
          <coneGeometry args={[0.74, 2.2, 5]} />
          <meshStandardMaterial color="#7b4d9f" emissive="#a277ff" emissiveIntensity={isNight ? 0.48 : 0.14} />
        </mesh>
      ))}
      <mesh name="TailOne" position={[0, 1.34, -1.45]}>
        <coneGeometry args={[0.58, 1.6, 5]} />
        <meshStandardMaterial color="#40538d" emissive={themeColor} emissiveIntensity={0.36} />
      </mesh>
    </>
  );
}

function PortalFallback({ themeColor, isNight }: Pick<CharacterFallbackProps, "themeColor" | "isNight">) {
  return (
    <>
      <group name="PortalRings" position={[0, 2.24, 0]}>
        <mesh>
          <torusGeometry args={[1.72, 0.17, 12, 48]} />
          <meshStandardMaterial color={themeColor} emissive={themeColor} emissiveIntensity={isNight ? 1.65 : 0.52} metalness={0.4} roughness={0.15} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 3]}>
          <torusGeometry args={[2.08, 0.055, 8, 48]} />
          <meshBasicMaterial color="#a277ff" transparent opacity={isNight ? 0.88 : 0.48} />
        </mesh>
        <mesh rotation={[0, 0, -Math.PI / 3]}>
          <torusGeometry args={[2.36, 0.04, 8, 48]} />
          <meshBasicMaterial color="#ff7dd6" transparent opacity={isNight ? 0.76 : 0.38} />
        </mesh>
      </group>
      <mesh position={[0, 2.24, -0.08]}>
        <circleGeometry args={[1.5, 48]} />
        <meshBasicMaterial color="#3e70bd" transparent opacity={isNight ? 0.44 : 0.18} />
      </mesh>
      <mesh position={[0, 2.15, 0]}>
        <cylinderGeometry args={[0.7, 1.65, 4.5, 24, 1, true]} />
        <meshBasicMaterial color={themeColor} transparent opacity={isNight ? 0.08 : 0.045} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
}

function GuideSpiritFallback({ themeColor }: Pick<CharacterFallbackProps, "themeColor">) {
  return (
    <>
      <mesh name="Head">
        <octahedronGeometry args={[0.32, 0]} />
        <meshStandardMaterial color="#e8ffff" emissive={themeColor} emissiveIntensity={1.4} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.5, 0.04, 6, 18]} />
        <meshBasicMaterial color="#a277ff" transparent opacity={0.8} />
      </mesh>
    </>
  );
}

export function CharacterFallback({ fallbackType, modelRef, themeColor, isNight }: CharacterFallbackProps) {
  if (fallbackType === "none") return null;

  return (
    <group ref={modelRef}>
      {fallbackType === "hero-adventurer" && <HeroFallback themeColor={themeColor} isNight={isNight} />}
      {fallbackType.endsWith("-procedural") &&
        !["guide-spirit-procedural", "career-fog-dragon-procedural", "portal-procedural"].includes(fallbackType) && (
          <NpcFallback fallbackType={fallbackType} themeColor={themeColor} isNight={isNight} />
        )}
      {fallbackType === "guide-spirit-procedural" && <GuideSpiritFallback themeColor={themeColor} />}
      {fallbackType === "career-fog-dragon-procedural" && <DragonFallback themeColor={themeColor} isNight={isNight} />}
      {fallbackType === "portal-procedural" && <PortalFallback themeColor={themeColor} isNight={isNight} />}
    </group>
  );
}
