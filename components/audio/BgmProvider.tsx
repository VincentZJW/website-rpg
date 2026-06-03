"use client";

import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { bgmConfig, getBgmTrack, getSceneBgmTrack, type BgmTrack, type BgmTrackId, type WebAudioFallback } from "@/lib/bgm-config";
import { withBasePath } from "@/lib/asset-path";
import { useBgm, type BgmRuntime } from "@/hooks/useBgm";
import { useGameStore } from "@/hooks/useGameStore";
import { useTimeTheme } from "@/hooks/useTimeTheme";

type ActiveAudio = {
  element: HTMLAudioElement;
  kind: "file";
  stop: () => void;
};

type ActiveFallback = {
  gain: GainNode;
  kind: "fallback";
  stop: () => void;
};

type ActivePlayback = ActiveAudio | ActiveFallback;

type VoiceOptions = {
  duration: number;
  frequency: number;
  gain: number;
  type: OscillatorType;
  when: number;
};

const BOSS_ID = "career-fog-dragon";
const ROBOTICS_SCOUT_ID = "robotics-scout";

function createVoice(context: AudioContext, destination: AudioNode, options: VoiceOptions) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const attackEnd = options.when + Math.min(0.08, options.duration * 0.24);
  const releaseStart = options.when + options.duration * 0.72;
  oscillator.type = options.type;
  oscillator.frequency.setValueAtTime(options.frequency, options.when);
  gain.gain.setValueAtTime(0.0001, options.when);
  gain.gain.exponentialRampToValueAtTime(options.gain, attackEnd);
  gain.gain.exponentialRampToValueAtTime(Math.max(options.gain * 0.68, 0.0001), releaseStart);
  gain.gain.exponentialRampToValueAtTime(0.0001, options.when + options.duration);
  oscillator.connect(gain);
  gain.connect(destination);
  oscillator.start(options.when);
  oscillator.stop(options.when + options.duration + 0.04);
}

function midiToFrequency(note: number) {
  return 440 * 2 ** ((note - 69) / 12);
}

function getFallbackScore(fallback: WebAudioFallback) {
  if (fallback === "web-audio-night") {
    return {
      chords: [[57, 60, 64], [53, 57, 60], [55, 59, 62], [52, 55, 59]],
      melody: [69, null, 72, null, 67, null, 64, null, 65, null, 69, null, 62, null, 64, null],
      tempo: 76,
      type: "sine" as OscillatorType,
    };
  }
  if (fallback === "web-audio-mystery") {
    return {
      chords: [[45, 48, 52], [43, 47, 50], [41, 45, 48], [43, 46, 50]],
      melody: [57, null, 60, 59, null, 55, null, 52, 53, null, 57, null, 50, null, 52, null],
      tempo: 82,
      type: "triangle" as OscillatorType,
    };
  }
  return {
    chords: [[60, 64, 67], [57, 60, 64], [65, 69, 72], [67, 71, 74]],
    melody: [72, 76, 74, 71, 69, 72, 76, 79, 77, 76, 72, 69, 71, 74, 72, 67],
    tempo: 96,
    type: "triangle" as OscillatorType,
  };
}

function createFallbackLoop(context: AudioContext, level: number, fallback: WebAudioFallback): ActiveFallback {
  const score = getFallbackScore(fallback);
  const output = context.createGain();
  const beat = 60 / score.tempo;
  let nextStepTime = context.currentTime + 0.05;
  let step = 0;
  let timer = 0;
  output.gain.setValueAtTime(0.0001, context.currentTime);
  output.gain.exponentialRampToValueAtTime(Math.max(level, 0.0001), context.currentTime + 0.72);
  output.connect(context.destination);

  const schedule = () => {
    while (nextStepTime < context.currentTime + 0.32) {
      const chord = score.chords[Math.floor(step / 4) % score.chords.length];
      if (step % 4 === 0) {
        chord.forEach((note) => {
          createVoice(context, output, {
            duration: beat * 2.8,
            frequency: midiToFrequency(note),
            gain: fallback === "web-audio-mystery" ? 0.035 : 0.026,
            type: "sine",
            when: nextStepTime,
          });
        });
      }

      createVoice(context, output, {
        duration: beat * 0.72,
        frequency: midiToFrequency(chord[step % chord.length] + 12),
        gain: fallback === "web-audio-night" ? 0.04 : 0.052,
        type: score.type,
        when: nextStepTime,
      });

      const melodyNote = score.melody[step % score.melody.length];
      if (melodyNote) {
        createVoice(context, output, {
          duration: beat * 0.92,
          frequency: midiToFrequency(melodyNote),
          gain: fallback === "web-audio-mystery" ? 0.035 : 0.046,
          type: fallback === "web-audio-night" ? "sine" : "triangle",
          when: nextStepTime,
        });
      }

      step = (step + 1) % score.melody.length;
      nextStepTime += beat / 2;
    }
  };

  schedule();
  timer = window.setInterval(schedule, 90);

  return {
    gain: output,
    kind: "fallback",
    stop: () => {
      window.clearInterval(timer);
      output.disconnect();
    },
  };
}

