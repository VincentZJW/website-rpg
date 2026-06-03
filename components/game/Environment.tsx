"use client";

import type { WorldTheme } from "@/lib/theme-config";

type EnvironmentProps = {
  theme: WorldTheme;
  isNight: boolean;
};

const trees = [
  [-18, -12, 1.1],
  [-16, -4, 0.92],
  [-17, 4.2, 1.04],
  [-9.2, 14.8, 0.9],
  [-4.4, 15.8, 1.06],
  [2.6, 16.5, 1.14],
  [8.6, 15.4, 0.96],
  [15.6, 12.2, 1.14],
  [18, 7, 0.92],
  [17.3, -2.4, 1.02],
  [15.2, -11.2, 1.08],
  [7.6, -14.8, 0.9],
  [0.4, -15.8, 1.08],
  [-7.2, -15.1, 0.92],
  [-13.5, -12.6, 1.02],
  [-5.8, -2.1, 0.78],
  [3.9, 11.8, 0.74],
  [6, -8.8, 0.74],
] as const;

const bushes = [
  [-5.8, -4.1, 0.74],
  [-7.3, -5.4, 0.68],
  [-12.8, -4.3, 0.76],
  [-8.8, -9.7, 0.66],
  [4.4, -2.2, 0.7],
  [7.2, -4, 0.62],
  [13.6, -8.8, 0.7],
  [-1.3, 7.5, 0.68],
  [-7.2, 8.9, 0.72],
  [3.5, 7.2, 0.64],
  [9.8, 7, 0.74],
  [10.2, 11.4, 0.66],
  [12, 1.1, 0.7],
  [16.5, 4.8, 0.64],
] as const;

const rocks = [
  [-14.6, -1.1, 0.62],
  [-8.1, -11.3, 0.48],
  [4.1, -12.4, 0.56],
  [14.6, -4.5, 0.52],
  [12.7, 8.4, 0.6],
  [2.6, 13.7, 0.44],
  [-9.4, 9.7, 0.56],
  [-16.2, 10.8, 0.66],
  [-17.2, 14.2, 0.58],
] as const;

const lamps = [
  [-2.6, -1.2],
  [3.1, -1],
  [-5.9, -3.5],
  [6.6, -3.1],
  [-2.5, 4],
  [3.8, 4.7],
  [-7.4, 7.6],
  [8.9, 4.1],
  [11.8, 2],
  [-10.2, 10.3],
] as const;

const signposts = [
  [-4.4, -1.8, -0.24],
  [3.4, 2.5, 0.32],
  [9.5, 0.8, -0.42],
  [-7.7, 8.8, 0.38],
] as const;

const fences = [
  [-14.4, -9.9, 0],
  [-13.1, -9.9, 0],
  [-9.8, -10.1, 0],
  [-8.5, -10.1, 0],
  [4.3, 10.8, 0.05],
  [5.6, 11, 0.05],
  [10.7, 11.1, -0.05],
  [12, 10.8, -0.05],
] as const;

const crates = [
  [-7.7, 5.7, 0.22],
  [-6.8, 5.9, -0.18],
  [9.6, -7.7, 0.12],
  [10.4, -7.9, -0.28],
] as const;

const flowers = [
  [-2.9, 2.6, "#ff9ebf"],
  [2.8, 2.6, "#ffe489"],
  [-2.9, -0.58, "#a58cff"],
  [2.84, -0.58, "#ff9ebf"],
  [5.4, 8.6, "#ffe489"],
  [9.95, 9, "#ff9ebf"],
] as const;

function Tree({ position, scale, isNight }: { position: readonly [number, number, number]; scale: number; isNight: boolean }) {
  return (
    <group position={[position[0], 0, position[1]]} scale={scale}>
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.28, 2.2, 7]} />
        <meshStandardMaterial color="#725039" roughness={0.96} />
      </mesh>
      <mesh position={[0, 2.65, 0]} castShadow>
        <dodecahedronGeometry args={[1.02, 0]} />
        <meshStandardMaterial color={isNight ? "#24574b" : "#69a86f"} roughness={0.9} />
      </mesh>
      <mesh position={[0.4, 3.18, -0.18]} castShadow>
        <dodecahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial color={isNight ? "#2a6658" : "#7fbb79"} roughness={0.9} />
      </mesh>
      <mesh position={[-0.45, 3.08, 0.08]} castShadow>
        <dodecahedronGeometry args={[0.72, 0]} />
        <meshStandardMaterial color={isNight ? "#1d4d45" : "#5b9968"} roughness={0.9} />
      </mesh>
    </group>
  );
}

