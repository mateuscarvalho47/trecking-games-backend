import { describe, expect, it } from 'vitest';
import { translateGenreName, translateGenres } from '@/lib/igdb/genre-translations.js';

describe('translateGenreName', () => {
  it('returns pt-BR translation for known ID', () => {
    expect(translateGenreName(12, 'fallback')).toBe('RPG');
  });

  it('returns fallback for unknown ID', () => {
    expect(translateGenreName(999, 'Unknown Genre')).toBe('Unknown Genre');
  });

  it('returns fallback for ID 0 (not in map)', () => {
    expect(translateGenreName(0, 'None')).toBe('None');
  });
});

describe('translateGenres', () => {
  it('translates known genres', () => {
    const input = [
      { id: 12, name: 'Role-playing (RPG)' },
      { id: 31, name: 'Adventure' },
    ];
    expect(translateGenres(input)).toEqual(['RPG', 'Aventura']);
  });

  it('falls back to original name for unknown genres', () => {
    const input = [
      { id: 12, name: 'Role-playing (RPG)' },
      { id: 999, name: 'Unknown' },
    ];
    expect(translateGenres(input)).toEqual(['RPG', 'Unknown']);
  });

  it('returns empty array for empty input', () => {
    expect(translateGenres([])).toEqual([]);
  });

  it('preserves original order', () => {
    const input = [
      { id: 33, name: 'Arcade' },
      { id: 8, name: 'Platform' },
      { id: 5, name: 'Shooter' },
    ];
    expect(translateGenres(input)).toEqual(['Arcade', 'Plataforma', 'Tiro']);
  });
});
