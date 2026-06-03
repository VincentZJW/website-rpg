"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { playerSpawnPosition } from "@/lib/game-data";

function getSpawnPosition(): [number, number, number] {
  return [...playerSpawnPosition];
}

type GameState = {
  activeObjectId: string | null;
  nearbyObjectId: string | null;
  playerPosition: [number, number, number];
  hasStarted: boolean;
  isSpawning: boolean;
  isClassicView: boolean;
  discoveredObjectIds: string[];
  hasDismissedMobileNotice: boolean;
  hasDismissedGuide: boolean;
  setActiveObject: (id: string | null) => void;
  setNearbyObject: (id: string | null) => void;
  setPlayerPosition: (position: [number, number, number]) => void;
  beginSpawn: () => void;
  completeSpawn: () => void;
  setClassicView: (isClassicView: boolean) => void;
  dismissMobileNotice: () => void;
  dismissGuide: () => void;
  resetProgress: () => void;
};

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      activeObjectId: null,
      nearbyObjectId: null,
      playerPosition: getSpawnPosition(),
      hasStarted: false,
      isSpawning: false,
      isClassicView: false,
      discoveredObjectIds: [],
      hasDismissedMobileNotice: false,
      hasDismissedGuide: false,
      setActiveObject: (activeObjectId) =>
        set((state) => ({
          activeObjectId,
          discoveredObjectIds:
            activeObjectId && !state.discoveredObjectIds.includes(activeObjectId)
              ? [...state.discoveredObjectIds, activeObjectId]
              : state.discoveredObjectIds,
        })),
      setNearbyObject: (nearbyObjectId) => set({ nearbyObjectId }),
      setPlayerPosition: (playerPosition) => set({ playerPosition }),
      beginSpawn: () =>
        set({
          activeObjectId: null,
          nearbyObjectId: null,
          playerPosition: getSpawnPosition(),
          isSpawning: true,
        }),
      completeSpawn: () =>
        set({
          activeObjectId: null,
          nearbyObjectId: null,
          playerPosition: getSpawnPosition(),
          hasStarted: true,
          isSpawning: false,
        }),
      setClassicView: (isClassicView) => set({ isClassicView }),
      dismissMobileNotice: () => set({ hasDismissedMobileNotice: true }),
      dismissGuide: () => set({ hasDismissedGuide: true }),
      resetProgress: () => set({ activeObjectId: null, discoveredObjectIds: [] }),
    }),
    {
      name: "vincent-ai-frontier-game",
      partialize: (state) => ({
        discoveredObjectIds: state.discoveredObjectIds,
        hasDismissedMobileNotice: state.hasDismissedMobileNotice,
        hasDismissedGuide: state.hasDismissedGuide,
      }),
    },
  ),
);