function Bush({ position, scale, isNight }: { position: readonly [number, number, number]; scale: number; isNight: boolean }) {
  return (
    <group position={[position[0], 0.34, position[1]]} scale={scale}>
      {[-0.46, 0, 0.46].map((x, index) => (
        <mesh key={x} position={[x, index === 1 ? 0.2 : 0, index === 1 ? -0.12 : 0]} castShadow>
          <dodecahedronGeometry args={[0.62, 0]} />
          <meshStandardMaterial color={isNight ? "#28584a" : index === 1 ? "#72af72" : "#609867"} roughness={0.94} />
        </mesh>
      ))}
    </group>
  );
}

function Rock({ position, scale, isNight }: { position: readonly [number, number, number]; scale: number; isNight: boolean }) {
  return (
    <mesh position={[position[0], scale * 0.38, position[1]]} scale={[scale, scale * 0.68, scale * 0.82]} rotation={[0.08, position[0] * 0.12, -0.04]} castShadow>
      <dodecahedronGeometry args={[0.72, 0]} />
      <meshStandardMaterial color={isNight ? "#435265" : "#899a94"} roughness={0.96} />
    </mesh>
  );
}

function Lamp({ position, theme, isNight }: { position: readonly [number, number]; theme: WorldTheme; isNight: boolean }) {
  return (
    <group position={[position[0], 0, position[1]]}>
      <mesh position={[0, 1.05, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.11, 2.1, 8]} />
        <meshStandardMaterial color={isNight ? "#24364c" : "#718b8c"} metalness={0.6} roughness={0.36} />
      </mesh>
      <mesh position={[0, 2.2, 0]} castShadow>
        <dodecahedronGeometry args={[0.26, 0]} />
        <meshStandardMaterial color={theme.lampColor} emissive={theme.lampColor} emissiveIntensity={isNight ? 2.8 : 0.08} />
      </mesh>
      <mesh position={[0, 1.92, 0]}>
        <coneGeometry args={[0.4, 0.55, 6]} />
        <meshStandardMaterial color={isNight ? "#30445a" : "#5f8186"} metalness={0.42} roughness={0.58} />
      </mesh>
      {isNight && <pointLight position={[0, 2.08, 0]} color={theme.lampColor} intensity={theme.lampIntensity} distance={5.1} />}
    </group>
  );
}

function Signpost({ position }: { position: readonly [number, number, number] }) {
  return (
    <group position={[position[0], 0, position[1]]} rotation={[0, position[2], 0]}>
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.07, 0.09, 1.8, 6]} />
        <meshStandardMaterial color="#725039" roughness={0.94} />
      </mesh>
      <mesh position={[0.38, 1.42, 0]}>
        <boxGeometry args={[0.88, 0.28, 0.1]} />
        <meshStandardMaterial color="#a8784c" roughness={0.94} />
      </mesh>
      <mesh position={[-0.32, 1.02, 0]}>
        <boxGeometry args={[0.78, 0.26, 0.1]} />
        <meshStandardMaterial color="#8d6547" roughness={0.94} />
      </mesh>
    </group>
  );
}

function Fence({ position }: { position: readonly [number, number, number] }) {
  return (
    <group position={[position[0], 0, position[1]]} rotation={[0, position[2], 0]}>
      {[-0.58, 0.58].map((x) => (
        <mesh key={x} position={[x, 0.52, 0]}>
          <boxGeometry args={[0.12, 1.06, 0.12]} />
          <meshStandardMaterial color="#8a6748" roughness={0.96} />
        </mesh>
      ))}
      {[0.34, 0.72].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <boxGeometry args={[1.35, 0.1, 0.11]} />
          <meshStandardMaterial color="#9f7852" roughness={0.96} />
        </mesh>
      ))}
    </group>
  );
}

