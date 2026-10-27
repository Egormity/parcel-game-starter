import type { RefObject } from 'react';
import { ArrowRight, Clock3, Keyboard, MapPin, Pause, Play, RotateCcw, Trophy } from 'lucide-react';
import type { GameSnapshot } from '../engine/contracts';
import { formatTime } from './preferences';

interface Props {
  hostRef: RefObject<HTMLDivElement | null>;
  snapshot: GameSnapshot | null;
  status: 'loading' | 'ready' | 'error';
  error: string;
  start(): void;
  pause(): void;
  restart(): void;
  retry(): void;
  nextRoute(): void;
  focusGame(): void;
}

export function GamePanel({
  hostRef,
  snapshot,
  status,
  error,
  start,
  pause,
  restart,
  retry,
  nextRoute,
  focusGame,
}: Props) {
  const phase = snapshot?.phase ?? 'ready';
  const playing = phase === 'playing';
  return (
    <section className="game-card" aria-label="Delivery game">
      <div className="game-toolbar">
        <div className="map-name">
          <MapPin size={18} aria-hidden="true" />
          <div>
            <small>YOUR NEIGHBOURHOOD</small>
            <strong>{snapshot?.levelName ?? 'Unfolding the map…'}</strong>
          </div>
        </div>
        <div className="game-actions">
          <div
            className="route-time"
            aria-label={`Route time ${formatTime(snapshot?.elapsedMs ?? 0)}`}
          >
            <Clock3 size={16} aria-hidden="true" />
            <span data-testid="route-time">{formatTime(snapshot?.elapsedMs ?? 0)}</span>
          </div>
          <span className="toolbar-divider" />
          <button
            className="icon-button"
            type="button"
            aria-label={playing ? 'Pause' : 'Resume'}
            disabled={status !== 'ready' || phase === 'won' || phase === 'ready'}
            onClick={playing ? pause : start}
          >
            {playing ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button
            className="icon-button"
            type="button"
            aria-label="Restart"
            disabled={status !== 'ready'}
            onClick={restart}
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>
      <div
        className="game-stage"
        data-phase={phase}
        data-player-x={snapshot?.player.x}
        data-player-y={snapshot?.player.y}
        data-testid="game-stage"
      >
        <div
          className="canvas-host"
          ref={hostRef}
          tabIndex={0}
          role="region"
          aria-label="Game world"
          aria-describedby="game-controls-description"
          data-testid="game-host"
          onPointerDown={focusGame}
        />
        {status === 'loading' && (
          <div className="stage-message">
            <span className="loading-dot" />
            <strong>Opening the post office…</strong>
            <p>Your neighbourhood will be ready in a moment.</p>
          </div>
        )}
        {status === 'error' && (
          <div className="stage-message" role="alert">
            <strong>We couldn’t open the map.</strong>
            <p>{error}</p>
            <button className="button-primary" type="button" onClick={retry}>
              Try again <RotateCcw size={17} />
            </button>
          </div>
        )}
        {status === 'ready' && phase !== 'playing' && (
          <div className={`game-overlay overlay-${phase}`}>
            <div className="overlay-card">
              <span className="overlay-icon">
                {phase === 'won' ? (
                  <Trophy size={23} />
                ) : phase === 'paused' ? (
                  <Pause size={23} />
                ) : (
                  <PackageMark />
                )}
              </span>
              <div className="overlay-copy">
                <strong>
                  {phase === 'won'
                    ? 'Special delivery. Well done!'
                    : phase === 'paused'
                      ? 'A well-earned breather.'
                      : 'The neighbourhood is waiting.'}
                </strong>
                <p>
                  {phase === 'won'
                    ? `All ${snapshot?.total} parcels delivered in ${formatTime(snapshot?.elapsedMs ?? 0)}.`
                    : phase === 'paused'
                      ? 'Your parcels are safe. Pick up where you left off.'
                      : `${snapshot?.total ?? 3} parcels. A few friendly faces. Let’s go.`}
                </p>
              </div>
              <button
                className="button-primary"
                type="button"
                onClick={phase === 'won' ? nextRoute : start}
              >
                {phase === 'won'
                  ? 'Next route'
                  : phase === 'paused'
                    ? 'Continue route'
                    : 'Start route'}
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="map-caption">
        <span>
          <span className="map-live-dot" />
          {playing
            ? 'Out for delivery'
            : phase === 'won'
              ? 'Route complete'
              : phase === 'paused'
                ? 'Taking a break'
                : 'A fresh route awaits'}
        </span>
        <p id="game-controls-description">
          <Keyboard size={15} aria-hidden="true" /> WASD / arrows to move <i>·</i> Esc to pause
        </p>
      </div>
    </section>
  );
}

function PackageMark() {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <path d="m3 7 9-4 9 4-9 4-9-4Z M3 7v10l9 4 9-4V7 M12 11v10 M7.5 5l9 4v5" />
    </svg>
  );
}
