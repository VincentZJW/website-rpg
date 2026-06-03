#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SAMPLE_RATE = 44_100;
const CHANNELS = 1;
const BIT_DEPTH = 16;
const STEPS_PER_BEAT = 4;
const OUTPUT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "../public/audio/bgm");
const TWO_PI = Math.PI * 2;

const tracks = {
  "dawn-plaza-journey": {
    bpm: 108,
    bars: 16,
    description: "Warm, bright central-plaza adventure loop",
    progression: [
      [60, 64, 67],
      [57, 60, 64],
      [65, 69, 72],
      [55, 59, 62],
      [60, 64, 67],
      [64, 67, 71],
      [65, 69, 72],
      [55, 59, 62],
    ],
    bass: [36, 33, 41, 31, 36, 40, 41, 31],
    melody: [
      72, null, 76, 74, 71, null, 69, 71, 72, 76, null, 79, 76, null, 74, null,
      69, null, 72, 76, 74, 72, null, 69, 71, null, 74, 72, 67, null, 69, null,
      72, null, 76, 79, 81, null, 79, 76, 74, null, 72, 71, 69, 71, null, 74,
      76, null, 74, 72, 69, null, 71, 72, 74, 71, null, 67, 69, null, 71, null,
    ],
    arp: [0, 1, 2, 1, 0, 2, 1, 2],
    leadWave: "triangle",
    arpWave: "square",
    bassWave: "triangle",
    leadVolume: 0.09,
    arpVolume: 0.038,
    bassVolume: 0.105,
    padVolume: 0.026,
    drumStyle: "town",
  },
  "starlit-town-memory": {
    bpm: 80,
    bars: 12,
    description: "Gentle, dreamy starlit nighttime town loop",
    progression: [
      [57, 60, 64],
      [53, 57, 60],
      [55, 59, 62],
      [52, 55, 59],
      [57, 60, 64],
      [55, 59, 62],
    ],
    bass: [33, 29, 31, 28, 33, 31],
    melody: [
      69, null, null, 72, null, 67, null, null, 64, null, 65, null, 69, null, null, 67,
      62, null, null, 64, null, 67, null, null, 69, null, 67, null, 64, null, null, null,
      72, null, null, 69, null, 67, null, null, 64, null, 62, null, 64, null, null, 67,
      69, null, null, 67, null, 64, null, null, 62, null, 64, null, 60, null, null, null,
    ],
    arp: [0, 2, 1, 2, 0, 1, 2, 1],
    leadWave: "triangle",
    arpWave: "triangle",
    bassWave: "sine",
    leadVolume: 0.072,
    arpVolume: 0.025,
    bassVolume: 0.078,
    padVolume: 0.032,
    drumStyle: "night",
  },
  "robotic-workshop-waltz": {
    bpm: 112,
    bars: 16,
    description: "Playful light-tech workshop loop with plucked synth motion",
    progression: [
      [60, 64, 67],
      [62, 65, 69],
      [59, 62, 67],
      [57, 60, 64],
      [60, 64, 67],
      [64, 67, 71],
      [62, 65, 69],
      [55, 59, 62],
    ],
    bass: [36, 38, 35, 33, 36, 40, 38, 31],
    melody: [
      72, null, 76, null, 79, 76, null, 74, 72, null, 69, null, 71, 74, null, 76,
      74, null, 77, null, 81, 77, null, 76, 74, null, 71, null, 72, 76, null, 74,
      71, null, 74, null, 79, 74, null, 71, 69, null, 72, null, 76, 72, null, 69,
      72, null, 76, null, 79, 81, null, 79, 76, null, 74, null, 71, 74, null, 72,
    ],
    arp: [0, 2, 1, 2, 1, 0, 2, 1],
    leadWave: "pulse",
    arpWave: "square",
    bassWave: "triangle",
    leadVolume: 0.066,
    arpVolume: 0.04,
    bassVolume: 0.082,
    padVolume: 0.023,
    drumStyle: "workshop",
  },
  "awakening-obelisk": {
    bpm: 96,
    bars: 14,
    description: "Summoning and awakening loop for the obelisk entrance",
    progression: [
      [48, 55, 60],
      [53, 57, 60],
      [50, 55, 59],
      [55, 59, 62],
      [48, 55, 60],
      [57, 60, 64],
      [55, 59, 62],
    ],
    bass: [36, 41, 38, 43, 36, 45, 43],
    melody: [
      60, null, 67, null, 72, null, 76, null, 74, null, 71, null, 67, null, null, null,
      65, null, 69, null, 72, 76, null, 79, 77, null, 74, null, 72, null, null, null,
      67, null, 72, null, 76, null, 79, 81, null, 79, null, 76, 74, null, 72, null,
      71, null, 74, null, 79, null, 77, null, 74, null, 72, null, 67, null, null, null,
    ],
    arp: [0, 1, 2, 1, 2, 1, 0, 1],
    leadWave: "triangle",
    arpWave: "square",
    bassWave: "sine",
    leadVolume: 0.08,
    arpVolume: 0.046,
    bassVolume: 0.075,
    padVolume: 0.034,
    drumStyle: "summon",
  },
  "career-fog-dragon": {
    bpm: 84,
    bars: 16,
    description: "Low, mysterious and tense fog-dragon area loop",
    progression: [
      [45, 48, 52],
      [43, 47, 50],
      [41, 45, 48],
      [43, 46, 50],
      [45, 48, 52],
      [40, 43, 47],
      [41, 45, 48],
      [43, 46, 50],
    ],
    bass: [33, 31, 29, 31, 33, 28, 29, 31],
    melody: [
      57, null, null, 60, 59, null, 55, null, 52, null, 53, null, 57, null, null, null,
      50, null, 52, null, 55, null, 53, null, 48, null, 50, null, 47, null, null, null,
      57, null, 60, null, 59, null, 55, null, 53, null, 52, null, 48, null, 50, null,
      52, null, null, 55, 53, null, 50, null, 47, null, 48, null, 45, null, null, null,
    ],
    arp: [0, 1, 0, 2, 0, 1, 2, 1],
    leadWave: "triangle",
    arpWave: "square",
    bassWave: "triangle",
    leadVolume: 0.058,
    arpVolume: 0.031,
    bassVolume: 0.125,
    padVolume: 0.038,
    drumStyle: "fog",
  },
};

