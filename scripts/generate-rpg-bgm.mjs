#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SAMPLE_RATE = 32_000;
const BIT_DEPTH = 16;
const OUTPUT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "../public/audio/bgm");
const TWO_PI = Math.PI * 2;

const tracks = {
  "adventurers-guild-morning": {
    bpm: 96,
    bars: 16,
    beatsPerBar: 4,
    description: "Warm guild-door morning with a gentle sense of departure",
    progression: [[60, 64, 67], [57, 60, 64], [65, 69, 72], [55, 59, 62], [60, 64, 67], [64, 67, 71], [65, 69, 72], [55, 59, 62]],
    bass: [36, 33, 41, 31, 36, 40, 41, 31],
    melody: [72, null, 76, 74, 71, null, 69, 71, 72, null, 76, 79, 77, 76, 72, null, 69, null, 72, 76, 74, null, 71, 69, 71, 74, 72, null, 67, 69, 71, null],
    lead: "flute",
    pluck: "harp",
    pad: "strings",
    percussion: "town",
    mix: { lead: 0.09, pluck: 0.052, pad: 0.048, bass: 0.092, bell: 0.018 },
    echo: { delay: 0.27, feedback: 0.16 },
  },
  "willow-town-market": {
    bpm: 108,
    bars: 16,
    beatsPerBar: 4,
    description: "Lively but cozy plaza market loop",
    progression: [[60, 64, 67], [62, 65, 69], [57, 60, 64], [55, 59, 62], [60, 64, 67], [65, 69, 72], [62, 65, 69], [55, 59, 62]],
    bass: [36, 38, 33, 31, 36, 41, 38, 31],
    melody: [72, 76, 79, null, 76, 74, 72, null, 69, 72, 76, null, 74, 71, 69, null, 72, 74, 76, 79, 81, null, 79, 76, 74, null, 72, 71, 69, 71, 72, null],
    lead: "flute",
    pluck: "harp",
    pad: "strings",
    percussion: "market",
    mix: { lead: 0.082, pluck: 0.06, pad: 0.04, bass: 0.084, bell: 0.022 },
    echo: { delay: 0.21, feedback: 0.12 },
  },
  "moonlit-library-waltz": {
    bpm: 78,
    bars: 14,
    beatsPerBar: 3,
    description: "Soft moonlit library waltz with warm bells",
    progression: [[57, 60, 64], [53, 57, 60], [55, 59, 62], [52, 55, 59], [57, 60, 64], [55, 59, 62]],
    bass: [33, 29, 31, 28, 33, 31],
    melody: [69, null, 72, null, 67, null, 64, null, 65, null, 69, null, 62, null, 64, null, 67, null, 69, null, 72, null, 69, null, 67, null, 64, null, 62, null, 64, null, 60, null, null, null],
    lead: "flute",
    pluck: "harp",
    pad: "warm-pad",
    percussion: "night",
    mix: { lead: 0.068, pluck: 0.034, pad: 0.06, bass: 0.07, bell: 0.036 },
    echo: { delay: 0.36, feedback: 0.22 },
  },
  "robotics-scout-path": {
    bpm: 100,
    bars: 16,
    beatsPerBar: 4,
    description: "RPG town path with a light, friendly technology accent",
    progression: [[60, 64, 67], [59, 62, 67], [57, 60, 64], [55, 59, 62], [60, 64, 67], [64, 67, 71], [62, 65, 69], [55, 59, 62]],
    bass: [36, 35, 33, 31, 36, 40, 38, 31],
    melody: [72, null, 76, null, 79, 76, null, 74, 71, null, 74, null, 76, 72, null, 69, 72, null, 74, 76, 79, null, 76, 74, 71, null, 69, null, 72, 74, 72, null],
    lead: "synth-flute",
    pluck: "soft-pluck",
    pad: "strings",
    percussion: "scout",
    mix: { lead: 0.076, pluck: 0.052, pad: 0.044, bass: 0.08, bell: 0.024 },
    echo: { delay: 0.24, feedback: 0.14 },
  },
  "career-fog-guardian": {
    bpm: 76,
    bars: 12,
    beatsPerBar: 4,
    description: "Mysterious fog guardian loop with tension and a thread of hope",
    progression: [[45, 48, 52], [43, 47, 50], [41, 45, 48], [43, 46, 50], [45, 48, 52], [40, 43, 47]],
    bass: [33, 31, 29, 31, 33, 28],
    melody: [57, null, null, 60, 59, null, 55, null, 52, null, 53, null, 57, null, null, null, 50, null, 52, null, 55, null, 53, null, 48, null, 50, null, 52, null, null, null],
    lead: "low-flute",
    pluck: "soft-pluck",
    pad: "fog-pad",
    percussion: "fog",
    mix: { lead: 0.06, pluck: 0.024, pad: 0.07, bass: 0.12, bell: 0.014 },
    echo: { delay: 0.42, feedback: 0.23 },
  },
  "spawn-obelisk-awakening": {
    bpm: 84,
    bars: 12,
    beatsPerBar: 4,
    description: "Ceremonial obelisk awakening and hopeful world-entry loop",
    progression: [[48, 55, 60], [53, 57, 60], [50, 55, 59], [55, 59, 62], [48, 55, 60], [57, 60, 64]],
    bass: [36, 41, 38, 43, 36, 45],
    melody: [60, null, 67, null, 72, null, 76, null, 74, null, 71, null, 67, null, null, null, 65, null, 69, null, 72, 76, null, 79, 77, null, 74, null, 72, null, null, null],
    lead: "flute",
    pluck: "bell",
    pad: "warm-pad",
    percussion: "ritual",
    mix: { lead: 0.074, pluck: 0.04, pad: 0.068, bass: 0.07, bell: 0.04 },
    echo: { delay: 0.39, feedback: 0.2 },
  },
};

