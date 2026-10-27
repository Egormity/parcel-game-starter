# Assets and credits

Paths in this guide are relative to the application root (`web/` in the repository).

Parcel's town, buildings, roads, parcel markers, courier, and application icon are drawn from
original geometric shapes in this repository. No downloaded sprites, soundtracks, model packs,
remote fonts, or CDN scripts are required at runtime. Original code and artwork use the root MIT
license.

Phaser, React, Vite, TypeScript, Vitest, and Playwright are separate dependencies with their own
licenses in the installed packages. Lucide's interface icons use the [ISC license](https://github.com/lucide-icons/lucide/blob/main/LICENSE).
Phaser is [MIT licensed](https://github.com/phaserjs/phaser/blob/v3.90.0/license.txt).
The optional static production server uses its upstream container and license.

## Bundled fonts

Fonts are served from `public/fonts`; gameplay makes no request to a font CDN.

- **Manrope**, by the Manrope Project authors, from the [Google Fonts source](https://github.com/google/fonts/tree/main/ofl/manrope). The variable font is stored as `public/fonts/Manrope.ttf`; its SIL Open Font License 1.1 and copyright notice are preserved in `public/fonts/manrope-OFL.txt`.
- **DM Sans**, by the DM Sans Project authors, from the [Google Fonts source](https://github.com/google/fonts/tree/main/ofl/dmsans). The variable font is stored as `public/fonts/DMSans.ttf`; its SIL Open Font License 1.1 and copyright notice are preserved in `public/fonts/dmsans-OFL.txt`.

These fonts retain their upstream licenses; they are not relicensed by the repository's MIT license.

When replacing the procedural visuals, store assets locally, record their source, author, license,
and required attribution here, and preload them through the engine. Do not add CDN runtime
requirements or assume an image found online is reusable. Sprite-sheet frame bounds, collision
bounds, and display size are different concerns; preserve explicit world-space hitboxes.
