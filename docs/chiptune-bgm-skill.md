# Original Chiptune BGM Tool Flow

This project includes a deterministic, dependency-free Node.js generator for original 8-bit JRPG-style background music. It does not download or reproduce melodies from commercial games.

## Generate Music

Run:

```bash
npm run generate:bgm
```

The command always creates five WAV files in `public/audio/bgm/`:

- `dawn-plaza-journey.wav`
- `starlit-town-memory.wav`
- `robotic-workshop-waltz.wav`
- `career-fog-dragon.wav`
- `awakening-obelisk.wav`

If `ffmpeg` is installed, the same command also creates `.ogg` and `.mp3` versions. If `ffmpeg` is unavailable or a compressed export fails, WAV generation still succeeds and the website continues to work.

Generate one track or skip compressed exports:

```bash
node scripts/generate-bgm.mjs --track starlit-town-memory
node scripts/generate-bgm.mjs --wav-only
```

## Synthesis Design

The generator uses only code-native synthesis:

- square, pulse, triangle, and sine oscillators
- deterministic noise-channel drums
- soft bass pulses
- simple chord pads
- original arpeggios and melody patterns
- fixed bar lengths designed for looping

Each track lasts roughly 30 to 46 seconds. Edit the track definitions near the top of `scripts/generate-bgm.mjs` to change BPM, bars, progression, melody, instrumentation, or mix levels.

## Scene Mapping

Runtime file mapping lives in `lib/bgm-config.ts`.

| Scene | Runtime file | Purpose |
| --- | --- | --- |
| `dawn-plaza-journey` | `/audio/bgm/dawn-plaza-journey.wav` | Warm daytime plaza exploration |
| `starlit-town-memory` | `/audio/bgm/starlit-town-memory.wav` | Quiet starry town |
| `robotic-workshop-waltz` | `/audio/bgm/robotic-workshop-waltz.wav` | Light-tech Robotics Scout workshop |
| `career-fog-dragon` | `/audio/bgm/career-fog-dragon.wav` | Career Fog Dragon area |
| `awakening-obelisk` | `/audio/bgm/awakening-obelisk.wav` | Summoning and awakening cue |

The current website selects Start Screen, day, night, Robotics Scout, and boss-area tracks automatically. The HUD and Classic View selector can switch to manual mode. Playback still starts only after the visitor clicks the Start Screen.

## Legal Replacement Files

You may replace any generated file with music you created or licensed. Keep the existing filename, or update the matching `src` in `lib/bgm-config.ts`.

The optional `licensedLittlerootTown` slot remains disabled by default. Do not enable or commit a commercial-game recording unless you have the legal right to use it.

## Copyright Guardrails

- Do not transcribe or imitate recognizable melodies from Pokémon, Nintendo, Dragon Quest, Final Fantasy, Zelda, or other commercial games.
- Treat genre, instrumentation, mood, tempo range, and loop structure as inspiration boundaries.
- Keep melody note patterns project-original.
- Record the license source before replacing generated files with third-party assets.