function midiToFrequency(note) {
  return 440 * 2 ** ((note - 69) / 12);
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

function oscillator(instrument, phase) {
  const sine = Math.sin(phase);
  if (instrument === "flute") return sine + Math.sin(phase * 2) * 0.12 + Math.sin(phase * 3) * 0.035;
  if (instrument === "low-flute") return sine + Math.sin(phase * 2) * 0.08;
  if (instrument === "synth-flute") return sine * 0.82 + Math.sin(phase * 2) * 0.1 + Math.tanh(Math.sin(phase) * 1.8) * 0.08;
  if (instrument === "strings") return sine * 0.72 + Math.sin(phase * 2) * 0.18 + Math.sin(phase * 3) * 0.06;
  if (instrument === "warm-pad") return sine * 0.78 + Math.sin(phase * 0.5) * 0.12 + Math.sin(phase * 2) * 0.08;
  if (instrument === "fog-pad") return sine * 0.76 + Math.sin(phase * 0.5) * 0.16 + Math.sin(phase * 3) * 0.04;
  if (instrument === "harp") return sine * 0.68 + Math.sin(phase * 2) * 0.22 + Math.sin(phase * 4) * 0.08;
  if (instrument === "bell") return sine * 0.62 + Math.sin(phase * 2.01) * 0.22 + Math.sin(phase * 3.98) * 0.1;
  if (instrument === "soft-pluck") return sine * 0.78 + Math.tanh(Math.sin(phase) * 1.6) * 0.16;
  if (instrument === "bass") return sine * 0.84 + Math.sin(phase * 2) * 0.1;
  return sine;
}

function envelope(instrument, time, duration) {
  const pad = instrument.includes("pad") || instrument === "strings";
  const pluck = instrument === "harp" || instrument === "bell" || instrument === "soft-pluck";
  const attack = pad ? Math.min(0.45, duration * 0.28) : pluck ? 0.012 : 0.055;
  const release = pad ? Math.min(0.58, duration * 0.32) : pluck ? Math.min(0.72, duration * 0.9) : Math.min(0.2, duration * 0.36);
  const fadeIn = Math.min(1, time / Math.max(attack, 0.001));
  const fadeOut = Math.min(1, (duration - time) / Math.max(release, 0.001));
  const decay = pluck ? Math.exp(-time * (instrument === "bell" ? 2.3 : 3.4)) : 1;
  return Math.max(0, Math.min(fadeIn, fadeOut)) * decay;
}

function mix(buffer, index, sample) {
  if (index >= 0 && index < buffer.length) buffer[index] += sample;
}

function addTone(buffer, { start, duration, midi, volume, instrument }) {
  const startSample = Math.floor(start * SAMPLE_RATE);
  const length = Math.floor(duration * SAMPLE_RATE);
  const frequency = midiToFrequency(midi);
  for (let offset = 0; offset < length; offset += 1) {
    const time = offset / SAMPLE_RATE;
    const phase = TWO_PI * frequency * time;
    mix(buffer, startSample + offset, oscillator(instrument, phase) * envelope(instrument, time, duration) * volume);
  }
}

function addNoise(buffer, { start, duration, volume, seed, softness = 0.78 }) {
  const startSample = Math.floor(start * SAMPLE_RATE);
  const length = Math.floor(duration * SAMPLE_RATE);
  const random = createRandom(seed);
  let smoothed = 0;
  for (let offset = 0; offset < length; offset += 1) {
    const progress = offset / Math.max(length, 1);
    smoothed = smoothed * softness + (random() * 2 - 1) * (1 - softness);
    mix(buffer, startSample + offset, smoothed * volume * (1 - progress) ** 2);
  }
}

function addHandDrum(buffer, start, volume) {
  const startSample = Math.floor(start * SAMPLE_RATE);
  const duration = 0.18;
  const length = Math.floor(duration * SAMPLE_RATE);
  let phase = 0;
  for (let offset = 0; offset < length; offset += 1) {
    const progress = offset / length;
    phase += (TWO_PI * (96 - progress * 44)) / SAMPLE_RATE;
    mix(buffer, startSample + offset, Math.sin(phase) * volume * (1 - progress) ** 2.6);
  }
}

function addPercussion(buffer, style, beatIndex, time) {
  const seed = 72_911 + beatIndex * 577;
  if (style === "night") {
    if (beatIndex % 3 === 0) addNoise(buffer, { start: time, duration: 0.12, volume: 0.022, seed, softness: 0.88 });
    return;
  }
  if (style === "fog") {
    if (beatIndex % 4 === 0) addHandDrum(buffer, time, 0.07);
    if (beatIndex % 4 === 2) addNoise(buffer, { start: time, duration: 0.16, volume: 0.024, seed, softness: 0.9 });
    return;
  }
  if (style === "ritual") {
    if (beatIndex % 4 === 0) addHandDrum(buffer, time, 0.06);
    if (beatIndex % 2 === 1) addNoise(buffer, { start: time, duration: 0.08, volume: 0.016, seed, softness: 0.86 });
    return;
  }
  if (style === "scout") {
    if (beatIndex % 2 === 0) addHandDrum(buffer, time, 0.048);
    addNoise(buffer, { start: time, duration: 0.055, volume: 0.014, seed, softness: 0.84 });
    return;
  }
  if (beatIndex % 2 === 0) addHandDrum(buffer, time, style === "market" ? 0.058 : 0.05);
  addNoise(buffer, { start: time, duration: 0.065, volume: style === "market" ? 0.018 : 0.014, seed, softness: 0.84 });
}

function addEcho(buffer, delaySeconds, feedback) {
  const delay = Math.floor(delaySeconds * SAMPLE_RATE);
  for (let index = delay; index < buffer.length; index += 1) {
    buffer[index] += buffer[index - delay] * feedback;
  }
}

function softenEdges(buffer) {
  const edge = Math.min(Math.floor(SAMPLE_RATE * 0.018), Math.floor(buffer.length / 4));
  for (let index = 0; index < edge; index += 1) {
    const gain = index / edge;
    buffer[index] *= gain;
    buffer[buffer.length - 1 - index] *= gain;
  }
}

function renderTrack(track) {
  const beat = 60 / track.bpm;
  const step = beat / 2;
  const totalBeats = track.bars * track.beatsPerBar;
  const duration = totalBeats * beat;
  const buffer = new Float64Array(Math.ceil(duration * SAMPLE_RATE));

  for (let bar = 0; bar < track.bars; bar += 1) {
    const chord = track.progression[bar % track.progression.length];
    const bass = track.bass[bar % track.bass.length];
    const barStart = bar * track.beatsPerBar * beat;
    const barDuration = track.beatsPerBar * beat;
    chord.forEach((note) => addTone(buffer, { start: barStart, duration: barDuration * 0.96, midi: note, volume: track.mix.pad, instrument: track.pad }));
    addTone(buffer, { start: barStart, duration: beat * 1.65, midi: bass, volume: track.mix.bass, instrument: "bass" });
    if (track.beatsPerBar === 4) addTone(buffer, { start: barStart + beat * 2, duration: beat * 1.42, midi: bass + 7, volume: track.mix.bass * 0.7, instrument: "bass" });

    for (let pulse = 0; pulse < track.beatsPerBar * 2; pulse += 1) {
      const time = barStart + pulse * step;
      const chordNote = chord[(pulse + bar) % chord.length] + 12;
      addTone(buffer, { start: time, duration: step * 1.45, midi: chordNote, volume: track.mix.pluck, instrument: track.pluck });
      if ((pulse + bar) % 6 === 0) addTone(buffer, { start: time, duration: beat * 1.2, midi: chordNote + 12, volume: track.mix.bell, instrument: "bell" });
    }
  }

  for (let beatIndex = 0; beatIndex < totalBeats; beatIndex += 1) {
    addPercussion(buffer, track.percussion, beatIndex, beatIndex * beat);
  }

  for (let index = 0; index < totalBeats * 2; index += 1) {
    const note = track.melody[index % track.melody.length];
    if (note !== null) addTone(buffer, { start: index * step, duration: step * 1.72, midi: note, volume: track.mix.lead, instrument: track.lead });
  }

  addEcho(buffer, track.echo.delay, track.echo.feedback);
  addEcho(buffer, track.echo.delay * 1.73, track.echo.feedback * 0.42);
  softenEdges(buffer);
  let peak = 0;
  for (const sample of buffer) peak = Math.max(peak, Math.abs(sample));
  return { buffer, duration, gain: peak ? Math.min(0.86 / peak, 1.05) : 1 };
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
  wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(SAMPLE_RATE, 24);
  wav.writeUInt32LE(SAMPLE_RATE * bytesPerSample, 28);
  wav.writeUInt16LE(bytesPerSample, 32);
  wav.writeUInt16LE(BIT_DEPTH, 34);
  wav.write("data", 36);
  wav.writeUInt32LE(dataSize, 40);
  for (let index = 0; index < buffer.length; index += 1) {
    wav.writeInt16LE(Math.round(Math.tanh(buffer[index] * gain) * 32_767), 44 + index * bytesPerSample);
  }
  return wav;
}

function getOption(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? null : process.argv[index + 1];
}

const requestedTrack = getOption("--track");
const entries = Object.entries(tracks).filter(([name]) => !requestedTrack || requestedTrack === name);
if (!entries.length) {
  console.error(`Unknown track "${requestedTrack}". Choose one of: ${Object.keys(tracks).join(", ")}`);
  process.exit(1);
}

await mkdir(OUTPUT_DIR, { recursive: true });
console.log(`Generating ${entries.length} original soft RPG BGM track(s) in ${OUTPUT_DIR}`);
for (const [name, track] of entries) {
  const { buffer, duration, gain } = renderTrack(track);
  await writeFile(resolve(OUTPUT_DIR, `${name}.wav`), createWav(buffer, gain));
  console.log(`- ${name}.wav (${duration.toFixed(1)}s): ${track.description}`);
}
console.log("Done. These procedural melodies are project-original and use no downloaded music files.");
