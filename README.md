# Vincent's AI Frontier

An original interactive RPG-style personal website for Vincent Zhou / Jiwen Zhou. The low-poly town is a presentation layer for a professional profile: visitors can quickly browse Vincent's background, focus areas, projects, consulting role, industry observations, and contact links.

All current 3D visuals are original project-native low-poly assets. The town uses procedural geometry, while selected characters use tiny generated `.glb` models with procedural fallbacks. No external game assets, copied maps, or copyrighted character designs are included.

## Features

- Interactive professional portfolio presented as a lightweight low-poly AI frontier town
- Explorable central plaza, winding roads, side paths, and six personal profile sections
- JRPG-style click-to-spawn opening at the central plaza obelisk before exploration begins
- Collapsible scene-aware BGM settings with mute, volume, day/night/growth-challenge switching, and original WebAudio fallback loops
- Recognizable procedural landmarks: plaza monument, data cottage, mechanical outpost, consulting hall, archive library, growth-challenge landmark, and contact gate
- Stylized environment details: trees, bushes, flowers, rocks, fences, signposts, lamps, crates, barrels, benches, flags, and background houses
- Real-time day/night theme based on the visitor's browser time
- Manual `Auto`, `Day`, and `Night` theme modes saved to `localStorage`
- Bright daytime RPG town and lamp-lit neon night town
- Original chibi AI Talent Explorer GLB avatar with cape, data backpack, visor, terminal, back sword, idle motion, and walking animation
- Distinct Data Sage, Robotics Scout, Leanovation Guild Master, Insight Library, Career Fog growth challenge, and Contact visuals
- Desktop controls: `WASD` or arrow keys to move, `E` to interact, `ESC` to close dialogs
- Third-person camera follow, movement damping, town boundaries, and building collision
- Proximity highlights, interaction rings, nearby-only floating labels, and profile progress
- 2D minimap with player position, points of interest, discovery state, and nearby target highlight
- English and Chinese UI with language preference saved to `localStorage`
- Readable themed profile dialogs with subtitle, tags, CTA actions, project links, and reduced-motion support
- Robotics Scout company radar with bilingual market notes, grouped representative companies, and safe fallback badges
- Classic Website mode with a formal overview, profile cards, section progress, visible contact actions, theme controls, and mobile-friendly layout
- Mobile Classic View recommendation and lightweight exploration option
- SEO metadata, screen-reader content, keyboard-accessible controls, and `prefers-reduced-motion` support

## Tech Stack

- Next.js + TypeScript
- Tailwind CSS
- React Three Fiber + Drei
- Framer Motion
- Zustand

## Install and Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality Checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Update Personal Information

Edit [`lib/profile-config.ts`](./lib/profile-config.ts) to update the display name, role, focus statement, and contact links:

```ts
links: {
  linkedin: "https://www.linkedin.com/in/vincentzzjw/",
  github: "https://github.com/VincentZJW",
  email: "vincentzhou1019@gmail.com",
}
```

## Brand Assets and Social Preview

The browser favicon, app icon, Apple touch icon, and Open Graph preview are generated from original project-native code in [`scripts/generate-brand-assets.mjs`](./scripts/generate-brand-assets.mjs). The design combines a glowing cyan/violet obelisk, AI crystal facets, and a subtle `V` mark for Vincent's AI Frontier.

```bash
npm run generate:brand-assets
```

Generated files:

- `app/favicon.ico`
- `app/icon.png`
- `app/apple-icon.png`
- `public/og-image.png`

Metadata for icons, Open Graph, and Twitter cards lives in [`app/layout.tsx`](./app/layout.tsx). For deployment, set `NEXT_PUBLIC_SITE_URL` when the production domain is known; Vercel deployments can also use `VERCEL_URL`.

## Update Bilingual Copy

- Global interface labels live in [`lib/translations.ts`](./lib/translations.ts).
- NPC, Boss, and Portal content lives in [`lib/game-data.ts`](./lib/game-data.ts).

Each game node keeps its full `zh` and `en` copy together:

