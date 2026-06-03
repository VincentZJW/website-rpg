"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { bgmTracks, getBgmTrack, type BgmTrackId } from "@/lib/bgm-config";

export type BgmPlaybackMode = "silent" | "file" | "fallback";
export type BgmSelectionMode = "auto" | "manual";

export type BgmRuntime = {
  pause: () => void;
  resume: () => void;
  setMuted: (isMuted: boolean) => void;
  setVolume: (volume: number) => void;
  start: () => void;
  switchTrack: (trackId: BgmTrackId) => void;
};

type BgmState = {
  isMuted: boolean;
  isIntroPlaying: boolean;
  isPlaying: boolean;
  isStarted: boolean;
  playbackMode: BgmPlaybackMode;
  manualTrackId: BgmTrackId | null;
  selectionMode: BgmSelectionMode;
  selectedTrackId: BgmTrackId;
  volume: number;
  pause: () => void;
  finishIntro: () => void;
  playOpeningMusic: () => void;
  prepareIntro: () => void;
  registerRuntime: (runtime: BgmRuntime | null) => void;
  resume: () => void;
  selectTrack: (trackId: BgmTrackId) => void;
  selectSceneTrack: (trackId: BgmTrackId) => void;
  setMuted: (isMuted: boolean) => void;
  setPlaybackStatus: (isPlaying: boolean, playbackMode: BgmPlaybackMode) => void;
  setSelectionMode: (selectionMode: BgmSelectionMode) => void;
  setVolume: (volume: number) => void;
  start: () => void;
  startIntro: () => void;
  toggleMuted: () => void;
};

let runtime: BgmRuntime | null = null;

function clampVolume(volume: number) {
  return Math.min(1, Math.max(0, volume));
}

export const useBgm = create<BgmState>()(
  persist(
    (set, get) => ({
      isMuted: false,
      isIntroPlaying: false,
      isPlaying: false,
      isStarted: false,
      manualTrackId: null,
      playbackMode: "silent",
      selectionMode: "auto",
      selectedTrackId: bgmTracks.adventurersGuildMorning.id,
      volume: 0.68,
      pause: () => {
        runtime?.pause();
        set({ isPlaying: false });
      },
      finishIntro: () => {
        const { isIntroPlaying, manualTrackId, selectionMode } = get();
        if (!isIntroPlaying) return;
        set({ isIntroPlaying: false });
        if (selectionMode === "manual" && manualTrackId) {
          set({ selectedTrackId: manualTrackId });
          runtime?.switchTrack(manualTrackId);
        }
      },
      playOpeningMusic: () => {
        set({
          isStarted: true,
          selectedTrackId: bgmTracks.spawnObeliskAwakening.id,
        });
        if (!get().isMuted) runtime?.start();
      },
      prepareIntro: () => {
        if (get().isStarted) return;
        set({ selectedTrackId: bgmTracks.spawnObeliskAwakening.id });
      },
      registerRuntime: (nextRuntime) => {
        runtime = nextRuntime;
      },
      resume: () => {
        if (get().isMuted) return;
        runtime?.resume();
      },
      selectTrack: (selectedTrackId) => {
        if (get().selectedTrackId === selectedTrackId && get().selectionMode === "manual") return;
        set({ isIntroPlaying: false, manualTrackId: selectedTrackId, selectedTrackId, selectionMode: "manual" });
        runtime?.switchTrack(selectedTrackId);
      },
      selectSceneTrack: (selectedTrackId) => {
        if (get().isIntroPlaying || get().selectionMode !== "auto" || get().selectedTrackId === selectedTrackId) return;
        set({ selectedTrackId });
        runtime?.switchTrack(selectedTrackId);
      },
      setMuted: (isMuted) => {
        set({ isMuted });
        runtime?.setMuted(isMuted);
      },
      setPlaybackStatus: (isPlaying, playbackMode) => set({ isPlaying, playbackMode }),
      setSelectionMode: (selectionMode) => set({ selectionMode }),
      setVolume: (volume) => {
        const nextVolume = clampVolume(volume);
        set({ volume: nextVolume });
        runtime?.setVolume(nextVolume);
      },
      start: () => {
        set({ isStarted: true });
        if (!get().isMuted) runtime?.start();
      },
      startIntro: () => {
        set({
          isIntroPlaying: true,
          isStarted: true,
          selectedTrackId: bgmTracks.spawnObeliskAwakening.id,
        });
        if (!get().isMuted) runtime?.start();
      },
      toggleMuted: () => {
        get().setMuted(!get().isMuted);
      },
    }),
    {
      name: "vincent-ai-frontier-bgm",
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<BgmState>;
        const selectedTrackId = getBgmTrack(persisted.selectedTrackId ?? currentState.selectedTrackId).id as BgmTrackId;
        const manualTrackId = persisted.manualTrackId
          ? (getBgmTrack(persisted.manualTrackId).id as BgmTrackId)
          : persisted.selectionMode === "manual"
            ? selectedTrackId
            : null;
        return { ...currentState, ...persisted, manualTrackId, selectedTrackId };
      },
      partialize: (state) => ({
        isMuted: state.isMuted,
        manualTrackId: state.manualTrackId,
        selectionMode: state.selectionMode,
        selectedTrackId: state.selectedTrackId,
        volume: state.volume,
      }),
    },
  ),
);
