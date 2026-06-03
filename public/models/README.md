# Original Character Models

These `.glb` files are original low-poly assets generated inside this repository:

```bash
npm run models:generate
```

No third-party visual assets are bundled. The generator uses shared geometry and named character parts so the React Three Fiber runtime can animate selected arms, heads, capes, beacons, wings, and tails.

Runtime model metadata is centralized in `lib/model-registry.ts`. `manifest.json` mirrors the character asset inventory for static inspection. Missing optional files remain disabled in the registry and render procedural fallbacks without issuing repeated requests.

Reserved future replacement slots:

- `npc/guild-master.glb`
- `npc/insight-librarian.glb`
- `npc/guide-spirit.glb`
- `portal/contact-portal.glb`

When adding larger original replacements, optimize textures and consider Draco or Meshopt compression. Keep the procedural React components as graceful `Suspense` and error fallbacks.