function Crate({ position }: { position: readonly [number, number, number] }) {
  return (
    <group position={[position[0], 0.38, position[1]]} rotation={[0, position[2], 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.7, 0.7, 0.7]} />
        <meshStandardMaterial color="#a5754c" roughness={0.94} />
      </mesh>
      <mesh>
        <boxGeometry args={[0.78, 0.1, 0.78]} />
        <meshStandardMaterial color="#765139" roughness={0.96} />
      </mesh>
    </group>
  );
}

function Barrel({ position }: { position: readonly [number, number] }) {
  return (
    <mesh position={[position[0], 0.44, position[1]]} castShadow>
      <cylinderGeometry args={[0.36, 0.4, 0.86, 10]} />
      <meshStandardMaterial color="#8b6244" roughness={0.94} />
    </mesh>
  );
}

function FlowerBed({ position, color }: { position: readonly [number, number]; color: string }) {
  return (
    <group position={[position[0], 0.16, position[1]]}>
      <mesh>
        <cylinderGeometry args={[0.72, 0.8, 0.24, 10]} />
        <meshStandardMaterial color="#967657" roughness={0.96} />
      </mesh>
      {[-0.38, 0, 0.38].map((x, index) => (
        <mesh key={x} position={[x, 0.36, index % 2 ? -0.16 : 0.14]}>
          <sphereGeometry args={[0.18, 8, 8]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.08} />
        </mesh>
      ))}
    </group>
  );
}

function AmbientHouse({
  position,
  theme,
  isNight,
  roof,
}: {
  position: readonly [number, number, number];
  theme: WorldTheme;
  isNight: boolean;
  roof: string;
}) {
  return (
    <group position={[position[0], 0, position[1]]} rotation={[0, position[2], 0]} scale={[0.72, 0.72, 0.72]}>
      <mesh position={[0, 1.05, 0]} castShadow>
        <boxGeometry args={[3, 2.1, 2.4]} />
        <meshStandardMaterial color={theme.buildingColor} roughness={0.84} />
      </mesh>
      <mesh position={[0, 2.54, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[2.16, 1.34, 4]} />
        <meshStandardMaterial color={roof} roughness={0.86} />
      </mesh>
      <mesh position={[0, 0.76, 1.24]}>
        <boxGeometry args={[0.68, 1.46, 0.08]} />
        <meshStandardMaterial color="#725049" roughness={0.92} />
      </mesh>
      {[-0.92, 0.92].map((x) => (
        <mesh key={x} position={[x, 1.24, 1.25]}>
          <boxGeometry args={[0.46, 0.58, 0.07]} />
          <meshStandardMaterial color="#ffd889" emissive="#ffd889" emissiveIntensity={isNight ? 1.3 : 0.08} />
        </mesh>
      ))}
    </group>
  );
}

export function TownEnvironment({ theme, isNight }: EnvironmentProps) {
  return (
    <>
      {trees.map((position) => <Tree key={`${position[0]}-${position[1]}`} position={position} scale={position[2]} isNight={isNight} />)}
      {bushes.map((position) => <Bush key={`${position[0]}-${position[1]}`} position={position} scale={position[2]} isNight={isNight} />)}
      {rocks.map((position) => <Rock key={`${position[0]}-${position[1]}`} position={position} scale={position[2]} isNight={isNight} />)}
      {lamps.map((position) => <Lamp key={`${position[0]}-${position[1]}`} position={position} theme={theme} isNight={isNight} />)}
      {signposts.map((position) => <Signpost key={`${position[0]}-${position[1]}`} position={position} />)}
      {fences.map((position) => <Fence key={`${position[0]}-${position[1]}`} position={position} />)}
      {crates.map((position) => <Crate key={`${position[0]}-${position[1]}`} position={position} />)}
      <Barrel position={[-6.2, 5.82]} />
      <Barrel position={[10.95, -8.08]} />
      {flowers.map(([x, z, color]) => <FlowerBed key={`${x}-${z}`} position={[x, z]} color={color} />)}
      <AmbientHouse position={[-15.2, 1.5, -0.22]} theme={theme} isNight={isNight} roof="#7e6b91" />
      <AmbientHouse position={[2.6, -10.4, 0.18]} theme={theme} isNight={isNight} roof="#6a8792" />
      <AmbientHouse position={[13.4, 10.4, -0.42]} theme={theme} isNight={isNight} roof="#9a7271" />
    </>
  );
}
