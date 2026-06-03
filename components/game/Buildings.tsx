"use client";

import { Line, Sparkles } from "@react-three/drei";
import { gameObjects, spawnPlazaPosition } from "@/lib/game-data";
import type { WorldTheme } from "@/lib/theme-config";

type BuildingProps = {
  theme: WorldTheme;
  isNight: boolean;
  reducedMotion: boolean;
};

function getLandmark(id: string) {
  const object = gameObjects.find((item) => item.id === id);
  if (!object) throw new Error(`Unknown landmark: ${id}`);
  return object.landmarkPosition;
}

function Window({
  position,
  color,
  isNight,
  size = [0.52, 0.66, 0.08],
}: {
  position: [number, number, number];
  color: string;
  isNight: boolean;
  size?: [number, number, number];
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isNight ? 1.8 : 0.12} />
    </mesh>
  );
}

function Flag({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.035, 0.045, 1.5, 6]} />
        <meshStandardMaterial color="#715842" roughness={0.84} />
      </mesh>
      <mesh position={[0.35, 1.12, 0]}>
        <boxGeometry args={[0.66, 0.42, 0.045]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.12} roughness={0.75} />
      </mesh>
    </group>
  );
}

function CottageShell({
  bodyColor,
  roofColor,
  position = [0, 0, 0],
  scale = [1, 1, 1],
}: {
  bodyColor: string;
  roofColor: string;
  position?: [number, number, number];
  scale?: [number, number, number];
}) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.4, 2.2, 2.65]} />
        <meshStandardMaterial color={bodyColor} roughness={0.76} />
      </mesh>
      <mesh position={[0, 2.72, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[2.45, 1.45, 4]} />
        <meshStandardMaterial color={roofColor} roughness={0.82} />
      </mesh>
      <mesh position={[0, 0.78, 1.36]}>
        <boxGeometry args={[0.78, 1.56, 0.08]} />
        <meshStandardMaterial color="#654c45" roughness={0.86} />
      </mesh>
      <mesh position={[0.23, 0.78, 1.42]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial color="#f6c76b" metalness={0.35} />
      </mesh>
    </group>
  );
}

export function SpawnPlaza({ theme, isNight }: Pick<BuildingProps, "theme" | "isNight">) {
  return (
    <group position={spawnPlazaPosition}>
      <mesh position={[0, 0.08, 0]} receiveShadow>
        <cylinderGeometry args={[3.7, 3.9, 0.18, 16]} />
        <meshStandardMaterial color={theme.pathColor} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.2, 0]} receiveShadow>
        <cylinderGeometry args={[1.35, 1.55, 0.24, 12]} />
        <meshStandardMaterial color={theme.buildingColor} roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.18, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.56, 1.85, 8]} />
        <meshStandardMaterial color={theme.roofColor} emissive={theme.accentColor} emissiveIntensity={isNight ? 0.3 : 0.04} />
      </mesh>
      <mesh position={[0, 2.34, 0]} castShadow>
        <octahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial color={theme.accentColor} emissive={theme.accentColor} emissiveIntensity={isNight ? 1.35 : 0.25} />
      </mesh>
      {[0.74, 1.25, 1.76].map((radius) => (
        <mesh key={radius} position={[0, 0.33, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius, radius + 0.055, 32]} />
          <meshBasicMaterial color={theme.accentColor} transparent opacity={isNight ? 0.74 : 0.28} />
        </mesh>
      ))}
      {[[-2.4, 0, -2.1], [2.25, 0, -2], [-2.55, 0, 2.08], [2.48, 0, 2.1]].map((position, index) => (
        <group key={index} position={position as [number, number, number]} rotation={[0, index % 2 ? -0.3 : 0.3, 0]}>
          <mesh position={[0, 0.45, 0]}>
            <boxGeometry args={[1.22, 0.14, 0.42]} />
            <meshStandardMaterial color="#8b6849" roughness={0.9} />
          </mesh>
          {[-0.48, 0.48].map((x) => (
            <mesh key={x} position={[x, 0.23, 0]}>
              <boxGeometry args={[0.12, 0.45, 0.38]} />
              <meshStandardMaterial color="#725039" roughness={0.92} />
            </mesh>
          ))}
        </group>
      ))}
      <Flag position={[-3.05, 0.1, 0]} color="#4de8ff" />
      <Flag position={[3.05, 0.1, 0]} color="#a277ff" />
    </group>
  );
}

