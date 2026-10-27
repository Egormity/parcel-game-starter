# Browser 2D games

Build or extend a real playable browser 2D game with input, rules, feedback, and outcomes. Preserve
the user's genre and mechanics; the reference delivery game is an example. Decorative canvas
animation or a static mockup does not establish gameplay.

## Working reference

[Parcel game starter](https://github.com/Egormity/parcel-game-starter) provides two playable delivery
maps, collision, keyboard/touch movement, objectives, pause/resume, restart, local best times, and
a separate web interface. The repository may require access. If it cannot be fetched, use the
guidance below and available project files; do not claim to have inspected inaccessible source.
No public production preview has been supplied. An authenticated editor link or localhost address
is not a public game preview.

Read the reference selectively:

- [Architecture](https://github.com/Egormity/parcel-game-starter/blob/feature/codex/parcel-game-starter/2026-10-27/docs/architecture.md) for ownership and lifecycle.
- [Extension guide](https://github.com/Egormity/parcel-game-starter/blob/feature/codex/parcel-game-starter/2026-10-27/docs/extending.md) for new maps, mechanics, or art.
- [Research](https://github.com/Egormity/parcel-game-starter/blob/feature/codex/parcel-game-starter/2026-10-27/docs/research.md) for engine choices and primary sources.
- [Amazi integration](https://github.com/Egormity/parcel-game-starter/blob/feature/codex/parcel-game-starter/2026-10-27/docs/amazi.md) when importing or deploying.

Parcel's tested foundation is TypeScript, Vite, React for menus/HUD, and Phaser 3.90.0 with Arcade
Physics and Canvas rendering. The Phaser pin is a deliberate example choice, not the latest release
or a universal recommendation. Phaser 4 retains but deprecates Canvas and offers newer WebGL
features. Keep an existing suitable engine; do not migrate a working project to match Parcel.
PixiJS fits custom rendering with separately owned gameplay services; direct Canvas can fit a small
game. Match the engine and physics to the requested mechanics.

## Build the reusable base

Establish the player's actions, objective, outcome/retry behavior, camera, and target devices.
Resolve ambiguity when it materially changes gameplay. Complete one playable loop before adding
many systems. Use original procedural art or properly licensed placeholders while proving it.

Separate these responsibilities at the scale the project needs:

- Pure game rules own objectives, score, timers, and phase transitions.
- Typed level data owns layout and entity definitions; validate IDs, dimensions, and coordinates.
- Engine integration owns scenes, physics, input adapters, asset lifetime, and presentation.
- A narrow typed controller/snapshot boundary connects the game to menus and HUD.
- Web UI owns loading/errors, accessible controls, settings, and attachment/disposal.

Parcel puts these in `src/game`, `src/engine`, and `src/ui`. Extend a focused module or data schema
before introducing a general framework or ECS. Rendering must not silently decide victory. Level
data alone does not replace genre-specific art, interaction rules, or interface copy; change those
deliberately when adapting the example.

## Loop, movement, and collision

Keep one loop owner. In Phaser, use its scene/physics lifecycle instead of adding another RAF or
React animation loop. With Arcade Physics, configure fixed stepping and let the world integrate
velocity. Do not also apply velocity to object positions or step the same world manually. Express
speed in units per second, normalize diagonal movement, and keep timed actions independent of
render frequency. Publish HUD snapshots at a useful lower rate, immediately for phase changes.

Arcade supports simple circle/rectangle collision. Rigid-body stacking, joints, or complex physical
shapes may need Matter or another system. Keep visible geometry and colliders aligned; distinguish
solid obstacles from triggers. Validate route reachability and actual traversal, not only JSON or
TypeScript shape. If implementing a custom loop, bound catch-up work and reset accumulated time on
resume; do not copy a second accumulator into an engine that already owns stepping.

## Browser lifetime and controls

Scope keyboard capture to gameplay focus and preserve normal buttons, forms, and page navigation.
Clear held input on blur, visibility loss, restart, and level changes. Pause hidden gameplay and
provide explicit resume. Touch controls need pointer capture plus pointer-up, cancellation, and
lost-capture handling; keep page scrolling usable outside the play controls. Use real DOM controls
for pause/retry and readable objective feedback; a canvas alone is not an accessible interface.

Choose logical world size independently of CSS display size. With Phaser `FIT`, give the parent
measurable bounds and refresh scale after layout changes. Test narrow screens and orientation
changes. Respect reduced motion for decorative movement without hiding essential game feedback.

Own startup cancellation: an async import or asset load that finishes after unmount must not attach
an abandoned game. Clean up scene subscriptions at the appropriate shutdown/destroy boundary and
external listeners/observers on disposal. In Phaser 3.90, `game.destroy()` is deferred until a frame;
do not stop its loop first. Keep `noReturn=false` when retries or remounts may create another game.
Capture emitter references while a scene is live: Phaser plugins can clear their public properties
before a later scene shutdown listener runs. Test actual scene restart, not just final game disposal.
Show actionable loading/failure states and ensure retry creates fresh owners.

Record sources and licenses for images, fonts, tile sets, music, and audio. Use controlled asset
paths and handle loading failures. Add audio after a user gesture. Measure initial download and
render cost as scenes grow; avoid per-frame object allocation, DOM updates, or rebuilding static art.

## Amazi and verification

Keep package files, lockfile, Vite config, source, assets, and Dockerfile together at the allocated
application root. A single root application can use source path `.`. When importing into an existing
project, preserve its registered source path and runtime configuration; GitHub synchronization does
not register an application. Honor `PORT`, `0.0.0.0`, Node 22 compatibility, the pinned package manager,
and the Docker contract. Do not invent an app manifest or require an `apps/web` directory.

Test rules separately, then exercise real keyboard/touch input and complete the example loop using
the project's authorized browser-testing workflow. Check blocked movement, triggers, pause/resume,
restart, level changes, touch cancellation, resizing, and mount/dispose/retry. A canvas appearing is
not evidence of a playable game. Build and verify runtime delivery. Report actual checks and limits.

Local best times are editable by the player. Trusted leaderboards, multiplayer, purchases, or shared
progress require explicit server authority and validation when requested.

Primary references: [Phaser React template](https://github.com/phaserjs/template-react-ts),
[physics](https://phaser.io/oss/docs/phaser/concepts/physics),
[Phaser 3.90 API](https://docs.phaser.io/api-documentation/3.90.0/api-documentation),
[Phaser 4 renderer](https://phaser.io/news/2026/04/phaser-4-renderer-faster-cleaner-and-built-for-modern-games),
[PixiJS](https://pixijs.com/8.x/guides/getting-started/intro).
