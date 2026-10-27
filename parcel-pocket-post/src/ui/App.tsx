import { useState } from 'react';
import { ArrowUpRight, Package, Sprout } from 'lucide-react';
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
            <Package size={24} strokeWidth={1.8} />
          </span>
          <span>
            parcel<span className="brand-period">.</span>
          </span>
          <small>POCKET POST</small>
        </a>
        <div className="header-note">
          <span className="status-dot" /> A LITTLE EVERYDAY ADVENTURE
        </div>
        <span className="edition-badge">
          2D GAME <ArrowUpRight size={14} aria-hidden="true" />
        </span>
      </header>
      <main>
        <section className="intro" aria-labelledby="page-title">
          <div>
            <p className="eyebrow">
              <span /> GOOD THINGS COME IN SMALL PARCELS
            </p>
            <h1 id="page-title">
              Small town. <span>Big deliveries.</span>
            </h1>
            <p className="intro-copy">
              A pocket-sized adventure. A whole neighbourhood to brighten.
            </p>
          </div>
          <div className="intro-stamp" aria-hidden="true">
            <Sprout size={25} strokeWidth={1.4} />
            <span>
              TAKE THE
              <br />
              SCENIC ROUTE
            </span>
            <small>NO RUSH, JUST JOY</small>
          </div>
        </section>
        <div className="play-layout">
          <MissionPanel snapshot={game.snapshot} />
          <div className="play-column">
            <GamePanel
              {...game}
              nextRoute={() => game.selectLevel((selected + 1) % LEVELS.length)}
            />
            <TouchControls
              disabled={game.status !== 'ready' || game.snapshot?.phase !== 'playing'}
              setDirection={game.setDirection}
            />
            <RoutePicker
              selected={selected}
              disabled={game.status !== 'ready'}
              onSelect={game.selectLevel}
            />
          </div>
        </div>
      </main>
      <footer className="site-footer">
        <p>
          <span className="footer-flower" aria-hidden="true">
            ✳
          </span>{' '}
          A little care goes a long way.
        </p>
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
        <span className="footer-caption">MADE FOR A GOOD LITTLE BREAK.</span>
      </footer>
    </div>
  );
}
