import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const root = new URL("..", import.meta.url).pathname;

const materials = {
  navy: ["#173653", "#072536"],
  white: ["#e8f3ef", "#000000"],
  cyan: ["#4de8ff", "#2ad4e8"],
  violet: ["#7256a8", "#311b59"],
  fog: ["#8f8cff", "#51498b"],
  metal: ["#7894a0", "#172b35"],
  gold: ["#f6c56b", "#6e481b"],
  dark: ["#132239", "#050b16"],
  blue: ["#35cfff", "#0b6388"],
  mint: ["#5cf2c7", "#1a735d"],
  cream: ["#fff0b1", "#7b6026"],
  deepFog: ["#40538d", "#242855"],
};

function hex(value) {
  const clean = value.slice(1);
  return [0, 2, 4].map((offset) => Number.parseInt(clean.slice(offset, offset + 2), 16) / 255);
}

const cubePositions = [
  -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5,
  0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5,
  -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5,
  -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5,
  0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5,
  -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5,
];
const cubeNormals = [
  0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
  0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
  0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
  0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
  1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
  -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
];
const cubeIndices = [
  0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11,
  12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23,
];

const part = (name, material, translation, scale, rotation) => ({ name, material, translation, scale, rotation });

const assets = {
  "public/models/player/vincent-hero.glb": [
    part("Torso", "white", [0, 1.05, 0], [0.74, 0.88, 0.48]),
    part("Armor", "navy", [0, 1.17, 0.27], [0.82, 0.58, 0.13]),
    part("Badge", "cyan", [0, 1.2, 0.35], [0.18, 0.18, 0.08]),
    part("Head", "white", [0, 1.85, 0], [0.88, 0.78, 0.72]),
    part("Helmet", "navy", [0, 2.15, -0.03], [0.96, 0.22, 0.78]),
    part("Visor", "cyan", [0, 1.88, 0.4], [0.76, 0.16, 0.07]),
    part("LeftArm", "navy", [-0.56, 1.18, 0], [0.22, 0.72, 0.28]),
    part("RightArm", "navy", [0.56, 1.18, 0], [0.22, 0.72, 0.28]),
    part("LeftLeg", "dark", [-0.24, 0.46, 0], [0.28, 0.78, 0.34]),
    part("RightLeg", "dark", [0.24, 0.46, 0], [0.28, 0.78, 0.34]),
    part("Cape", "violet", [0, 1.15, -0.38], [0.86, 1.18, 0.11], [-0.2, 0, 0]),
    part("Backpack", "blue", [0, 1.26, -0.44], [0.58, 0.66, 0.24]),
    part("SwordBlade", "cyan", [-0.58, 1.32, -0.55], [0.12, 1.55, 0.12], [0, 0, -0.48]),
    part("SwordHilt", "gold", [-0.22, 0.72, -0.55], [0.5, 0.12, 0.16], [0, 0, -0.48]),
    part("Terminal", "cyan", [0.72, 0.95, 0.22], [0.42, 0.08, 0.32], [-0.35, 0, 0]),
  ],
  "public/models/npc/data-sage.glb": [
    part("Robe", "blue", [0, 0.92, 0], [0.94, 1.4, 0.78]),
    part("Head", "white", [0, 1.92, 0], [0.8, 0.68, 0.68]),
    part("Hood", "navy", [0, 2.14, -0.06], [0.9, 0.28, 0.78]),
    part("Eyes", "cyan", [0, 1.95, 0.38], [0.56, 0.11, 0.06]),
    part("LeftArm", "blue", [-0.56, 1.15, 0], [0.22, 0.7, 0.24]),
    part("RightArm", "blue", [0.56, 1.15, 0], [0.22, 0.7, 0.24]),
    part("Staff", "metal", [0.78, 1.08, 0], [0.12, 1.82, 0.12]),
    part("Orb", "cyan", [0.78, 2.16, 0], [0.42, 0.42, 0.42]),
  ],
  "public/models/npc/robotics-scout.glb": [
    part("Torso", "white", [0, 0.98, 0], [0.92, 0.86, 0.72]),
    part("Head", "metal", [0, 1.75, 0], [0.96, 0.62, 0.7]),
    part("Visor", "mint", [0, 1.78, 0.39], [0.72, 0.13, 0.06]),
    part("LeftArm", "metal", [-0.62, 1.02, 0], [0.24, 0.66, 0.25]),
    part("RightArm", "metal", [0.62, 1.02, 0], [0.24, 0.66, 0.25]),
    part("LeftLeg", "navy", [-0.27, 0.38, 0], [0.26, 0.62, 0.3]),
    part("RightLeg", "navy", [0.27, 0.38, 0], [0.26, 0.62, 0.3]),
    part("Antenna", "metal", [0, 2.25, 0], [0.1, 0.62, 0.1]),
    part("Beacon", "mint", [0, 2.62, 0], [0.3, 0.3, 0.3]),
  ],
  "public/models/boss/career-fog-dragon.glb": [
    part("Core", "fog", [0, 1.88, 0], [1.42, 1.22, 1.28]),
    part("Neck", "deepFog", [0, 2.3, 0.92], [0.88, 0.86, 1.12]),
    part("Head", "fog", [0, 2.76, 1.62], [1.18, 0.86, 1.16]),
    part("Snout", "deepFog", [0, 2.6, 2.34], [0.86, 0.46, 0.82]),
    part("LeftHorn", "cream", [-0.62, 3.34, 1.54], [0.22, 0.92, 0.24], [0, 0, 0.46]),
    part("RightHorn", "cream", [0.62, 3.34, 1.54], [0.22, 0.92, 0.24], [0, 0, -0.46]),
    part("LeftWing", "violet", [-1.56, 2.02, -0.18], [1.54, 0.24, 1.82], [0, 0.3, -0.34]),
    part("RightWing", "violet", [1.56, 2.02, -0.18], [1.54, 0.24, 1.82], [0, -0.3, 0.34]),
    part("TailOne", "deepFog", [0, 1.52, -1.2], [0.82, 0.78, 1.32]),
    part("TailTwo", "fog", [0, 1.34, -2.3], [0.56, 0.56, 1.18]),
    part("LeftEye", "cyan", [-0.28, 2.9, 2.22], [0.16, 0.16, 0.1]),
    part("RightEye", "cyan", [0.28, 2.9, 2.22], [0.16, 0.16, 0.1]),
  ],
};