export function DataLabBuilding({ theme, isNight, reducedMotion }: BuildingProps) {
  return (
    <group position={getLandmark("data-sage")}>
      <CottageShell bodyColor={theme.buildingColor} roofColor="#4c8ead" />
      <Window position={[-1.1, 1.32, 1.36]} color="#35cfff" isNight={isNight} />
      <Window position={[1.1, 1.32, 1.36]} color="#35cfff" isNight={isNight} />
      <mesh position={[0.86, 3.86, -0.16]}>
        <cylinderGeometry args={[0.07, 0.1, 1.35, 8]} />
        <meshStandardMaterial color="#5b8194" metalness={0.56} />
      </mesh>
      <mesh position={[0.86, 4.66, -0.16]}>
        <octahedronGeometry args={[0.26, 0]} />
        <meshStandardMaterial color="#35cfff" emissive="#35cfff" emissiveIntensity={isNight ? 1.5 : 0.38} />
      </mesh>
      {[-1.22, -0.48, 0.26].map((x, index) => (
        <mesh key={x} position={[x, 0.66 + index * 0.28, 1.58]}>
          <boxGeometry args={[0.28, 0.78 + index * 0.38, 0.22]} />
          <meshStandardMaterial color="#8de7f5" emissive="#35cfff" emissiveIntensity={isNight ? 0.9 : 0.16} />
        </mesh>
      ))}
      {!reducedMotion && <Sparkles count={18} scale={[4.5, 4.5, 4]} size={0.9} speed={0.22} color="#35cfff" />}
    </group>
  );
}

export function RoboticsGateBuilding({ theme, isNight }: Pick<BuildingProps, "theme" | "isNight">) {
  return (
    <group position={getLandmark("robotics-scout")}>
      <CottageShell bodyColor={theme.buildingColor} roofColor="#5e7b78" scale={[0.9, 0.92, 0.92]} />
      <Window position={[-0.98, 1.28, 1.28]} color="#5cf2c7" isNight={isNight} />
      <Window position={[0.98, 1.28, 1.28]} color="#5cf2c7" isNight={isNight} />
      {[-2.05, 2.05].map((x) => (
        <mesh key={x} position={[x, 1.55, 1.05]} castShadow>
          <boxGeometry args={[0.46, 3.1, 0.55]} />
          <meshStandardMaterial color={theme.roofColor} emissive="#5cf2c7" emissiveIntensity={isNight ? 0.4 : 0.04} />
        </mesh>
      ))}
      <mesh position={[0, 2.95, 1.05]} castShadow>
        <boxGeometry args={[4.45, 0.42, 0.55]} />
        <meshStandardMaterial color={theme.roofColor} emissive="#5cf2c7" emissiveIntensity={isNight ? 0.4 : 0.04} />
      </mesh>
      {[-1.18, 1.18].map((x) => (
        <mesh key={x} position={[x, 3.52, 1.12]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.44, 0.11, 6, 12]} />
          <meshStandardMaterial color="#759e9b" emissive="#5cf2c7" emissiveIntensity={isNight ? 0.56 : 0.08} />
        </mesh>
      ))}
      <mesh position={[0, 3.44, 1.12]}>
        <octahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial color="#5cf2c7" emissive="#5cf2c7" emissiveIntensity={isNight ? 1.3 : 0.28} />
      </mesh>
    </group>
  );
}

export function TalentGuildBuilding({ theme, isNight }: Pick<BuildingProps, "theme" | "isNight">) {
  const networkNodes = [
    [-1.1, 4.18, 1.5],
    [0, 4.62, 1.5],
    [1.1, 4.18, 1.5],
  ] as [number, number, number][];

  return (
    <group position={getLandmark("guild-master")}>
      <CottageShell bodyColor={theme.buildingColor} roofColor="#765f9f" scale={[1.17, 1.08, 1.05]} />
      <Window position={[-1.3, 1.34, 1.46]} color="#ffd889" isNight={isNight} />
      <Window position={[1.3, 1.34, 1.46]} color="#ffd889" isNight={isNight} />
      <mesh position={[0, 2.06, 1.54]}>
        <boxGeometry args={[2.28, 0.76, 0.12]} />
        <meshStandardMaterial color="#72524a" roughness={0.82} />
      </mesh>
      <mesh position={[0, 2.06, 1.64]}>
        <octahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial color="#cdb5ff" emissive="#a277ff" emissiveIntensity={isNight ? 1.22 : 0.22} />
      </mesh>
      <mesh position={[2.6, 0.94, 1.38]}>
        <boxGeometry args={[1.25, 1.58, 0.16]} />
        <meshStandardMaterial color="#856348" roughness={0.88} />
      </mesh>
      {[0.34, 0, -0.34].map((y, index) => (
        <mesh key={y} position={[2.6 + (index % 2 ? 0.2 : -0.15), 1 + y, 1.5]}>
          <boxGeometry args={[0.38, 0.27, 0.04]} />
          <meshStandardMaterial color={index === 1 ? "#d9f5f3" : "#f5d49c"} roughness={0.92} />
        </mesh>
      ))}
      <Line points={networkNodes} color="#cdb5ff" lineWidth={1} transparent opacity={0.72} />
      {networkNodes.map((position) => (
        <mesh key={position.join("-")} position={position}>
          <sphereGeometry args={[0.13, 8, 8]} />
          <meshBasicMaterial color="#cdb5ff" />
        </mesh>
      ))}
      <Flag position={[-2.62, 0.05, 0.62]} color="#a277ff" />
    </group>
  );
}

