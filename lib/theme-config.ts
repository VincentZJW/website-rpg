export type ResolvedTimeTheme = "day" | "night";
export type TimeThemeMode = "auto" | ResolvedTimeTheme;

export type WorldTheme = {
  skyColor: string;
  fogColor: string;
  groundColor: string;
  pathColor: string;
  buildingColor: string;
  roofColor: string;
  gridColor: string;
  gridSectionColor: string;
  ambientLight: number;
  directionalLight: number;
  pointLight: number;
  lampColor: string;
  lampIntensity: number;
  accentColor: string;
  dialogTheme: "light" | "dark";
};

export const themeConfig = {
  dayStartHour: 6,
  nightStartHour: 18,
  dayTheme: {
    skyColor: "#a9d9f0",
    fogColor: "#c8e4ea",
    groundColor: "#86a899",
    pathColor: "#d8d4bf",
    buildingColor: "#d6e5dc",
    roofColor: "#5d7891",
    gridColor: "#91bfbd",
    gridSectionColor: "#6f9fbd",
    ambientLight: 1.45,
    directionalLight: 2.45,
    pointLight: 5,
    lampColor: "#ffd692",
    lampIntensity: 0.12,
    accentColor: "#178fb1",
    dialogTheme: "light",
  },
  nightTheme: {
    skyColor: "#030611",
    fogColor: "#061126",
    groundColor: "#071323",
    pathColor: "#172b43",
    buildingColor: "#10233a",
    roofColor: "#17204a",
    gridColor: "#154566",
    gridSectionColor: "#7659df",
    ambientLight: 0.58,
    directionalLight: 1.18,
    pointLight: 22,
    lampColor: "#ffd47c",
    lampIntensity: 2.2,
    accentColor: "#4de8ff",
    dialogTheme: "dark",
  },
} satisfies {
  dayStartHour: number;
  nightStartHour: number;
  dayTheme: WorldTheme;
  nightTheme: WorldTheme;
};

export function resolveTimeTheme(hour: number): ResolvedTimeTheme {
  return hour >= themeConfig.dayStartHour && hour < themeConfig.nightStartHour ? "day" : "night";
}

export function getWorldTheme(theme: ResolvedTimeTheme) {
  return theme === "day" ? themeConfig.dayTheme : themeConfig.nightTheme;
}
