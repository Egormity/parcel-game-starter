import { ArrowUpRight, Check, Flag, MapPin, Package, Sparkles } from 'lucide-react';
import type { GameSnapshot } from '../engine/contracts';
import { formatTime } from './preferences';
import { LEVELS } from '../game/levels';

interface Props {
  snapshot: GameSnapshot | null;
}

export function MissionPanel({ snapshot }: Props) {
  const delivered = snapshot?.delivered ?? 0;
  const total = snapshot?.total ?? 3;
  const destination = snapshot?.carrying
    ? LEVELS[snapshot.levelIndex]?.deliveries.find((delivery) => delivery.id === snapshot.carrying)
        ?.name
    : null;
  return (
    <aside className="mission-column">
      <section className="mission-card" aria-labelledby="mission-title">
        <div className="card-eyebrow">
          <span className="status-dot" /> YOUR DAY'S WORK <Package size={18} aria-hidden="true" />
        </div>
        <h2 id="mission-title">
          A little parcel. <br />A happy neighbour.
        </h2>
        <p className="mission-copy">
          Pick up at the post office. Follow the matching marker. Deliver a little joy.
        </p>
        <div className="delivery-total">
          <strong>
            {delivered}
            <span> / {total}</span>
          </strong>
          <span>parcels delivered</span>
        </div>
        <div
          className="delivery-progress"
          aria-label={`${delivered} of ${total} parcels delivered`}
        >
          {Array.from({ length: total }, (_, index) => (
            <span key={index} className={index < delivered ? 'is-delivered' : ''}>
              {index < delivered ? (
                <Check size={18} aria-hidden="true" />
              ) : (
                <Package size={18} aria-hidden="true" />
              )}
            </span>
          ))}
        </div>
        <div className="current-job" role="status" aria-live="polite">
          <span className="job-icon">
            {snapshot?.phase === 'won' ? <Flag size={19} /> : <MapPin size={19} />}
          </span>
          <div>
            <small>
              {snapshot?.phase === 'won'
                ? 'ALL IN A DAY’S WORK'
                : snapshot?.carrying
                  ? 'ON YOUR WAY TO'
                  : 'NEXT STOP'}
            </small>
            <strong>
              {snapshot?.phase === 'won'
                ? 'Every parcel, delivered.'
                : (destination ?? 'The post office')}
            </strong>
          </div>
        </div>
        <p className="mission-hint">{snapshot?.hint ?? 'Your route is almost ready.'}</p>
        <div className="best-time">
          <Sparkles size={15} aria-hidden="true" />
          <span>Personal best</span>
          <strong>{formatTime(snapshot?.bestMs ?? null)}</strong>
        </div>
      </section>
      <section className="field-notes" aria-labelledby="notes-title">
        <div className="note-heading">
          <h3 id="notes-title">The field notes</h3>
          <ArrowUpRight size={19} aria-hidden="true" />
        </div>
        <ol>
          <li>
            <span>01</span>
            <p>
              <strong>Find your feet.</strong> Use WASD, arrow keys, or the on-screen controls.
            </p>
          </li>
          <li>
            <span>02</span>
            <p>
              <strong>Make your rounds.</strong> Walk onto a marker to collect or deliver. No extra
              button needed.
            </p>
          </li>
          <li>
            <span>03</span>
            <p>
              <strong>Take your time.</strong> There’s no countdown. Pause whenever you need.
            </p>
          </li>
        </ol>
      </section>
    </aside>
  );
}
