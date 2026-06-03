# Original Soft RPG BGM Tool Flow

The website uses six dependency-free, programmatically generated WAV loops for a warm fantasy-village and JRPG-town atmosphere. The generator uses no downloaded music files and does not copy melodies from OpenGameArt or commercial games.

## Generate Music

Run:

```bash
npm run generate:rpg-bgm
```

The command creates:

- `public/audio/bgm/adventurers-guild-morning.wav`
- `public/audio/bgm/willow-town-market.wav`
- `public/audio/bgm/moonlit-library-waltz.wav`
- `public/audio/bgm/robotics-scout-path.wav`
- `public/audio/bgm/career-fog-guardian.wav`
- `public/audio/bgm/spawn-obelisk-awakening.wav`

Generate one track while tuning:

```bash
node scripts/generate-rpg-bgm.mjs --track moonlit-library-waltz
```

## Synthesis Design

The Node.js generator writes mono 16-bit WAV files directly. It combines:

- flute-like and synth-flute lead voices
- soft strings and warm pads
- harp, pluck, and bell patterns
- gentle bass pulses
- light hand-drum and softened noise percussion
- short echo taps and softened loop edges

The resulting loops are intentionally softer than 8-bit chiptune. Their genre direction is a cozy RPG town, fantasy village, and adventurer-departure mood.

## Runtime Mapping

Runtime mapping lives in `lib/bgm-config.ts`:

| Scene | Track |
| --- | --- |
| Start Screen | `spawn-obelisk-awakening` |
| Daytime central plaza | `willow-town-market` |
| Daytime town exploration | `adventurers-guild-morning` |
| Night town | `moonlit-library-waltz` |
| Robotics Scout area or dialog | `robotics-scout-path` |
| Career Fog Dragon area or dialog | `career-fog-guardian` |

The HUD and Classic View selector can switch from automatic scene selection to any manual track. The Start Screen presets `spawn-obelisk-awakening` without forcing autoplay. Visitors can play or pause that opening track while staying on the Start Screen. Clicking the spawn action starts the track when needed without restarting an existing playback instance, then the provider crossfades to the active auto-scene track after the short intro window. A manual track choice remains protected from automatic scene switching until the visitor selects Auto Scene again.

## Legal Replacement Files

Replace any generated WAV file with a legally usable recording under the same filename, or update its `src` in `lib/bgm-config.ts`.

Do not download or reproduce a specific OpenGameArt track. Do not transcribe or imitate recognizable music from Pokémon, Nintendo, Dragon Quest, Final Fantasy, Zelda, or other commercial games.
