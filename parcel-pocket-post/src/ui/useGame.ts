import { useCallback, useEffect, useRef, useState } from 'react';
import type { Direction, GameController, GameSnapshot } from '../engine/contracts';

export function useGame(reducedMotion: boolean) {
  const hostRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<GameController | null>(null);
  const motionRef = useRef(reducedMotion);
  const [snapshot, setSnapshot] = useState<GameSnapshot | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    motionRef.current = reducedMotion;
    controllerRef.current?.setReducedMotion(reducedMotion);
  }, [reducedMotion]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    let owned: GameController | null = null;
    let engineReady = false;
    setStatus('loading');
    setError('');
    setSnapshot(null);
    void import('../engine/createGame')
      .then(({ createGame }) => {
        if (cancelled) return null;
        return createGame(host, {
          reducedMotion: motionRef.current,
          onSnapshot: (value) => {
            if (!cancelled) setSnapshot(value);
          },
          onReady: () => {
            engineReady = true;
            if (!cancelled && owned) setStatus('ready');
          },
          onError: (message) => {
            if (!cancelled) {
              setError(message);
              setStatus('error');
            }
          },
        });
      })
      .then((controller) => {
        if (!controller) return;
        if (cancelled) {
          controller.dispose();
          return;
        }
        owned = controller;
        controllerRef.current = controller;
        controller.setReducedMotion(motionRef.current);
        if (engineReady) setStatus('ready');
      })
      .catch((reason: unknown) => {
        if (cancelled) return;
        setError(reason instanceof Error ? reason.message : 'The map could not be loaded.');
        setStatus('error');
      });
    return () => {
      cancelled = true;
      if (controllerRef.current === owned) controllerRef.current = null;
      owned?.dispose();
    };
  }, [attempt]);

  const focusGame = useCallback(() => hostRef.current?.focus({ preventScroll: true }), []);
  const start = useCallback(() => {
    controllerRef.current?.start();
    focusGame();
  }, [focusGame]);
  const pause = useCallback(() => controllerRef.current?.pause(), []);
  const restart = useCallback(() => {
    controllerRef.current?.restart();
    focusGame();
  }, [focusGame]);
  const selectLevel = useCallback((index: number) => controllerRef.current?.selectLevel(index), []);
  const setDirection = useCallback((direction: Direction, pressed: boolean) => {
    controllerRef.current?.setDirection(direction, pressed);
  }, []);

  return {
    hostRef,
    snapshot,
    status,
    error,
    start,
    pause,
    restart,
    selectLevel,
    setDirection,
    focusGame,
    retry: () => setAttempt((value) => value + 1),
  };
}
