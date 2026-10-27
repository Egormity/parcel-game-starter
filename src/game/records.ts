const KEY = 'parcel.best.v1';
export type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

export function readBest(levelId: string, storage?: StorageLike): number | null {
  try {
    const raw = storage?.getItem(KEY);
    const value: unknown = raw ? JSON.parse(raw)?.[levelId] : undefined;
    return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : null;
  } catch {
    return null;
  }
}

export function saveBest(levelId: string, timeMs: number, storage?: StorageLike): void {
  if (!Number.isFinite(timeMs) || timeMs <= 0) return;
  try {
    const raw = storage?.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    const values: Record<string, number> = Object.create(null);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      for (const [key, value] of Object.entries(parsed)) {
        if (typeof value === 'number' && Number.isFinite(value) && value > 0) values[key] = value;
      }
    }
    values[levelId] = Math.min(values[levelId] ?? Infinity, timeMs);
    storage?.setItem(KEY, JSON.stringify(values));
  } catch {
    /* Storage is optional; gameplay remains available in private/restricted browsers. */
  }
}

export function browserStorage(): StorageLike | undefined {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}
