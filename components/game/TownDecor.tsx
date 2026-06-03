"use client";

import type { WorldTheme } from "@/lib/theme-config";

type Point = readonly [number, number];

const roadPaths: Array<{ points: Point[]; width: number }> = [
  {
    width: 1.88,
    points: [
      [-13, 12.2],
      [-10.6, 10.1],
      [-8.2, 8.1],
      [-5.1, 5.3],
      [-2.3, 3],
      [0, 1],
      [3.1, -0.9],
      [6.6, -3],
      [9.8, -4.9],
    ],
  },
  {
    width: 1.76,
    points: [
      [-10.1, -5.8],
      [-7.3, -4.2],
      [-4.3, -2.3],
      [-1.5, -0.1],
      [0, 1],
      [2.5, 3.2],
      [4.7, 5.1],
      [6.5, 7.35],
    ],
  },
  {
    width: 1.64,
    points: [
      [0, 1],
      [3.4, 0.65],
      [6.9, 0.56],
      [10.3, 1.3],
      [12.4, 2.3],
      [14.15, 3],
    ],
  },
  {
    width: 1.36,
    points: [
      [-5.1, 5.3],
      [-5.7, 6.6],
      [-4.8, 7.6],
    ],
  },
  {
    width: 1.3,
    points: [
      [6.6, -3],
      [8.2, -5],
      [10.1, -6.3],
    ],
  },
];

function RoadSegment({
  from,
  to,
  width,
  theme,
  isNight,
}: {
  from: Point;
  to: Point;
  width: number;
  theme: WorldTheme;
  isNight: boolean;
}) {
  const x = (from[0] + to[0]) / 2;
  const z = (from[1] + to[1]) / 2;
  const length = Math.hypot(to[0] - from[0], to[1] - from[1]) + 0.32;
  const rotation = -Math.atan2(to[1] - from[1], to[0] - from[0]);

  return (
    <group position={[x, 0.025, z]} rotation={[0, rotation, 0]}>
      <mesh receiveShadow>
        <boxGeometry args={[length, 0.07, width]} />
        <meshStandardMaterial color={theme.pathColor} roughness={0.92} metalness={isNight ? 0.08 : 0.01} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[0, 0.055, (width / 2 - 0.1) * side]}>
          <boxGeometry args={[length, 0.025, 0.08]} />
          <meshBasicMaterial color={theme.accentColor} transparent opacity={isNight ? 0.52 : 0.15} />
        </mesh>
      ))}
    </group>
  );
}

function RoadJunction({ point, theme, isNight }: { point: Point; theme: WorldTheme; isNight: boolean }) {
  return (
    <mesh position={[point[0], 0.028, point[1]]} receiveShadow>
      <cylinderGeometry args={[1.05, 1.1, 0.075, 10]} />
      <meshStandardMaterial color={theme.pathColor} emissive={theme.accentColor} emissiveIntensity={isNight ? 0.04 : 0} roughness={0.92} />
    </mesh>
  );
}

export function TownRoads({ theme, isNight }: { theme: WorldTheme; isNight: boolean }) {
  return (
    <>
      {roadPaths.flatMap((path, pathIndex) =>
        path.points.slice(1).map((point, index) => (
          <RoadSegment
            key={`${pathIndex}-${index}`}
            from={path.points[index]}
            to={point}
            width={path.width}
            theme={theme}
            isNight={isNight}
          />
        )),
      )}
      <RoadJunction point={[0, 1]} theme={theme} isNight={isNight} />
      <RoadJunction point={[-5.1, 5.3]} theme={theme} isNight={isNight} />
      <RoadJunction point={[6.6, -3]} theme={theme} isNight={isNight} />
    </>
  );
}
