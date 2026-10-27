# Parcel game starter

A reusable browser 2D game foundation with one delivery game example.

- Keep pure rules, types and level data in `src/game`; Phaser integration, input and resource lifecycle in `src/engine`; React interface in `src/ui`.
- Phaser owns the animation loop and Arcade Physics owns fixed stepping. Do not add another requestAnimationFrame or React game loop.
- Game rules decide objectives and outcomes; rendering only presents them. Keep snapshots immutable outside the session.
- Prefer focused modules and data over a speculative engine framework. Read `docs/architecture.md` and `docs/extending.md` for substantial mechanics.
- Clean up engine instances, input, observers and subscriptions on teardown. Pause and release held controls on focus loss.
- Preserve Amazi's root Dockerfile, injected PORT, Node 22 and pinned package manager contract.
- Run focused unit tests, typecheck and build for code changes; browser tests for controls, rendering or game flow changes.
- Keep files under 300 lines where practical; split anything over 500 lines.
