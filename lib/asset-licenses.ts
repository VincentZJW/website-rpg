export type AssetLicenseRecord = {
  assetName: string;
  filePath: string;
  sourceUrl: string;
  author: string;
  license: string;
  commercialUseAllowed: boolean;
  modificationAllowed: boolean;
  notes: string;
};

export const assetLicenses: AssetLicenseRecord[] = [
  {
    assetName: "Vincent Hero",
    filePath: "/models/player/vincent-hero.glb",
    sourceUrl: "",
    author: "Vincent Zhou / Project",
    license: "Original project asset",
    commercialUseAllowed: true,
    modificationAllowed: true,
    notes: "Generated locally by scripts/generate-original-glb.mjs.",
  },
  {
    assetName: "Data Sage",
    filePath: "/models/npc/data-sage.glb",
    sourceUrl: "",
    author: "Vincent Zhou / Project",
    license: "Original project asset",
    commercialUseAllowed: true,
    modificationAllowed: true,
    notes: "Generated locally by scripts/generate-original-glb.mjs.",
  },
  {
    assetName: "Robotics Scout",
    filePath: "/models/npc/robotics-scout.glb",
    sourceUrl: "",
    author: "Vincent Zhou / Project",
    license: "Original project asset",
    commercialUseAllowed: true,
    modificationAllowed: true,
    notes: "Generated locally by scripts/generate-original-glb.mjs.",
  },
  {
    assetName: "Career Fog Dragon",
    filePath: "/models/boss/career-fog-dragon.glb",
    sourceUrl: "",
    author: "Vincent Zhou / Project",
    license: "Original project asset",
    commercialUseAllowed: true,
    modificationAllowed: true,
    notes: "Generated locally by scripts/generate-original-glb.mjs.",
  },
  {
    assetName: "Procedural fallback visuals",
    filePath: "components/game/CharacterFallback.tsx",
    sourceUrl: "",
    author: "Vincent Zhou / Project",
    license: "Original project asset",
    commercialUseAllowed: true,
    modificationAllowed: true,
    notes: "Project-native geometry only. No external textures, models, audio, logos, or official game assets are bundled.",
  },
];
