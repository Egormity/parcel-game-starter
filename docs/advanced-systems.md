# Advanced mechanics and effects

Parcel is a top-down, zero-gravity delivery example with Arcade collisions. It is not already a
platformer, rigid-body puzzle, particle engine or multiplayer game. This guide shows where to add
those requested behaviors while preserving the ownership in [architecture](architecture.md).

## Start with one playable change

Choose a vertical slice such as a jump across one gap, one rolling crate pressing a switch, or a
projectile hitting one target. Define success, pause, reset and failure behavior first. Add the
smallest data/rule/integration/presentation change before making more levels or replacing all art.

| Requested feature        | Integration choice                                    | Important boundary                                                           |
| ------------------------ | ----------------------------------------------------- | ---------------------------------------------------------------------------- |
| Platformer gravity/jump  | Arcade can support simple rectangular/circular bodies | Replace top-down input assignment; retain physics-owned velocity integration |
| Rotating/stacking crates | Matter or another suitable rigid-body solver          | Arcade and Matter bodies do not collide with each other                      |
| Rope/hinged mechanism    | Constraints owned with the connected bodies           | Anchors, limits, stable setup, reset and disposal need explicit tests        |
| Enemy/traffic            | Data plus a focused movement/decision system          | Rules own damage/objectives; a moving decoration is not an enemy             |
| Projectile               | Stable ID, bounded lifetime and collision/swept query | Test thin-wall tunnelling; don't assume general CCD in Arcade                |
| Confetti/smoke/trail     | Scene-owned bounded particle emitter/pool             | Effects consume outcomes, never award score or decide hits                   |
| Shader/lighting effect   | Verify WebGL capability and fallback                  | Parcel currently selects `Phaser.CANVAS`                                     |

## Adapting movement or physics

`DeliveryScene.prepareInput()` currently overwrites both velocity components from a normalized
top-down direction. A platformer must preserve the physics-resolved vertical velocity except when
applying a jump or another deliberate action. Configure gravity, grounded state, jump edges and
ceiling collision together. Buffered input/coyote time should use the same simulation clock and
have explicit pause/reset semantics. A second browser timer or manual position update would fight
the physics world.

The current integration advances `GameSession` from Arcade's `WORLD_STEP`. Replacing Arcade with
Matter means replacing body creation, colliders, step hookup and position extraction in the engine
boundary, while preserving a narrow controller/snapshot interface for React. Verify the installed
solver's time/velocity units; do not copy Arcade assumptions into Matter calls. Choose authored
moving geometry, immovable terrain and force-driven props according to the selected solver.

For a stacking puzzle, configure a fixed interval with bounded catch-up and one step owner. If
using an application accumulator for Matter, disable automatic stepping before invoking it from
Phaser's lifecycle. Map pointer coordinates through canvas scaling and the active camera. A
temporary drag constraint or controlled target moves simulated pieces without a competing direct
pose writer; release it on pointer cancellation, blur and restart. Test contact during dragging
and the return to free simulation, not only the final dropped pose.

Separate solid contacts from overlaps/sensors. Define collision categories/masks and which
entity IDs own the consequences. Ensure one hit/collection per intended event and reset that
state when an object is reused. Removing a body during a callback can affect iteration; collect
pending removals and apply them at the solver's supported boundary. A visual rotation or sprite
scale does not automatically establish the intended collision footprint.

Tests should cover grounding, jump release/hold, walls and ceilings, moving/one-way platforms from
multiple directions, gravity changes, contact filtering and fast motion for features actually
added. Begin constrained mechanisms with one joint. Cloth/fluid behavior needs an appropriate
solver or a clearly visual approximation, not a claim that basic rigid bodies handle every material.

## Add particles and other feedback

A delivery burst can originate when `GameSession.visitPosition()` reports a newly delivered ID.
Add a small event receipt or compare new IDs with the prior scene snapshot, then hand the event to
a presentation owner such as `src/engine/effects.ts`. Use session/sequence identity so repeated HUD
publishing never creates duplicate bursts. Reset consumption state with a new session.

Reuse an emitter or bounded pool, with maximum count and lifetime. Cosmetic particles do not need
Arcade/Matter bodies; collidable gameplay debris is a separate rule-owned entity. Keep texture
ownership and shutdown cleanup explicit. Pause/resume emitters with the intended session behavior;
stopping player velocity alone does not pause scene time or particle aging. Clear previous effects
on scene replacement and test rapid restart.

Phaser's particle pool is suitable for many sprite effects. Shader pipelines need a compatible
WebGL renderer, while a Canvas fallback can use simple sprites or static feedback. Limit overdraw,
pixel ratio and particle density based on measured phones. Reduced motion can replace bursts or
camera shake with a static highlight while keeping required feedback legible.

## Beyond the first mechanic

Tilemaps and larger worlds need camera/coordinate and collider-generation ownership. AI needs a
defined navigation representation and failure behavior, not decisions in sprite rendering. Audio
unlocks after a gesture and owns mute/pause/disposal. Versioned saves validate imported state;
trusted scores or multiplayer require a separate server authority design. Keep these additions
proportional to the requested game, using the existing rules/engine/UI seams.

For every completed slice, run focused rules tests, typecheck, formatting, build and real input
verification. Check slow-frame behavior, touch cancellation, resize, loading failure, pause and
repeated level replacement. Inspect active bodies/emitters and frame time as content grows. Keep
source editable and preserve [Amazi's runtime contract](amazi.md).

Official references: [Arcade](https://docs.phaser.io/phaser/concepts/physics/arcade),
[Matter](https://docs.phaser.io/phaser/concepts/physics/matter),
[particle emitters](https://docs.phaser.io/phaser/concepts/gameobjects/particles).
