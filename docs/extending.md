# Extend Parcel

Start with [architecture](architecture.md). The reference is a complete small delivery game with explicit seams for changes. It is not an empty engine framework or a requirement to keep the courier theme.

## Add a route

Extend the `LEVELS` collection in `src/game/levels.ts` with a `Level` from `src/game/types.ts`. Each route defines a stable ID, player spawn, post office, roads, solid buildings, recipients, and decorative trees. Delivery IDs must be unique within the route and stay stable if saved progress later depends on them.

The world is 960 by 640 logical pixels. The current player radius is 13; movement speed is 220 pixels per second. Roads are presentation, buildings have solid colliders, and the post office/recipients use proximity triggers. Walking on grass is allowed. Trees are decorative and do not block the courier.

For a simple third route, begin with the existing cross-street layout and move the depot to the central intersection `(480, 320)`. Place recipients on clear road centers such as `(160, 128)`, `(800, 320)`, and `(160, 512)`. Choose fresh IDs, recipient names/colors, and building labels; copying coordinates does not require copying the first route's story.

The route selector reads `LEVELS`, so adding an entry exposes it without adding a new engine class. Its small town thumbnails are decorative illustrations, not generated map previews. Replace that presentation if the new route needs a geographically accurate preview.

Run `validateLevel` and the focused tests, then traverse every delivery in a browser. Validation catches malformed bounds and blocked key positions; it is not a general pathfinder. Allow enough clearance for the whole body. Do not put a marker close enough to a solid building that its label or trigger becomes misleading. If moving buildings, update the corresponding visual definition and test collision from each approached side.

Recipients are served in their array order. The post office supplies the next undelivered parcel; visiting a different recipient does nothing. If the user wants free-order collection, multiple carried items, or a choice of jobs, change those rules explicitly in `GameSession` rather than only rearranging marker colors.

## Add a mechanic

For example, an optional delivery deadline belongs in game rules:

1. Add the required configuration to the level or an appropriate game settings type. Keep optional mechanics absent from routes that do not use them.
2. Add the state and transition to `src/game/session.ts`, or extract a focused rule module if it grows. Define what happens on success, timeout, pause, restart, and level change.
3. Extend `GameSnapshot`/`GamePhase` in `src/engine/contracts.ts` only where the interface actually needs the information. Update the controller if a new player action is required.
4. Wire the mechanic into the existing physics-step integration. Timing must use the same simulation clock as the rest of the route; do not add a React timer.
5. Present the mechanic in the engine and DOM interface. Add tests for its actual outcomes, especially paused time and replay cleanup.

An enemy or traffic system needs explicit positions, movement rules, collision consequences, and lifetime ownership. A decorative moving sprite does not establish those mechanics. A platformer needs gravity, grounded/jump behavior, and appropriate level geometry; changing the camera and art alone will not turn this example into one.

Keep `GameSession` free of Phaser imports. Its tests can then cover inventory, score, objectives, and phases without booting a canvas. The engine decides where the body can move; the session decides what visiting a place means.

## Replace the art

`src/engine/worldArt.ts` builds the town, `courierArt.ts` builds/animates the player, and `markers.ts` presents pickup and delivery state. Change these independently from the rules. Marker dots and labels supplement color; retain that distinction when replacing the palette or using sprites.

For sprite sheets or tile maps, add an explicit loading stage and failure state. Store assets locally or on a controlled delivery path, record the source and license, and preserve required notices. Keep collider size separate from image dimensions: transparent padding and decorative roofs should not accidentally enlarge the collision footprint. Update camera and scale choices if the world becomes larger than one screen.

If retaining Parcel alongside a different example, use a small presentation adapter or data variant for their visual differences. Avoid branching every shared function on a theme string or duplicating the whole engine for new colors.

## Inputs, menus, and saving

Keyboard and touch feed the same directional input. A new action should pass through the controller/input boundary and own its release/cancel behavior. One-shot actions need edge handling; a held key should not fire a jump or purchase once per rendered frame. Preserve DOM button and form focus behavior.

Reduced motion affects presentation. It should not remove required markers or change the game's rules. Keep controls readable and reachable on phones; test pointer cancellation and resizing with the actual canvas visible.

`src/game/records.ts` stores best times by level ID. It tolerates missing or malformed storage and keeps gameplay available if writes fail. This is a local convenience, not a trusted leaderboard. For durable shared progress, design a server API and its authority separately; do not upload unchecked client scores as verified results.

## Finish a change

Run focused rules tests and `pnpm run build`. Use `pnpm run test:browser` for changes to gameplay integration, controls, layout, or lifecycle. Follow the repository's testing workflow when adapting this into another project. Complete a route through real controls, test pause/resume and restart, and verify that switching maps removes the previous map's bodies and listeners. Inspect the production build and preserve the [Amazi runtime contract](amazi.md).