function midiToFrequency(note) {
  return 440 * 2 ** ((note - 69) / 12);
}

function oscillatorSample(wave, phase) {
  if (wave === "square") return Math.sin(phase) >= 0 ? 1 : -1;
  if (wave === "pulse") return phase % TWO_PI < TWO_PI * 0.28 ? 1 : -1;
  if (wave === "triangle") return (2 / Math.PI) * Math.asin(Math.sin(phase));
  return Math.sin(phase);
}

function mix(buffer, index, sample) {
  if (index >= 0 && index < buffer.length) buffer[index] += sample;
}

function addNote(buffer, { start, duration, midi, volume, wave }) {
  const startSample = Math.floor(start * SAMPLE_RATE);
  const length = Math.floor(duration * SAMPLE_RATE);
  const frequency = midiToFrequency(midi);
  const attack = Math.min(0.025, duration * 0.16);
  const release = Math.min(0.12, duration * 0.38);
  for (let offset = 0; offset < length; offset += 1) {
    const time = offset / SAMPLE_RATE;
    const fadeIn = Math.min(1, time / Math.max(attack, 0.001));
    const fadeOut = Math.min(1, (duration - time) / Math.max(release, 0.001));
    const envelope = Math.max(0, Math.min(fadeIn, fadeOut));
    const phase = TWO_PI * frequency * time;
    mix(buffer, startSample + offset, oscillatorSample(wave, phase) * volume * envelope);
  }
}

function createRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4_294_967_296;
  };
}

function addNoise(buffer, { start, duration, volume, seed, brightness = 0.7 }) {
  const startSample = Math.floor(start * SAMPLE_RATE);
  const length = Math.floor(duration * SAMPLE_RATE);
  const random = createRandom(seed);
  let previous = 0;
  for (let offset = 0; offset < length; offset += 1) {
    const progress = offset / Math.max(length, 1);
    const raw = random() * 2 - 1;
    const highPassed = raw - previous * brightness;
    previous = raw;
    mix(buffer, startSample + offset, highPassed * volume * (1 - progress) ** 2);
  }
}