export function InsightLibraryBuilding({ theme, isNight }: Pick<BuildingProps, "theme" | "isNight">) {
  return (
    <group position={getLandmark("insight-librarian")}>
      <CottageShell bodyColor={theme.buildingColor} roofColor="#9b6d73" scale={[1.08, 1.14, 1.08]} />
      {[-1.22, -0.42, 0.42, 1.22].map((x) => (
        <Window key={x} position={[x, 1.48, 1.48]} color="#ffd889" isNight={isNight} size={[0.38, 0.9, 0.08]} />
      ))}
      <mesh position={[0, 2.34, 1.56]}>
        <boxGeometry args={[1.7, 0.54, 0.11]} />
        <meshStandardMaterial color="#72524a" />
      </mesh>
      <mesh position={[0, 2.34, 1.65]}>
        <boxGeometry args={[0.82, 0.12, 0.04]} />
        <meshStandardMaterial color="#ffeab8" emissive="#ffb867" emissiveIntensity={isNight ? 0.9 : 0.1} />
      </mesh>
      {[-1.34, 0, 1.26].map((x, index) => (
        <mesh key={x} position={[x, 3.48 + index * 0.16, 0.54]} rotation={[0.12, 0.14 * index, 0.13]}>
          <boxGeometry args={[0.56, 0.055, 0.74]} />
          <meshStandardMaterial color="#fff0b1" emissive="#ffb867" emissiveIntensity={isNight ? 0.72 : 0.12} />
        </mesh>
      ))}
    </group>
  );
}

export function BossArenaBuilding({ theme, isNight, reducedMotion }: BuildingProps) {
  return (
    <group position={getLandmark("career-fog-dragon")}>
      <mesh position={[0, 0.14, 0]} receiveShadow>
        <cylinderGeometry args={[4.3, 4.65, 0.3, 16]} />
        <meshStandardMaterial color={theme.roofColor} emissive="#6f73c9" emissiveIntensity={isNight ? 0.2 : 0.07} roughness={0.64} />
      </mesh>
      <mesh position={[0, 0.33, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.9, 3.58, 42]} />
        <meshBasicMaterial color="#9b8cff" transparent opacity={isNight ? 0.52 : 0.24} />
      </mesh>
      {Array.from({ length: 7 }, (_, index) => {
        const angle = (Math.PI * 2 * index) / 7;
        return (
          <group key={index} position={[Math.cos(angle) * 3.78, 0, Math.sin(angle) * 3.78]}>
            <mesh position={[0, 1.24, 0]} castShadow>
              <cylinderGeometry args={[0.3, 0.5, 2.48, 7]} />
              <meshStandardMaterial color={theme.buildingColor} emissive="#a277ff" emissiveIntensity={isNight ? 0.22 : 0.05} />
            </mesh>
            <mesh position={[0, 2.68, 0]}>
              <octahedronGeometry args={[0.42, 0]} />
              <meshStandardMaterial color="#b8c7ff" emissive="#9b8cff" emissiveIntensity={isNight ? 1.25 : 0.46} />
            </mesh>
          </group>
        );
      })}
      {!reducedMotion && <Sparkles count={32} scale={[8, 4.5, 8]} size={1.1} speed={0.3} color="#9b8cff" />}
    </group>
  );
}

export function ContactPortalBuilding({ theme, isNight }: Pick<BuildingProps, "theme" | "isNight">) {
  return (
    <group position={getLandmark("contact-portal")}>
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <cylinderGeometry args={[2.7, 3, 0.3, 12]} />
        <meshStandardMaterial color={theme.pathColor} emissive="#4de8ff" emissiveIntensity={isNight ? 0.16 : 0.04} roughness={0.68} />
      </mesh>
      {[-2, 2].map((x) => (
        <group key={x} position={[x, 0, -0.18]}>
          <mesh position={[0, 1.8, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.48, 3.6, 8]} />
            <meshStandardMaterial color={theme.buildingColor} emissive="#4de8ff" emissiveIntensity={isNight ? 0.28 : 0.04} />
          </mesh>
          <mesh position={[0, 3.84, 0]}>
            <octahedronGeometry args={[0.44, 0]} />
            <meshStandardMaterial color="#4de8ff" emissive="#4de8ff" emissiveIntensity={isNight ? 1.4 : 0.32} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 3.48, -0.18]} castShadow>
        <boxGeometry args={[4.42, 0.42, 0.6]} />
        <meshStandardMaterial color={theme.roofColor} emissive="#a277ff" emissiveIntensity={isNight ? 0.32 : 0.05} />
      </mesh>
      <mesh position={[0, 4.06, -0.18]}>
        <octahedronGeometry args={[0.44, 0]} />
        <meshStandardMaterial color="#a277ff" emissive="#a277ff" emissiveIntensity={isNight ? 1.3 : 0.3} />
      </mesh>
    </group>
  );
}

export function TownBuildings(props: BuildingProps) {
  return (
    <>
      <SpawnPlaza theme={props.theme} isNight={props.isNight} />
      <DataLabBuilding {...props} />
      <RoboticsGateBuilding theme={props.theme} isNight={props.isNight} />
      <TalentGuildBuilding theme={props.theme} isNight={props.isNight} />
      <InsightLibraryBuilding theme={props.theme} isNight={props.isNight} />
      <BossArenaBuilding {...props} />
      <ContactPortalBuilding theme={props.theme} isNight={props.isNight} />
    </>
  );
}
