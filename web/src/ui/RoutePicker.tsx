import { ArrowUpRight, Check } from 'lucide-react';
import { LEVELS } from '../game/levels';

interface Props {
  selected: number;
  disabled: boolean;
  onSelect(index: number): void;
}

export function RoutePicker({ selected, disabled, onSelect }: Props) {
  return (
    <section className="route-picker" aria-labelledby="routes-title">
      <div className="routes-heading">
        <h2 id="routes-title">Pick your patch.</h2>
        <span>{LEVELS.length} little adventures</span>
      </div>
      <div className="route-options">
        {LEVELS.map((level, index) => (
          <button
            key={level.id}
            type="button"
            className={`route-option ${selected === index ? 'selected' : ''}`}
            aria-label={level.name}
            aria-pressed={selected === index}
            disabled={disabled}
            onClick={() => onSelect(index)}
          >
            <span className={`route-illustration route-art-${index}`} aria-hidden="true">
              <MiniMap mirrored={index === 1} />
            </span>
            <span className="route-option-copy">
              <small>ROUTE 0{index + 1}</small>
              <strong>{level.name}</strong>
              <span>{level.subtitle}</span>
            </span>
            <span className="route-selection-icon">
              {selected === index ? <Check size={18} /> : <ArrowUpRight size={18} />}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function MiniMap({ mirrored }: { mirrored: boolean }) {
  return (
    <svg viewBox="0 0 76 76" fill="none">
      <g transform={mirrored ? 'translate(76 0) scale(-1 1)' : undefined}>
        <path d="M0 38h76M20 0v76M58 0v76" stroke="#f4eddb" strokeWidth="10" />
        <rect x="30" y="10" width="16" height="15" rx="3" fill="#cf9f80" />
        <rect x="30" y="51" width="16" height="14" rx="3" fill="#7e9f87" />
        <circle cx="58" cy="16" r="5" fill="#e77d54" />
        <circle cx="20" cy="57" r="5" fill="#f1bd65" />
        <circle cx="58" cy="57" r="5" fill="#839caf" />
      </g>
    </svg>
  );
}