```ts
{
  id: "new-character",
  type: "npc",
  variant: "sage",
  position: [4, 0, 4],
  themeColor: "#4de8ff",
  icon: "◇",
  discovered: false,
  modelId: "data-sage",
  fallbackType: "data-sage-procedural",
  animationProfile: "sage-orbit",
  interactionStyle: "calm",
  zh: {
    zone: "区域名称",
    label: "角色名称",
    title: "内容标题",
    subtitle: "一句简介",
    content: "中文内容",
    tags: ["Tag A", "Tag B"],
    cta: "继续浏览",
  },
  en: {
    zone: "Zone name",
    label: "Character name",
    title: "Content title",
    subtitle: "One-line description",
    content: "English content",
    tags: ["Tag A", "Tag B"],
    cta: "Continue browsing",
  },
}
```

## Add an NPC, Boss, or Portal

1. Add an object to `gameObjects` in [`lib/game-data.ts`](./lib/game-data.ts).
2. Choose `type: "npc"`, `"boss"`, or `"portal"`.
3. For an NPC, choose one of the current visual variants: `"sage"`, `"scout"`, `"guild-master"`, or `"librarian"`.
4. Add the object's X/Z coordinate and radius to `collisionObstacles` if the player should not walk through its building.
5. Add or extend a low-poly landmark in [`components/game/Buildings.tsx`](./components/game/Buildings.tsx).
6. Add or adjust its curved path segments in [`components/game/TownDecor.tsx`](./components/game/TownDecor.tsx).
7. Add nearby vegetation, props, lamps, or ambient houses in [`components/game/Environment.tsx`](./components/game/Environment.tsx).

## Configure Day and Night Themes

Edit [`lib/theme-config.ts`](./lib/theme-config.ts):

```ts
dayStartHour: 6,
nightStartHour: 18,
```

The same file defines `dayTheme` and `nightTheme`, including sky, fog, ground, road, building, grid, lamp, light intensity, accent color, and dialog style values.

The client-side theme controller lives in [`hooks/useTimeTheme.ts`](./hooks/useTimeTheme.ts). It avoids SSR hydration mismatches by starting from a stable fallback and reading browser time plus `localStorage` after mount. `Auto` mode refreshes once per minute.

## Original Asset Strategy

The current town and characters are built entirely from original project-native visuals. No external models, textures, or third-party visual assets are included, so there are no external asset licenses to track for this version.

- Landmark buildings live in [`components/game/Buildings.tsx`](./components/game/Buildings.tsx).
- Roads and path junctions live in [`components/game/TownDecor.tsx`](./components/game/TownDecor.tsx).
- Trees, bushes, flowers, rocks, lamps, fences, signs, containers, and ambient houses live in [`components/game/Environment.tsx`](./components/game/Environment.tsx).
- Original character GLBs are generated by [`scripts/generate-original-glb.mjs`](./scripts/generate-original-glb.mjs).
- Character runtime loading and graceful fallback behavior live in [`components/game/ModelLoader.tsx`](./components/game/ModelLoader.tsx).
- Runtime model metadata lives in [`lib/model-registry.ts`](./lib/model-registry.ts); static asset metadata lives in [`public/models/manifest.json`](./public/models/manifest.json).
- Asset license records live in [`lib/asset-licenses.ts`](./lib/asset-licenses.ts) and [`public/models/ASSET_LICENSES.md`](./public/models/ASSET_LICENSES.md).

## Company Logos

Robotics Scout's bilingual Embodied AI company radar lives in [`lib/game-data.ts`](./lib/game-data.ts) under `companyRadar`. Each company record includes `logoPath`, `logoUrl`, `websiteUrl`, and `fallbackIcon`.

