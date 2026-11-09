import { useState } from 'react';
import { Package, Sprout } from 'lucide-react';
import { LEVELS } from '../game/levels';
import { GamePanel } from './GamePanel';
import { MissionPanel } from './MissionPanel';
import { RoutePicker } from './RoutePicker';
import { TouchControls } from './TouchControls';
import { readReducedMotion, saveReducedMotion } from './preferences';
import { useGame } from './useGame';

export function App() {
  const [reducedMotion, setReducedMotion] = useState(readReducedMotion);
  const game = useGame(reducedMotion);
  const selected = game.snapshot?.levelIndex ?? 0;

  return (
    <div className="app-shell" data-reduced-motion={reducedMotion}>
      <header className="site-header">
        <a className="brand" href="/" aria-label="Parcel home">
          <span className="brand-icon">
            <Package size={22} strokeWidth={1.8} />
          </span>
          <span className="brand-name">
            parcel<span className="brand-period">.</span>
          </span>
        </a>
        <p className="header-note">A tiny delivery game for a slow afternoon.</p>
      </header>

      <main className="app-main">
        <div className="play-layout">
          <div className="play-column">
            <GamePanel
              {...game}
              nextRoute={() => game.selectLevel((selected + 1) % LEVELS.length)}
            />
            <TouchControls
              disabled={game.status !== 'ready' || game.snapshot?.phase !== 'playing'}
              setDirection={game.setDirection}
            />
          </div>
          <div className="side-panel">
            <MissionPanel snapshot={game.snapshot} />
            <RoutePicker
              selected={selected}
              disabled={game.status !== 'ready'}
              onSelect={game.selectLevel}
            />
          </div>
        </div>
      </main>

      <footer className="site-footer">
        <section className="footer-hero" aria-labelledby="page-title">
          <div>
            <h1 id="page-title">
              Small town. <span>Big deliveries.</span>
            </h1>
            <p className="intro-copy">
              A pocket-sized adventure. A whole neighbourhood to brighten.
            </p>
          </div>
          <div className="intro-stamp" aria-hidden="true">
            <Sprout size={26} strokeWidth={1.4} />
            <span>
              TAKE THE
              <br />
              SCENIC ROUTE
            </span>
          </div>
        </section>
        <div className="footer-bar">
          <p>A little care goes a long way.</p>
          <label className="motion-toggle">
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={(event) => {
                setReducedMotion(event.target.checked);
                saveReducedMotion(event.target.checked);
              }}
            />
            <span className="toggle-track" aria-hidden="true" />
            <span>Reduced motion</span>
          </label>
        </div>
      </footer>
    </div>
  );
}
