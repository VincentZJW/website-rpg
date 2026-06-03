export type ModelKind = "player" | "npc" | "boss" | "portal" | "common";

export type ModelCompression = "none" | "draco" | "meshopt";

export type CharacterAnimationState =
  | "idle"
  | "walk"
  | "interact"
  | "greet"
  | "hover"
  | "pulse"
  | "bossIdle"
  | "bossInteract"
  | "portalInteract";

export type CharacterExpression = "neutral" | "noticed" | "talking" | "completed";

export type CharacterRole = "player" | "npc" | "boss" | "portal";

export type FallbackType =
  | "hero-adventurer"
  | "data-sage-procedural"
  | "robotics-scout-procedural"
  | "guild-master-procedural"
  | "insight-librarian-procedural"
  | "guide-spirit-procedural"
  | "career-fog-dragon-procedural"
  | "portal-procedural"
  | "none";

export type ModelId =
  | "vincent-hero"
  | "data-sage"
  | "robotics-scout"
  | "guild-master"
  | "insight-librarian"
  | "career-fog-dragon"
  | "contact-portal"
  | "guide-spirit"
  | "sword"
  | "shield"
  | "cape"
  | "lamp"
  | "tree"
  | "crate";

export type ModelLicense = {
  source: "original" | "external";
  author: string;
  license: string;
  url: string;
};

export type ModelAsset = {
  id: ModelId;
  type: ModelKind;
  path: string;
  available: boolean;
  fallbackType: FallbackType;
  scale: number;
  positionOffset: [number, number, number];
  rotationOffset: [number, number, number];
  compression: ModelCompression;
  preloadDistance: number;
  animations: Partial<Record<CharacterAnimationState, string>>;
  license: ModelLicense;
};
