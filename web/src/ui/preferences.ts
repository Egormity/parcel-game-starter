const MOTION_KEY = 'parcel.motion-reduced.v1';

export function readReducedMotion(): boolean {
  try {
    const saved = localStorage.getItem(MOTION_KEY);
    if (saved !== null) return saved === 'true';
  } catch {
    // Private browsing may disable storage. Keep the game usable.
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function saveReducedMotion(value: boolean): void {
  try {
    localStorage.setItem(MOTION_KEY, String(value));
  } catch {
    // This preference still applies for the current visit.
  }
}

export function formatTime(milliseconds: number | null): string {
  if (milliseconds === null) return '—';
  const total = Math.floor(milliseconds / 1000);
  return `${Math.floor(total / 60)
    .toString()
    .padStart(2, '0')}:${(total % 60).toString().padStart(2, '0')}`;
}