class BgmEngine implements BgmRuntime {
  private active: ActivePlayback | null = null;
  private activeTrackId: BgmTrackId | null = null;
  private context: AudioContext | null = null;
  private generation = 0;
  private paused = false;
  private stopping: Promise<void> | null = null;

  start() {
    this.paused = false;
    void this.ensureContext();
    this.switchTrack(useBgm.getState().selectedTrackId);
  }

  pause() {
    this.paused = true;
    this.generation += 1;
    void this.stopActive(bgmConfig.crossfadeMs / 2);
  }

  resume() {
    this.paused = false;
    void this.ensureContext();
    if (!this.active && !useBgm.getState().isMuted) this.switchTrack(useBgm.getState().selectedTrackId);
  }

  setMuted(isMuted: boolean) {
    if (isMuted) {
      this.generation += 1;
      void this.stopActive(bgmConfig.crossfadeMs / 2);
      return;
    }
    if (useBgm.getState().isStarted) this.resume();
  }

  setVolume(volume: number) {
    if (!this.active) return;
    const track = getBgmTrack(useBgm.getState().selectedTrackId);
    this.setActiveLevel(volume * track.volume, 180);
  }

  switchTrack(trackId: BgmTrackId) {
    if (this.paused || useBgm.getState().isMuted || !useBgm.getState().isStarted) return;
    if (this.active && this.activeTrackId === trackId) return;
    const generation = ++this.generation;
    if (!this.active && !this.stopping) {
      void this.startTrack(trackId, generation);
      return;
    }
    void this.transitionTrack(trackId, generation);
  }

  dispose() {
    this.generation += 1;
    void this.stopActive(0);
    void this.context?.close();
    this.context = null;
  }

  private async ensureContext() {
    if (!this.context) this.context = new AudioContext();
    if (this.context.state === "suspended") await this.context.resume();
    return this.context;
  }

  private async transitionTrack(trackId: BgmTrackId, generation: number) {
    await this.stopActive(bgmConfig.crossfadeMs);
    if (generation !== this.generation) return;
    await this.startTrack(trackId, generation);
  }

  private async startTrack(trackId: BgmTrackId, generation: number) {
    const track = getBgmTrack(trackId);
    try {
      const audio = new Audio(withBasePath(track.src));
      audio.loop = track.loop;
      audio.preload = "auto";
      audio.volume = 0;
      audio.addEventListener(
        "error",
        () => {
          if (generation !== this.generation || this.active?.kind !== "file" || this.active.element !== audio) return;
          this.active.stop();
          this.active = null;
          void this.startFallback(track, generation);
        },
        { once: true },
      );
      await audio.play();
      if (generation !== this.generation) {
        audio.pause();
        return;
      }
      this.active = {
        element: audio,
        kind: "file",
        stop: () => {
          audio.pause();
          audio.removeAttribute("src");
          audio.load();
        },
      };
      this.activeTrackId = trackId;
      this.setActiveLevel(this.getTrackLevel(track), 720);
      useBgm.getState().setPlaybackStatus(true, "file");
    } catch {
      await this.startFallback(track, generation);
    }
  }

  private async startFallback(track: BgmTrack, generation: number) {
    if (generation !== this.generation || this.paused || useBgm.getState().isMuted) return;
    const context = await this.ensureContext();
    if (generation !== this.generation) return;
    this.active = createFallbackLoop(context, this.getTrackLevel(track), track.fallback);
    this.activeTrackId = track.id as BgmTrackId;
    useBgm.getState().setPlaybackStatus(true, "fallback");
  }

  private getTrackLevel(track: BgmTrack) {
    return useBgm.getState().volume * track.volume;
  }

