import { describe, expect, it, vi } from 'vitest';
import { GameService } from '@/modules/game/game.service.js';
import { searchQuerySchema } from '@/modules/game/game.schema.js';

const GAME = {
  igdbId: 1942,
  name: 'The Witcher 3: Wild Hunt',
  coverUrl: 'https://images.igdb.com/cover.jpg',
  releaseYear: 2015,
  platforms: ['PC (Microsoft Windows)', 'PlayStation 4'],
  genres: ['Role-playing (RPG)'],
  summary: 'A story-driven open world RPG.',
};

function makeIgdb(overrides: Record<string, unknown> = {}) {
  return {
    searchGames: vi.fn().mockResolvedValue([GAME]),
    getGameById: vi.fn().mockResolvedValue(GAME),
    ...overrides,
  };
}

function makeRedis(overrides: Record<string, unknown> = {}) {
  return {
    get: vi.fn<() => Promise<string | null>>().mockResolvedValue(null),
    set: vi.fn().mockResolvedValue('OK'),
    ...overrides,
  };
}

describe('GameService.search', () => {
  it('returns parsed cache on hit without calling IGDB', async () => {
    const redis = makeRedis({ get: vi.fn().mockResolvedValue(JSON.stringify([GAME])) });
    const igdb = makeIgdb();
    const service = new GameService(igdb as never, redis as never);

    const result = await service.search('witcher');

    expect(igdb.searchGames).not.toHaveBeenCalled();
    expect(result).toEqual([GAME]);
  });

  it('fetches from IGDB on cache miss and stores result with 10-min TTL', async () => {
    const redis = makeRedis();
    const igdb = makeIgdb();
    const service = new GameService(igdb as never, redis as never);

    const result = await service.search('witcher');

    expect(igdb.searchGames).toHaveBeenCalledWith('witcher');
    expect(redis.set).toHaveBeenCalledWith(
      'igdb:search:witcher',
      JSON.stringify([GAME]),
      { EX: 600 },
    );
    expect(result).toEqual([GAME]);
  });

  it('uses the exact query string as part of the cache key', async () => {
    const redis = makeRedis();
    const igdb = makeIgdb();
    const service = new GameService(igdb as never, redis as never);

    await service.search('dark souls');

    expect(redis.get).toHaveBeenCalledWith('igdb:search:dark souls');
    expect(redis.set).toHaveBeenCalledWith(
      'igdb:search:dark souls',
      expect.any(String),
      expect.any(Object),
    );
  });
});

describe('GameService.getById', () => {
  it('returns parsed cache on hit without calling IGDB', async () => {
    const redis = makeRedis({ get: vi.fn().mockResolvedValue(JSON.stringify(GAME)) });
    const igdb = makeIgdb();
    const service = new GameService(igdb as never, redis as never);

    const result = await service.getById(1942);

    expect(igdb.getGameById).not.toHaveBeenCalled();
    expect(result).toEqual(GAME);
  });

  it('fetches from IGDB on cache miss and stores game with 24h TTL', async () => {
    const redis = makeRedis();
    const igdb = makeIgdb();
    const service = new GameService(igdb as never, redis as never);

    const result = await service.getById(1942);

    expect(igdb.getGameById).toHaveBeenCalledWith(1942);
    expect(redis.set).toHaveBeenCalledWith(
      'igdb:game:1942',
      JSON.stringify(GAME),
      { EX: 86400 },
    );
    expect(result).toEqual(GAME);
  });

  it('returns null and skips caching when game is not found', async () => {
    const redis = makeRedis();
    const igdb = makeIgdb({ getGameById: vi.fn().mockResolvedValue(null) });
    const service = new GameService(igdb as never, redis as never);

    const result = await service.getById(999999);

    expect(result).toBeNull();
    expect(redis.set).not.toHaveBeenCalled();
  });
});

describe('searchQuerySchema validation', () => {
  it('accepts a query of 2 characters', () => {
    expect(() => searchQuerySchema.parse({ q: 'ab' })).not.toThrow();
  });

  it('rejects a query shorter than 2 characters', () => {
    expect(() => searchQuerySchema.parse({ q: 'a' })).toThrow();
  });

  it('rejects an empty query', () => {
    expect(() => searchQuerySchema.parse({ q: '' })).toThrow();
  });

  it('rejects missing q field', () => {
    expect(() => searchQuerySchema.parse({})).toThrow();
  });
});
