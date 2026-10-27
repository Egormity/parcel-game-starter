# Engine research

Paths in this guide are relative to the application root (`web/` in the repository).

Research checked on 27 October 2026. Parcel is a reusable example with a deliberately small scope: top-down movement, solid obstacles, pickup/delivery rules, two maps, and a React interface. These choices are implementation decisions, not requirements for every 2D game.

## Choosing the foundation

| Option             | What it supplies                                                               | When it fits                                                                                           |
| ------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| Phaser             | Scenes, game loop, input, cameras, loading, rendering, and physics integration | A playable game that needs several of those systems immediately                                        |
| PixiJS             | A rendering engine, scene graph, asset loading, and pointer interaction        | A project with existing gameplay infrastructure or unusually custom rendering                          |
| Canvas 2D directly | Browser drawing primitives                                                     | A very small game where owning timing, scene lifetime, input, and collision is an intentional tradeoff |

Phaser's official [React + TypeScript + Vite template](https://github.com/phaserjs/template-react-ts) demonstrates a bridge between the web interface and engine. Parcel adopts that separation, using a typed controller and snapshots instead of a global event bus. The template is a research reference; Parcel does not copy its demo assets or telemetry script. [Official template catalog](https://docs.phaser.io/phaser/getting-started/project-templates).

PixiJS describes itself as a rendering engine and documents WebGL/WebGPU rendering, a scene graph, interaction, and assets. Choosing it here would leave additional gameplay services to build or integrate. That is a design inference, not a criticism of its rendering capabilities. [PixiJS introduction](https://pixijs.com/8.x/guides/getting-started/intro).

Canvas exposes drawing through JavaScript and the `<canvas>` element; it is a suitable implementation choice when the game's own systems remain small. Parcel uses Canvas through Phaser to retain engine-owned scenes and physics. [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API).

## Why this example pins Phaser 3.90.0

The starter intentionally uses the versioned Phaser 3 Canvas path for modest procedural art. It does not require WebGL, GPU effects, external sprite sheets, or a downloaded game editor. Phaser 3.90.0 is **not the latest Phaser release**. Current Phaser 4 has a different renderer architecture, and its Canvas renderer remains available but is deprecated. For a new game needing current WebGL features, evaluate Phaser 4 against those requirements instead of adopting this pin automatically. [Phaser 3 CanvasRenderer](https://docs.phaser.io/api-documentation/3.90.0/class/renderer-canvas-canvasrenderer), [Phaser 4 rendering changes](https://phaser.io/news/2026/04/phaser-4-renderer-faster-cleaner-and-built-for-modern-games).

The dependency and lockfile fix the tested API. Consult the `3.90.0` documentation or `v3.90.0` source when changing this project: unversioned documentation can describe Phaser 4. An engine upgrade should include a full route playthrough, mobile resizing, shutdown/retry, and rendering checks.

## Physics and time ownership

Arcade Physics is sufficient for this game's circle/rectangle collisions. More complex rigid bodies, joints, or physical stacking justify evaluating Matter or another suitable system. Its simplicity is useful here; it is not a universal physics recommendation. [Phaser physics guide](https://phaser.io/oss/docs/phaser/concepts/physics).

The versioned implementation gives Arcade a fixed-step option and a configured physics rate. Phaser already schedules its scene and world updates. Parcel therefore uses the engine's loop and physics stepping; a second `requestAnimationFrame`, React interval, or hand-rolled physics accumulator would duplicate ownership. Physics velocity is expressed in world pixels per second. Simulation timing uses actual physics steps rather than the number of React renders. [Phaser 3.90 Arcade World source](https://github.com/phaserjs/phaser/blob/v3.90.0/src/physics/arcade/World.js), [Arcade plugin source](https://github.com/phaserjs/phaser/blob/v3.90.0/src/physics/arcade/ArcadePhysics.js).

## Browser details that shape the implementation

- **Scene lifetime:** stopping a scene and destroying it are different operations. Restartable scene-owned listeners need cleanup at shutdown; external owners need explicit disposal. [Scene lifecycle](https://docs.phaser.io/phaser/concepts/scenes), [versioned scene events](https://docs.phaser.io/api-documentation/3.90.0/namespace/scenes-events).
- **Game teardown:** Phaser 3.90 `destroy()` queues destruction for a following frame. Do not stop its loop first and assume all resources were released. Preserve `noReturn=false` when another instance may be created on the page. [Game source](https://github.com/phaserjs/phaser/blob/v3.90.0/src/core/Game.js).
- **Responsive sizing:** `FIT` preserves the game's logical aspect ratio. Centering requires a parent with measurable bounds. A DOM layout change should refresh the engine's scale calculation, not independently stretch the canvas into different input coordinates. [Phaser 3.90 scale constants](https://docs.phaser.io/api-documentation/3.90.0/constant/scale).
- **Touch:** pointer capture lets a held control continue receiving events outside its bounds. Release actions on cancellation and lost capture as well as pointer-up. Keep scrolling available outside the controls. [Pointer events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events).
- **Backgrounding:** visibility and focus are separate signals. Pause gameplay and clear held input when the page becomes hidden or loses focus; resume deliberately. [Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API).

## Assets and reuse

Parcel's town and character use code-created shapes. Runtime assets are served locally; the game does not fetch external images or audio. Its own source is under the repository's [MIT license](../LICENSE); dependencies and fonts retain their licenses. Phaser and the official template are MIT-licensed. Preserve notices when redistributing their code. [Phaser license](https://github.com/phaserjs/phaser/blob/v3.90.0/LICENSE.md), [template license](https://github.com/phaserjs/template-react-ts/blob/main/LICENSE).

The interface bundles [Manrope](https://github.com/google/fonts/tree/main/ofl/manrope) and [DM Sans](https://github.com/google/fonts/tree/main/ofl/dmsans) from Google Fonts. Both use the SIL Open Font License. Their local notices are `public/fonts/manrope-OFL.txt` and `public/fonts/dmsans-OFL.txt`; preserve them with the font files. No Google Fonts stylesheet is requested at runtime.

When replacing the procedural art, record the original URL, license, required attribution, and local filenames. Public availability is not an asset license. Load game audio after a user gesture and dispose its owner. Keep licensing and download size part of the actual asset choice rather than adding unexplained hotlinks.