  private setActiveLevel(level: number, durationMs: number) {
    if (!this.active) return;
    if (this.active.kind === "file") {
      const audio = this.active.element;
      const from = audio.volume;
      const startedAt = performance.now();
      const update = () => {
        if (this.active?.kind !== "file" || this.active.element !== audio) return;
        const progress = Math.min(1, (performance.now() - startedAt) / Math.max(durationMs, 1));
        audio.volume = from + (level - from) * progress;
        if (progress < 1) window.requestAnimationFrame(update);
      };
      update();
      return;
    }
    const context = this.context;
    if (!context) return;
    this.active.gain.gain.cancelScheduledValues(context.currentTime);
    this.active.gain.gain.setTargetAtTime(Math.max(level, 0.0001), context.currentTime, Math.max(durationMs / 3_000, 0.01));
  }

  private async stopActive(durationMs: number) {
    if (this.stopping) return this.stopping;
    const active = this.active;
    if (!active) {
      useBgm.getState().setPlaybackStatus(false, "silent");
      return;
    }
    this.active = null;
    this.activeTrackId = null;
    this.stopping = (async () => {
      if (active.kind === "file") {
        const from = active.element.volume;
        const steps = durationMs ? 10 : 0;
        for (let step = 1; step <= steps; step += 1) {
          active.element.volume = from * (1 - step / steps);
          await new Promise((resolve) => window.setTimeout(resolve, durationMs / steps));
        }
      } else if (this.context) {
        active.gain.gain.cancelScheduledValues(this.context.currentTime);
        active.gain.gain.setTargetAtTime(0.0001, this.context.currentTime, Math.max(durationMs / 3_000, 0.01));
        if (durationMs) await new Promise((resolve) => window.setTimeout(resolve, durationMs));
      }
      active.stop();
      useBgm.getState().setPlaybackStatus(false, "silent");
    })();
    try {
      await this.stopping;
    } finally {
      this.stopping = null;
    }
  }
}

export function BgmProvider({ children }: { children: ReactNode }) {
  const runtime = useRef<BgmEngine | null>(null);
  const finishIntro = useBgm((state) => state.finishIntro);
  const isIntroPlaying = useBgm((state) => state.isIntroPlaying);
  const registerRuntime = useBgm((state) => state.registerRuntime);
  const selectionMode = useBgm((state) => state.selectionMode);
  const selectSceneTrack = useBgm((state) => state.selectSceneTrack);
  const activeObjectId = useGameStore((state) => state.activeObjectId);
  const hasStarted = useGameStore((state) => state.hasStarted);
  const isSpawning = useGameStore((state) => state.isSpawning);
  const playerPosition = useGameStore((state) => state.playerPosition);
  const timeTheme = useTimeTheme((state) => state.resolvedTheme);
  const isBossArea = activeObjectId === BOSS_ID || Math.hypot(playerPosition[0] + 12.1, playerPosition[2] - 11.1) <= bgmConfig.bossRadius;
  const isRoboticsArea =
    activeObjectId === ROBOTICS_SCOUT_ID ||
    Math.hypot(playerPosition[0] - 9.8, playerPosition[2] + 5.4) <= bgmConfig.roboticsRadius;
  const isPlazaArea = Math.hypot(playerPosition[0], playerPosition[2]) <= bgmConfig.plazaRadius;
  const sceneTrack = useMemo(
    () => getSceneBgmTrack(timeTheme, isBossArea, isRoboticsArea, !hasStarted || isSpawning, isPlazaArea),
    [hasStarted, isBossArea, isPlazaArea, isRoboticsArea, isSpawning, timeTheme],
  );

  useEffect(() => {
    const engine = new BgmEngine();
    runtime.current = engine;
    registerRuntime(engine);
    return () => {
      registerRuntime(null);
      engine.dispose();
      runtime.current = null;
    };
  }, [registerRuntime]);

  useEffect(() => {
    selectSceneTrack(sceneTrack.id as BgmTrackId);
  }, [isIntroPlaying, sceneTrack.id, selectSceneTrack, selectionMode]);

  useEffect(() => {
    if (!isIntroPlaying) return;
    const timer = window.setTimeout(finishIntro, bgmConfig.introDurationMs);
    return () => window.clearTimeout(timer);
  }, [finishIntro, isIntroPlaying]);

  return children;
}