- Downloaded icons are stored in [`public/company-logos`](./public/company-logos) and listed in [`public/company-logos/logo-manifest.json`](./public/company-logos/logo-manifest.json).
- Run `npm run fetch:logos` to refresh icons from each company's official website. The script checks HTML icon links, linked web manifests, official-page brand images, and the official-site favicon fallback. Tesla and UBTECH have additional official-page attempts. Tesla also checks its common official favicon paths, manifests, and `digitalassets.tesla.com/favicon.ico`; if every official request fails, the UI retains the `TS` badge.
- The UI prefers a local `logoPath`, then an optional external `logoUrl`, then a project-native abbreviation badge such as `UR`, `AG`, or `UB`. Missing files and image load failures never render a broken image.
- To replace an icon manually, add an approved asset under `public/company-logos` and update that company's `logoPath` in `lib/game-data.ts`.
- Company logos and icons are trademarks owned by their respective companies. They are used only for identification and display. Confirm formal usage permission before a public launch, or keep the fallback badges.
- To add or remove a company, edit the `companyRadar` array. To change its clickable destination, update `websiteUrl`.

## Background Music

The Start Screen presets the awakening obelisk theme without forcing autoplay. Visitors can play or pause it while remaining on the Start Screen, and clicking the spawn action starts it when needed without restarting an existing playback instance. After a short intro window, it crossfades into the current scene. In automatic mode the BGM system switches between daytime plaza, daytime exploration, night town, Robotics Scout, and Career Fog growth-challenge area tracks. Visitors can also select any of the six original soft RPG-town tracks manually, including the awakening obelisk theme. Mute, volume, selected track, and auto/manual preferences are saved locally.

- Optional audio slots and fallback settings live in [`lib/bgm-config.ts`](./lib/bgm-config.ts).
- Place legally usable files under [`public/audio/bgm`](./public/audio/bgm).
- If a local file is missing or cannot be played, the site uses lightweight original WebAudio loops.
- Run `npm run generate:rpg-bgm` to create six deterministic original soft RPG-town WAV loops.
- The reusable generation workflow is documented in [`docs/rpg-bgm-tool-flow.md`](./docs/rpg-bgm-tool-flow.md).
- The reserved `licensedLittlerootTown` slot is disabled by default. Only enable it after providing your own legally usable file.
- Do not commit unauthorized commercial game music to a public repository.

## Generate Original GLB Models

Run:

```bash
npm run models:generate
```

This creates four original lightweight models:

- `public/models/player/vincent-hero.glb`
- `public/models/npc/data-sage.glb`
- `public/models/npc/robotics-scout.glb`
- `public/models/boss/career-fog-dragon.glb`

The generator reuses one compact cube mesh across named parts, keeping the current files between roughly `3 KB` and `5 KB`. Named parts such as `LeftArm`, `RightArm`, `Head`, `Cape`, `Beacon`, `Orb`, `LeftWing`, and `TailOne` are animated at runtime.

## Model Directory Standard

```text
public/models/
  player/       Hero models
  npc/          NPC and Guide Spirit models
  boss/         Boss models
  portal/       Portal models
  common/       Optional reusable props
  manifest.json Static asset manifest
  ASSET_LICENSES.md
```

Every folder contains a focused `README.md`. Empty replacement slots remain intentionally absent until a valid optimized GLB is added; the registry marks those entries as `available: false` so the browser does not issue avoidable `404` requests.

## Registry-Driven Model Loading

Game nodes reference `modelId`, not paths. Paths, scale, position offsets, rotation offsets, compression type, animation clip names, fallback type, load availability, and license metadata are centralized in [`lib/model-registry.ts`](./lib/model-registry.ts).

```tsx
<CharacterModel
  modelId={data.modelId}
  fallbackType={data.fallbackType}
  animationState={animationState}
  themeColor={data.themeColor}
  isNight={isNight}
  isActive={isNearby || isActive}
  reducedMotion={reducedMotion}
  worldPosition={data.position}
/>
```

[`components/game/CharacterModel.tsx`](./components/game/CharacterModel.tsx) applies distance-aware lazy loading, then delegates to [`components/game/ModelLoader.tsx`](./components/game/ModelLoader.tsx). The loader:

- resolves all model metadata from the registry
- uses Drei `useGLTF`, `Suspense`, and an error boundary
- clones skinned scenes safely and disposes cloned materials on cleanup
- supports normal, Draco, and Meshopt GLBs through registry metadata
- applies shadows and theme-color emissive accents
- uses model clips when available and crossfades between states
- detects basic morph targets such as `neutral`, `attentive`, `talking`, and `smile`
- falls back without crashing and warns once when a GLB cannot load

