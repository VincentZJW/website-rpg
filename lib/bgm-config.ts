import type { ResolvedTimeTheme } from "@/lib/theme-config";

export type WebAudioFallback = "web-audio-town" | "web-audio-night" | "web-audio-mystery";

export type BgmTrack = {
  id: string;
  labelZh: string;
  labelEn: string;
  moodZh: string;
  moodEn: string;
  src: string;
  fallback: WebAudioFallback;
  loop: boolean;
  volume: number;
  disabledByDefault?: boolean;
  licenseNote?: string;
};

export const bgmTracks = {
  adventurersGuildMorning: {
    id: "adventurers-guild-morning",
    labelZh: "公会晨曲",
    labelEn: "Adventurer’s Guild Morning",
    moodZh: "白天小镇、公会门口、勇者启程",
    moodEn: "Daytime town, guild entrance, beginning of an adventure",
    src: "/audio/bgm/adventurers-guild-morning.wav",
    fallback: "web-audio-town",
    loop: true,
    volume: 0.42,
  },
  willowTownMarket: {
    id: "willow-town-market",
    labelZh: "柳镇集市",
    labelEn: "Willow Town Market",
    moodZh: "中央广场与市集，活泼温暖",
    moodEn: "Central plaza and market, warm and lively",
    src: "/audio/bgm/willow-town-market.wav",
    fallback: "web-audio-town",
    loop: true,
    volume: 0.4,
  },
  moonlitLibraryWaltz: {
    id: "moonlit-library-waltz",
    labelZh: "月下图书馆",
    labelEn: "Moonlit Library Waltz",
    moodZh: "夜晚图书馆，柔和安静",
    moodEn: "Night library, soft and calm",
    src: "/audio/bgm/moonlit-library-waltz.wav",
    fallback: "web-audio-night",
    loop: true,
    volume: 0.36,
  },
  roboticsScoutPath: {
    id: "robotics-scout-path",
    labelZh: "侦察员小径",
    labelEn: "Robotics Scout Path",
    moodZh: "机器人侦察员区域，轻科技冒险",
    moodEn: "Robotics Scout area, light tech adventure",
    src: "/audio/bgm/robotics-scout-path.wav",
    fallback: "web-audio-town",
    loop: true,
    volume: 0.36,
  },
  careerFogGuardian: {
    id: "career-fog-guardian",
    labelZh: "迷雾守望者",
    labelEn: "Career Fog Guardian",
    moodZh: "神秘、有压力但不恐怖，适合 Boss 区域",
    moodEn: "Mysterious and tense but not scary for the boss area",
    src: "/audio/bgm/career-fog-guardian.wav",
    fallback: "web-audio-mystery",
    loop: true,
    volume: 0.35,
  },
  spawnObeliskAwakening: {
    id: "spawn-obelisk-awakening",
    labelZh: "方尖碑苏醒",
    labelEn: "Spawn Obelisk Awakening",
    moodZh: "点击苏醒启动界面，召唤与启程",
    moodEn: "Click-to-spawn start screen, summoning and departure",
    src: "/audio/bgm/spawn-obelisk-awakening.wav",
    fallback: "web-audio-town",
    loop: true,
    volume: 0.4,
  },
  licensedLittlerootTown: {
    id: "licensed-littleroot-town",
    labelZh: "未白镇 BGM（需自行授权文件）",
    labelEn: "Littleroot Town BGM licensed file required",
    moodZh: "仅用于你自行提供并有权使用的文件",
    moodEn: "Only for a file you provide and have the right to use",
    src: "/audio/bgm/user-provided-littleroot-town.mp3",
    fallback: "web-audio-town",
    loop: true,
    volume: 0.4,
    disabledByDefault: true,
    licenseNote: "Only enable this if you provide a legally licensed audio file yourself.",
  },
} as const satisfies Record<string, BgmTrack>;

export type BgmTrackKey = keyof typeof bgmTracks;
export type BgmTrackId = (typeof bgmTracks)[BgmTrackKey]["id"];

export const bgmConfig = {
  bossRadius: 7.2,
  plazaRadius: 5.8,
  roboticsRadius: 6.4,
  crossfadeMs: 800,
  introDurationMs: 4_800,
  // Set this to "licensedLittlerootTown" only after adding your own legally usable file.
  townTrackOverride: null as BgmTrackKey | null,
} as const;

export function getBgmTrack(trackId: BgmTrackId): BgmTrack {
  return Object.values(bgmTracks).find((track) => track.id === trackId) ?? bgmTracks.adventurersGuildMorning;
}

export const selectableBgmTracks: BgmTrack[] = Object.values(bgmTracks).filter(
  (track) => !("disabledByDefault" in track) || !track.disabledByDefault,
);

export function getSceneBgmTrack(
  timeTheme: ResolvedTimeTheme,
  isBossArea: boolean,
  isRoboticsArea: boolean,
  isStartScreen: boolean,
  isPlazaArea: boolean,
): BgmTrack {
  if (isStartScreen) return bgmTracks.spawnObeliskAwakening;
  if (isBossArea) return bgmTracks.careerFogGuardian;
  if (isRoboticsArea) return bgmTracks.roboticsScoutPath;
  if (bgmConfig.townTrackOverride) return bgmTracks[bgmConfig.townTrackOverride];
  if (timeTheme === "night") return bgmTracks.moonlitLibraryWaltz;
  return isPlazaArea ? bgmTracks.willowTownMarket : bgmTracks.adventurersGuildMorning;
}