function addKick(buffer, start, volume) {
  const startSample = Math.floor(start * SAMPLE_RATE);
  const duration = 0.16;
  const length = Math.floor(duration * SAMPLE_RATE);
  let phase = 0;
  for (let offset = 0; offset < length; offset += 1) {
    const progress = offset / length;
    const frequency = 118 - progress * 72;
    phase += (TWO_PI * frequency) / SAMPLE_RATE;
    mix(buffer, startSample + offset, Math.sin(phase) * volume * (1 - progress) ** 2.4);
  }
}

function addDrums(buffer, step, time, style) {
  const sixteenth = step % 16;
  const seed = 91_337 + step * 977;
  if (style === "night") {
    if (sixteenth === 0) addKick(buffer, time, 0.065);
    if (sixteenth === 8) addNoise(buffer, { start: time, duration: 0.07, volume: 0.024, seed });
    return;
  }
  if (style === "summon") {
    if (sixteenth === 0 || sixteenth === 8) addKick(buffer, time, 0.074);
    if (sixteenth % 4 === 2) addNoise(buffer, { start: time, duration: 0.045, volume: 0.018, seed });
    return;
  }
  if (style === "workshop") {
    if (sixteenth === 0 || sixteenth === 6 || sixteenth === 12) addKick(buffer, time, 0.072);
    if (sixteenth === 4 || sixteenth === 10) addNoise(buffer, { start: time, duration: 0.055, volume: 0.028, seed });
    if (sixteenth % 2 === 0) addNoise(buffer, { start: time, duration: 0.026, volume: 0.012, seed: seed + 29 });
    return;
  }
  if (style === "fog") {
    if (sixteenth === 0 || sixteenth === 10) addKick(buffer, time, 0.11);
    if (sixteenth === 4 || sixteenth === 12) addNoise(buffer, { start: time, duration: 0.13, volume: 0.04, seed, brightness: 0.45 });
    return;
  }
  if (sixteenth === 0 || sixteenth === 8) addKick(buffer, time, 0.09);
  if (sixteenth === 4 || sixteenth === 12) addNoise(buffer, { start: time, duration: 0.09, volume: 0.035, seed });
  if (sixteenth % 2 === 0) addNoise(buffer, { start: time, duration: 0.035, volume: 0.014, seed: seed + 17 });
}

function renderTrack(track) {
  const beat = 60 / track.bpm;
  const stepDuration = beat / STEPS_PER_BEAT;
  const totalSteps = track.bars * 4 * STEPS_PER_BEAT;
  const duration = totalSteps * stepDuration;
  const buffer = new Float64Array(Math.ceil(duration * SAMPLE_RATE));

  for (let step = 0; step < totalSteps; step += 1) {
    const time = step * stepDuration;
    const bar = Math.floor(step / 16);
    const chord = track.progression[bar % track.progression.length];
    const bass = track.bass[bar % track.bass.length];

    if (step % 16 === 0) {
      chord.forEach((note) => {
        addNote(buffer, {
          start: time,
          duration: beat * 3.7,
          midi: note,
          volume: track.padVolume,
          wave: "sine",
        });
      });
    }

    if (step % 4 === 0) {
      addNote(buffer, {
        start: time,
        duration: beat * 0.82,
        midi: bass,
        volume: track.bassVolume,
        wave: track.bassWave,
      });
    }

    if (step % 2 === 0) {
      const arpIndex = track.arp[(step / 2) % track.arp.length];
      addNote(buffer, {
        start: time,
        duration: stepDuration * 1.72,
        midi: chord[arpIndex] + 12,
        volume: track.arpVolume,
        wave: track.arpWave,
      });
    }

    const melody = track.melody[step % track.melody.length];
    if (melody !== null && step % 2 === 0) {
      addNote(buffer, {
        start: time,
        duration: stepDuration * 1.82,
        midi: melody,
        volume: track.leadVolume,
        wave: track.leadWave,
      });
    }

    addDrums(buffer, step, time, track.drumStyle);
  }

  let peak = 0;
  for (const sample of buffer) peak = Math.max(peak, Math.abs(sample));
  const gain = peak > 0 ? Math.min(0.88 / peak, 1.12) : 1;
  return { buffer, duration, gain };
}