## Procedural Character Fallbacks

[`components/game/CharacterFallback.tsx`](./components/game/CharacterFallback.tsx) keeps the world complete even when optional models are absent or fail to load. Supported types:

- `hero-adventurer`
- `data-sage-procedural`
- `robotics-scout-procedural`
- `guild-master-procedural`
- `insight-librarian-procedural`
- `guide-spirit-procedural`
- `career-fog-dragon-procedural`
- `portal-procedural`

## Animation State System

[`hooks/useCharacterAnimation.ts`](./hooks/useCharacterAnimation.ts) maps gameplay conditions to shared states:

- Player: `idle`, `walk`, `interact`
- NPC: `hover`, `greet`, `interact`
- Boss: `bossIdle`, `pulse`, `bossInteract`
- Portal: `idle`, `pulse`, `portalInteract`

If a GLB includes the mapped clip, the loader plays it with a short crossfade. If the clip is absent, named model parts and procedural fallbacks continue to animate with lightweight motion: hover, head tracking, arm gestures, cape sway, beacon pulse, wing motion, tail motion, energy rings, and portal acceleration. Reduced-motion visitors receive calmer animation.

[`hooks/useInteractionFacing.ts`](./hooks/useInteractionFacing.ts) provides damped facing behavior for the hero, NPCs, Boss, and Guide Spirit.

## Preload and Performance Strategy

[`hooks/useModelPreload.ts`](./hooks/useModelPreload.ts) preloads the hero plus the nearest two character models on desktop or the nearest one on compact screens. It is mounted inside the 3D world, so Classic View does not preload GLBs. Individual models load only within their registry distance. Failed and unavailable assets are cached or skipped to avoid repeated requests.

Performance guidance:

- keep the hero under `1 MB`
- keep each NPC under `1 MB`
- keep the Boss under `2 MB`
- resize textures and prefer compressed textures where appropriate
- reuse materials and avoid unnecessary real-time lights
- do not bundle one large world model when incremental loading is possible

## Replace or Extend 3D Models

1. Create an original or clearly licensed optimized `.glb`.
2. Place it in the matching `public/models/` folder.
3. Update its entry in [`lib/model-registry.ts`](./lib/model-registry.ts): set `available: true`, choose `compression`, and adjust scale or offsets.
4. Keep `modelId` in [`lib/game-data.ts`](./lib/game-data.ts); do not add paths to components.
5. Preserve expected named parts where practical, or add internal clips and map their names in the registry.
6. Record any external source in [`lib/asset-licenses.ts`](./lib/asset-licenses.ts) and [`public/models/ASSET_LICENSES.md`](./public/models/ASSET_LICENSES.md).

Recommended optional optimization commands:

```bash
npx gltf-transform optimize input.glb output.glb
npx gltf-transform optimize input.glb output.glb --compress draco --texture-compress webp
```

For a Meshopt replacement, optimize with Meshopt and set `compression: "meshopt"` in the registry. For Draco, use `compression: "draco"`. These tools are recommendations, not project dependencies.

## Add a Blog or Insights System

For a lightweight first version:

1. Add MDX or Markdown files under a new `content/insights/` folder.
2. Render an `/insights` route from static content.
3. Link the Insight Librarian CTA to the insights index.

For frequent publishing, connect a headless CMS later while keeping the game node configuration local.

## Deploy to Vercel

1. Push the repository to GitHub.
2. Import the repository in Vercel.
3. Keep the default Next.js build settings.
4. Deploy.

No environment variables are required for the current MVP.

## Known Limits

- The player uses lightweight planar collision rather than a full physics engine.
- Mobile exploration does not include a virtual joystick yet.
- Optional local BGM files are not bundled by default; original WebAudio loops keep the soundtrack functional without external assets.
- Profile progress tracks viewed sections locally in the visitor's browser.
- Current GLBs are intentionally lightweight originals; future higher-detail replacements should preserve the procedural fallbacks.