function writeGlb(parts) {
  const positionBytes = Buffer.from(new Float32Array(cubePositions).buffer);
  const normalBytes = Buffer.from(new Float32Array(cubeNormals).buffer);
  const indexBytes = Buffer.from(new Uint16Array(cubeIndices).buffer);
  const binary = Buffer.concat([positionBytes, normalBytes, indexBytes]);
  const usedMaterials = [...new Set(parts.map((item) => item.material))];
  const materialIndex = new Map(usedMaterials.map((name, index) => [name, index]));

  const json = {
    asset: { version: "2.0", generator: "Vincent AI Frontier original GLB generator" },
    scene: 0,
    scenes: [{ nodes: parts.map((_, index) => index) }],
    nodes: parts.map((item, index) => ({
      name: item.name,
      mesh: usedMaterials.indexOf(item.material),
      translation: item.translation,
      scale: item.scale,
      ...(item.rotation ? { rotation: eulerToQuaternion(item.rotation) } : {}),
    })),
    meshes: usedMaterials.map((name) => ({
      name: `${name}-cube`,
      primitives: [{ attributes: { POSITION: 0, NORMAL: 1 }, indices: 2, material: materialIndex.get(name) }],
    })),
    materials: usedMaterials.map((name) => {
      const [base, emissive] = materials[name];
      return {
        name,
        pbrMetallicRoughness: { baseColorFactor: [...hex(base), 1], metallicFactor: name === "metal" ? 0.55 : 0.08, roughnessFactor: 0.72 },
        emissiveFactor: hex(emissive),
      };
    }),
    buffers: [{ byteLength: binary.length }],
    bufferViews: [
      { buffer: 0, byteOffset: 0, byteLength: positionBytes.length, target: 34962 },
      { buffer: 0, byteOffset: positionBytes.length, byteLength: normalBytes.length, target: 34962 },
      { buffer: 0, byteOffset: positionBytes.length + normalBytes.length, byteLength: indexBytes.length, target: 34963 },
    ],
    accessors: [
      { bufferView: 0, componentType: 5126, count: 24, type: "VEC3", min: [-0.5, -0.5, -0.5], max: [0.5, 0.5, 0.5] },
      { bufferView: 1, componentType: 5126, count: 24, type: "VEC3" },
      { bufferView: 2, componentType: 5123, count: 36, type: "SCALAR" },
    ],
  };
  const jsonBytes = Buffer.from(JSON.stringify(json));
  const jsonPadding = Buffer.alloc((4 - (jsonBytes.length % 4)) % 4, 0x20);
  const binPadding = Buffer.alloc((4 - (binary.length % 4)) % 4);
  const jsonChunk = Buffer.concat([jsonBytes, jsonPadding]);
  const binChunk = Buffer.concat([binary, binPadding]);
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(12 + 8 + jsonChunk.length + 8 + binChunk.length, 8);
  const jsonHeader = Buffer.alloc(8);
  jsonHeader.writeUInt32LE(jsonChunk.length, 0);
  jsonHeader.writeUInt32LE(0x4e4f534a, 4);
  const binHeader = Buffer.alloc(8);
  binHeader.writeUInt32LE(binChunk.length, 0);
  binHeader.writeUInt32LE(0x004e4942, 4);
  return Buffer.concat([header, jsonHeader, jsonChunk, binHeader, binChunk]);
}

function eulerToQuaternion([x, y, z]) {
  const c1 = Math.cos(x / 2);
  const c2 = Math.cos(y / 2);
  const c3 = Math.cos(z / 2);
  const s1 = Math.sin(x / 2);
  const s2 = Math.sin(y / 2);
  const s3 = Math.sin(z / 2);
  return [s1 * c2 * c3 + c1 * s2 * s3, c1 * s2 * c3 - s1 * c2 * s3, c1 * c2 * s3 + s1 * s2 * c3, c1 * c2 * c3 - s1 * s2 * s3];
}

for (const [relativePath, parts] of Object.entries(assets)) {
  const output = join(root, relativePath);
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, writeGlb(parts));
  console.log(`generated ${relativePath}`);
}