function createWav(buffer, gain) {
  const bytesPerSample = BIT_DEPTH / 8;
  const dataSize = buffer.length * bytesPerSample;
  const wav = Buffer.alloc(44 + dataSize);
  wav.write("RIFF", 0);
  wav.writeUInt32LE(36 + dataSize, 4);
  wav.write("WAVE", 8);
  wav.write("fmt ", 12);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(CHANNELS, 22);
  wav.writeUInt32LE(SAMPLE_RATE, 24);
  wav.writeUInt32LE(SAMPLE_RATE * CHANNELS * bytesPerSample, 28);
  wav.writeUInt16LE(CHANNELS * bytesPerSample, 32);
  wav.writeUInt16LE(BIT_DEPTH, 34);
  wav.write("data", 36);
  wav.writeUInt32LE(dataSize, 40);
  for (let index = 0; index < buffer.length; index += 1) {
    const softened = Math.tanh(buffer[index] * gain);
    wav.writeInt16LE(Math.round(softened * 32_767), 44 + index * bytesPerSample);
  }
  return wav;
}

function getFfmpegEncoders() {
  const result = spawnSync("ffmpeg", ["-hide_banner", "-encoders"], { encoding: "utf8" });
  if (result.status !== 0) return null;
  const output = `${result.stdout}\n${result.stderr}`;
  const hasEncoder = (name) => new RegExp(`\\s${name}\\s`).test(output);
  return {
    mp3: hasEncoder("libmp3lame"),
    ogg: hasEncoder("libvorbis") ? "libvorbis" : hasEncoder("vorbis") ? "vorbis" : null,
  };
}

function compress(wavPath, outputPath, codecArgs) {
  const result = spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-i", wavPath, ...codecArgs, outputPath], {
    stdio: "inherit",
  });
  if (result.status !== 0) console.warn(`  warning: could not create ${outputPath}`);
}

function getOption(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? null : process.argv[index + 1];
}

const requestedTrack = getOption("--track");
const wavOnly = process.argv.includes("--wav-only") || process.argv.includes("--no-compressed");
const entries = Object.entries(tracks).filter(([name]) => !requestedTrack || name === requestedTrack);

if (!entries.length) {
  console.error(`Unknown track "${requestedTrack}". Choose one of: ${Object.keys(tracks).join(", ")}`);
  process.exit(1);
}

await mkdir(OUTPUT_DIR, { recursive: true });
const ffmpegEncoders = wavOnly ? null : getFfmpegEncoders();
console.log(`Generating ${entries.length} original chiptune BGM track(s) in ${OUTPUT_DIR}`);
console.log(ffmpegEncoders ? "ffmpeg detected: adding supported compressed exports" : "WAV-only mode: compressed exports skipped");

for (const [name, track] of entries) {
  const { buffer, duration, gain } = renderTrack(track);
  const wavPath = resolve(OUTPUT_DIR, `${name}.wav`);
  await writeFile(wavPath, createWav(buffer, gain));
  console.log(`- ${name}.wav (${duration.toFixed(1)}s): ${track.description}`);
  if (ffmpegEncoders?.ogg) {
    const oggArgs =
      ffmpegEncoders.ogg === "libvorbis"
        ? ["-c:a", "libvorbis", "-q:a", "5"]
        : ["-ac", "2", "-c:a", "vorbis", "-strict", "experimental", "-q:a", "5"];
    compress(wavPath, resolve(OUTPUT_DIR, `${name}.ogg`), oggArgs);
  }
  if (ffmpegEncoders?.mp3) {
    compress(wavPath, resolve(OUTPUT_DIR, `${name}.mp3`), ["-c:a", "libmp3lame", "-q:a", "4"]);
  }
}

console.log("Done. All note patterns are project-original and deterministic.");
