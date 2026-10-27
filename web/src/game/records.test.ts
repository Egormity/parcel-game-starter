import { describe, expect, it } from 'vitest';
import { readBest, saveBest, type StorageLike } from './records';

function memory(value: string | null = null): StorageLike {
  return {
    getItem: () => value,
    setItem: (_key, next) => {
      value = next;
    },
  };
}

describe('optional best-time persistence', () => {
  it('keeps the fastest positive result separately for each level', () => {
    const storage = memory();
    saveBest('a', 1200, storage);
    saveBest('b', 1500, storage);
    saveBest('a', 900, storage);
    saveBest('a', 1800, storage);
    expect(readBest('a', storage)).toBe(900);
    expect(readBest('b', storage)).toBe(1500);
    expect(readBest('unknown', storage)).toBeNull();
  });
  it('survives unavailable storage, denied writes, malformed and hostile values', () => {
    const denied: StorageLike = {
      getItem: () => {
        throw new Error('Denied');
      },
      setItem: () => {
        throw new Error('Denied');
      },
    };
    expect(readBest('a', denied)).toBeNull();
    expect(() => saveBest('a', 100, denied)).not.toThrow();
    expect(() => saveBest('a', 100)).not.toThrow();
    for (const value of ['null', '{broken', '{"a":-4}', '{"a":"20"}'])
      expect(readBest('a', memory(value))).toBeNull();
    const storage = memory();
    for (const invalid of [0, -1, Infinity, NaN]) saveBest('a', invalid, storage);
    expect(readBest('a', storage)).toBeNull();
  });
});
