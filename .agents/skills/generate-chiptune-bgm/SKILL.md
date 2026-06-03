---
name: generate-chiptune-bgm
description: Generate, refresh, customize, or verify original loopable chiptune and JRPG-style background music for the website-rpg project. Use when Codex needs to create dawn-plaza-journey, starlit-town-memory, robotic-workshop-waltz, career-fog-dragon, or awakening-obelisk BGM assets, adjust their procedural synthesis patterns, export WAV or optional OGG/MP3 files, update lib/bgm-config.ts audio mappings, or explain the project's copyright-safe music workflow.
---

# Generate Chiptune BGM

Use the project-native deterministic Node.js synthesizer. Do not download, transcribe, or imitate recognizable music from commercial games.

## Workflow

1. Read `docs/chiptune-bgm-skill.md`, `scripts/generate-bgm.mjs`, and `lib/bgm-config.ts`.
2. Preserve the existing file-first playback system and WebAudio fallback behavior.
3. Run `npm run generate:bgm`.
4. Verify that `public/audio/bgm/` contains:
   - `dawn-plaza-journey.wav`
   - `starlit-town-memory.wav`
   - `robotic-workshop-waltz.wav`
   - `career-fog-dragon.wav`
   - `awakening-obelisk.wav`
5. Treat `.ogg` and `.mp3` files as optional exports. The script creates them only when `ffmpeg` is available.
6. Run `npm run lint` and `npm run build` after code or config changes.

## Customize A Track

Edit the matching track definition near the top of `scripts/generate-bgm.mjs`. Keep patterns original. Adjust BPM, bars, progression, melody, waves, and mix levels conservatively.

Generate one track while iterating:

```bash
node scripts/generate-bgm.mjs --track starlit-town-memory --wav-only
```

Generate every track without requiring compressed encoders:

```bash
npm run generate:bgm -- --wav-only
```

## Copyright Guardrails

- Use genre-level traits only: square waves, triangle bass, noise drums, arpeggios, warm JRPG-town mood, and loop structure.
- Do not copy or closely imitate melodies, countermelodies, or arrangements from Pokémon, Nintendo, Dragon Quest, Final Fantasy, Zelda, or other existing games.
- Keep manual legal replacement slots supported in `lib/bgm-config.ts`.
- If a user supplies third-party audio, require a legally usable file and record its license before enabling it.
