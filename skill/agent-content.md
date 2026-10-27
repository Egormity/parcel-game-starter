# Browser 2D games

Build or extend a real playable browser 2D game with input, rules, feedback, and outcomes. Preserve
the user's genre and mechanics; the reference delivery game is an example. Decorative canvas
animation or a static mockup does not establish gameplay.

## Working reference

[Parcel game starter](https://github.com/Egormity/parcel-game-starter) provides two playable delivery
maps, collision, keyboard/touch movement, objectives, pause/resume, restart, local best times, and
a separate web interface. The public template's default branch is `main`. If it cannot be fetched,
use the guidance below and available project files; do not claim to have inspected inaccessible source.
No public production preview has been supplied. An authenticated editor link or localhost address
is not a public game preview.

Inspect the current repository documentation for architecture, extension examples, research and
Amazi integration; use its own navigation rather than assuming fixed documentation filenames.

Parcel's tested foundation is TypeScript, Vite, React for menus/HUD, and Phaser 3.90.0 with Arcade
Physics and Canvas rendering. The Phaser pin is a deliberate example choice, not the latest release
or a universal recommendation. Phaser 4 retains but deprecates Canvas and offers newer WebGL
features. Keep an existing suitable engine; do not migrate a working project to match Parcel.
PixiJS fits custom rendering with separately owned gameplay services; direct Canvas can fit a small
game. Match the engine and physics to the requested mechanics.

Inspect the repository’s current README, application folders and documentation before adapting it. Identify the standalone application boundary from its actual build and runtime files; do not assume an example’s paths or filenames remain unchanged. Repository-level skill metadata is not an application dependency.

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

Locate the example’s rules, engine and interface owners. Extend a focused module or data schema
before introducing a general framework or ECS. Rendering must not silently decide victory. Level
data alone does not replace genre-specific art, interaction rules, or interface copy; change those
deliberately when adapting the example.

## Develop in playable increments

Inspect the app, installed engine version and target controls. Define a small playable acceptance
case, then map requested mechanics to owners. Prove it with a greybox before producing final art.
Extend types/data and validation, rules, engine integration, snapshot/events and UI together, one
mechanic at a time. Define pause/restart/save behavior and test outcomes before adding more levels.
Finish with asset loading/error handling, mobile controls, profiling and the actual production
build. Keep HTML, TypeScript, CSS and content formatter-checked and readable; minify build output.

The same flow supports platformers, shooters, puzzle, strategy or rhythm games without requiring
Parcel's delivery rules. Tilemaps/cameras, enemy AI/pathfinding, animation states, dialogue,
inventory and editors each need focused state/data owners when requested. A template is a base
to extend, not evidence that every future mechanic is already implemented.

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

## Advanced physics and effects

Parcel is a zero-gravity, top-down example. Use the following paths when the requested game needs
them, and preserve the existing engine when its capabilities are sufficient:

- For a platformer, configure world/body gravity, ground contacts, jump edges and ceiling/side
  collision. Keep velocity integration in the physics owner. Add coyote time or buffered input as
  explicit rules, with reset semantics. Moving platforms and one-way platforms need tests from
  above, below and the side; art alone does not provide support or contact response.
- Arcade is appropriate for simple rectangle/circle solids and overlaps. Choose Matter or another
  suitable solver for rotating/stacking rigid bodies, compound shapes, constraints and joints.
  Arcade and Matter bodies do not collide with one another; replacing the solver means replacing
  its integration boundary, not assigning a sprite to both worlds. Verify the installed version's
  timestep and units, especially when adapting velocity/force APIs from another engine.
- For stable stacking and constraints, configure a fixed physics interval and bounded catch-up in
  one owner. If Matter needs an application-owned accumulator, disable its automatic stepping
  first and drive it within Phaser's lifecycle; never advance both paths. Clear accumulated time
  on pause/resume and test comparable outcomes at slow and fast render rates.
- Give moving bodies an intentional fixed/static, authored/kinematic or dynamic behavior supported
  by the chosen engine. Set mass, restitution, friction, damping and gravity deliberately. Align
  shapes with the visible collision footprint, using simpler shapes than decorative artwork.
  Define layers/masks, sensors and solid contacts separately. Consume collision/overlap events
  once by stable entity identity; defer removal safely and test re-entry and object pooling.
- For dragging/rotating simulated pieces, convert the pointer through the actual canvas scale and
  camera transform into world coordinates. Move a dynamic body through a controlled constraint
  or target supported by the solver instead of letting pointer handlers and physics both write
  its pose. Own the temporary drag constraint, release it on cancel/blur/restart, and test zoomed
  dragging, collisions during the drag and the transition back to free simulation.
- Test fast projectiles against thin obstacles. Use a supported continuous/swept query or a bounded
  substep strategy when needed; do not assume Arcade provides general CCD or that more render FPS
  fixes tunnelling. For constrained mechanisms define anchors, limits and teardown before adding
  many bodies. Cloth, fluids and soft bodies require a suitable separate solver or an explicitly
  visual approximation, not a claim that a rigid-body library handles all materials.
- Keep sparks, smoke, weather, trails and screen effects in a presentation owner. Feed it stable
  one-shot rule events; do not re-emit on every HUD snapshot. Pool particles, cap active count and
  lifetime, and reuse textures/emitters. Phaser's particle system owns a pool; it is not an Arcade
  or Matter rigid-body world. Gameplay debris needs separately owned bodies only where necessary.
- Canvas and WebGL have different shader, lighting and blend capabilities. Parcel uses Canvas;
  verify the requested effect before selecting a WebGL pipeline. Keep a useful fallback, cap
  pixel ratio/overdraw/effect density, and measure frame time on target phones. Particle motion,
  camera shake and flashes respect reduced motion; essential hit/goal feedback remains readable.

For implemented mechanics, verify contact filters, gravity/grounding, fast motion, trigger
deduplication, pooled-object reset, bounded effects, pause and repeated scene replacement. Render
animation and sound consume outcomes but never award score or apply damage. See the reference's
current advanced-systems documentation for practical extension seams and capability limits.

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

Keep each application in a standalone folder inside the project repository, with its own package
files, lockfile, configuration, source, assets, tests and Dockerfile. Inspect the reference's current
structure to find that folder. For supplied source, create an empty application and copy only the
application folder's contents into the returned source path. Preserve that allocated path; never
copy the whole example repository or nest another application folder inside it. If a specific folder
name is required, configure the empty application before copying source, and only when the target
path is absent. Use the application build context when every Docker input is application-local.
Commands run inside the registered source path. Honor injected `PORT`, `0.0.0.0`, Node 22
compatibility, the pinned package manager and the Docker contract. GitHub synchronization does not
register applications; do not invent a repository app manifest.
Load Amazi's current application-configuration guidance before import; supplied source uses
`empty_application`. Keep editable source, not generated `dist`, in the allocated root. Registration,
preview/publication flags and adapters live in the application catalog. See
[Amazi applications](https://docs.amazi.pro/en/applications) and
[publishing](https://docs.amazi.pro/en/publishing-and-domains).

Test rules separately, then exercise real keyboard/touch input and complete the example loop using
the project's authorized browser-testing workflow. Check blocked movement, triggers, pause/resume,
restart, level changes, touch cancellation, resizing, and mount/dispose/retry. A canvas appearing is
not evidence of a playable game. Build and verify runtime delivery. Report actual checks and limits.

Local best times are editable by the player. Trusted leaderboards, multiplayer, purchases, or shared
progress require explicit server authority and validation when requested.

Primary references: [Phaser React template](https://github.com/phaserjs/template-react-ts),
[physics](https://phaser.io/oss/docs/phaser/concepts/physics),
[Arcade Physics](https://docs.phaser.io/phaser/concepts/physics/arcade),
[Matter Physics](https://docs.phaser.io/phaser/concepts/physics/matter),
[particles](https://docs.phaser.io/phaser/concepts/gameobjects/particles),
[Phaser 3.90 API](https://docs.phaser.io/api-documentation/3.90.0/api-documentation),
[Phaser 4 renderer](https://phaser.io/news/2026/04/phaser-4-renderer-faster-cleaner-and-built-for-modern-games),
[PixiJS](https://pixijs.com/8.x/guides/getting-started/intro).
