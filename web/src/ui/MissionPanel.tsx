import { Check, Flag, MapPin, Package, Sparkles } from 'lucide-react';
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
  const complete = snapshot?.phase === 'won';
  const hint =
    snapshot?.phase === 'ready'
      ? 'Walk onto a marker to collect or deliver. No extra button needed.'
      : (snapshot?.hint ?? 'Your route is almost ready.');

  return (
    <aside className="mission-panel" aria-labelledby="mission-title">
      <div className="mission-head">
        <h2 id="mission-title">Today’s round</h2>
        <span className="best-time">
          <Sparkles size={14} aria-hidden="true" />
          Best <strong>{formatTime(snapshot?.bestMs ?? null)}</strong>
        </span>
      </div>

      <div className="progress-block">
        <p className="progress-total">
          <strong>{delivered}</strong>
          <span>of {total} parcels delivered</span>
        </p>
        <div
          className="delivery-progress"
          aria-label={`${delivered} of ${total} parcels delivered`}
        >
          {Array.from({ length: total }, (_, index) => (
            <span key={index} className={index < delivered ? 'is-delivered' : ''}>
              {index < delivered ? (
                <Check size={19} aria-hidden="true" />
              ) : (
                <Package size={19} aria-hidden="true" />
              )}
            </span>
          ))}
        </div>
      </div>

      <div className="current-job" role="status" aria-live="polite">
        <span className="job-icon">{complete ? <Flag size={20} /> : <MapPin size={20} />}</span>
        <div>
          <small>
            {complete ? 'All done' : snapshot?.carrying ? 'On the way to' : 'Next stop'}
          </small>
          <strong>
            {complete ? 'Every parcel delivered' : (destination ?? 'The post office')}
          </strong>
        </div>
      </div>

      <p className="mission-hint">{hint}</p>
    </aside>
  );
}
