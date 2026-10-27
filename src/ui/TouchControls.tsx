import { useEffect, useRef } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';
import type { Direction } from '../engine/contracts';

interface Props {
  disabled: boolean;
  setDirection(direction: Direction, pressed: boolean): void;
}

const controls = [
  { direction: 'up', Icon: ArrowUp },
  { direction: 'left', Icon: ArrowLeft },
  { direction: 'down', Icon: ArrowDown },
  { direction: 'right', Icon: ArrowRight },
] as const;

export function TouchControls({ disabled, setDirection }: Props) {
  const held = useRef(new Map<number, Direction>());
  useEffect(() => {
    const release = () => {
      for (const direction of held.current.values()) setDirection(direction, false);
      held.current.clear();
    };
    window.addEventListener('blur', release);
    document.addEventListener('visibilitychange', release);
    if (disabled) release();
    return () => {
      release();
      window.removeEventListener('blur', release);
      document.removeEventListener('visibilitychange', release);
    };
  }, [disabled, setDirection]);

  const release = (pointerId: number) => {
    const direction = held.current.get(pointerId);
    held.current.delete(pointerId);
    if (direction && ![...held.current.values()].includes(direction))
      setDirection(direction, false);
  };

  return (
    <div className="touch-controls" aria-label="Touch movement controls">
      <p>
        Thumbs at the ready.<span>Hold an arrow to move.</span>
      </p>
      <div className="direction-pad">
        {controls.map(({ direction, Icon }) => (
          <button
            className={`direction-button direction-${direction}`}
            key={direction}
            type="button"
            disabled={disabled}
            aria-label={`Move ${direction}`}
            onPointerDown={(event) => {
              event.preventDefault();
              event.currentTarget.setPointerCapture(event.pointerId);
              held.current.set(event.pointerId, direction);
              setDirection(direction, true);
            }}
            onPointerUp={(event) => release(event.pointerId)}
            onPointerCancel={(event) => release(event.pointerId)}
            onLostPointerCapture={(event) => release(event.pointerId)}
            onKeyDown={(event) => {
              if (event.key === ' ' || event.key === 'Enter') {
                event.preventDefault();
                setDirection(direction, true);
              }
            }}
            onKeyUp={(event) => {
              if (event.key === ' ' || event.key === 'Enter') {
                event.preventDefault();
                setDirection(direction, false);
              }
            }}
            onBlur={() => setDirection(direction, false)}
          >
            <Icon aria-hidden="true" size={22} />
          </button>
        ))}
      </div>
    </div>
  );
}
