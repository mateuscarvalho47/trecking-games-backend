import { describe, expect, it, vi } from 'vitest';
import {
  LibraryEntryAlreadyExistsError,
  LibraryEntryNotFoundError,
} from '@/modules/library/library.errors.js';
import { LibraryService } from '@/modules/library/library.service.js';

const GAME = {
  igdbId: 1,
  name: 'Elden Ring',
  coverUrl: 'https://img.igdb.com/cover.jpg',
  platforms: ['PC', 'PS5'],
  genres: ['RPG'],
  summary: undefined,
  releaseYear: 2022,
};

const ENTRY = {
  id: 'entry-1',
  userId: 'user-1',
  igdbId: 1,
  name: 'Elden Ring',
  coverUrl: 'https://img.igdb.com/cover.jpg',
  genres: ['RPG'],
  platforms: ['PC', 'PS5'],
  status: 'BACKLOG' as const,
  userPlatform: null,
  rating: null,
  hoursPlayed: null,
  notes: null,
  completedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

function makeRepo(overrides: Record<string, unknown> = {}) {
  return {
    findAllByUser: vi.fn(),
    findByIdAndUser: vi.fn(),
    findByUserAndIgdbId: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    ...overrides,
  };
}

function makeGames(overrides: Record<string, unknown> = {}) {
  return {
    getById: vi.fn().mockResolvedValue(GAME),
    search: vi.fn(),
    ...overrides,
  };
}

describe('LibraryService.create', () => {
  it('creates entry with snapshot from IGDB', async () => {
    const repo = makeRepo({
      findByUserAndIgdbId: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue(ENTRY),
    });
    const service = new LibraryService(repo as never, makeGames() as never);

    const result = await service.create('user-1', { igdbId: 1, status: 'BACKLOG' });

    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        igdbId: 1,
        name: 'Elden Ring',
        status: 'BACKLOG',
        completedAt: null,
      }),
    );
    expect(result).toEqual(ENTRY);
  });

  it('sets completedAt when status is COMPLETED', async () => {
    const repo = makeRepo({
      findByUserAndIgdbId: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({ ...ENTRY, status: 'COMPLETED' }),
    });
    const service = new LibraryService(repo as never, makeGames() as never);

    await service.create('user-1', { igdbId: 1, status: 'COMPLETED' });

    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({ completedAt: expect.any(Date) }),
    );
  });

  it('throws LibraryEntryAlreadyExistsError on duplicate', async () => {
    const repo = makeRepo({ findByUserAndIgdbId: vi.fn().mockResolvedValue(ENTRY) });
    const service = new LibraryService(repo as never, makeGames() as never);

    await expect(service.create('user-1', { igdbId: 1, status: 'BACKLOG' })).rejects.toThrow(
      LibraryEntryAlreadyExistsError,
    );
  });

  it('throws LibraryEntryNotFoundError when IGDB game not found', async () => {
    const repo = makeRepo({ findByUserAndIgdbId: vi.fn().mockResolvedValue(null) });
    const games = makeGames({ getById: vi.fn().mockResolvedValue(null) });
    const service = new LibraryService(repo as never, games as never);

    await expect(service.create('user-1', { igdbId: 999, status: 'BACKLOG' })).rejects.toThrow(
      LibraryEntryNotFoundError,
    );
  });
});

describe('LibraryService.update', () => {
  it('throws LibraryEntryNotFoundError when entry does not belong to user', async () => {
    const repo = makeRepo({ findByIdAndUser: vi.fn().mockResolvedValue(null) });
    const service = new LibraryService(repo as never, makeGames() as never);

    await expect(service.update('entry-1', 'user-1', { status: 'PLAYING' })).rejects.toThrow(
      LibraryEntryNotFoundError,
    );
  });

  it('sets completedAt when transitioning to COMPLETED and it was null', async () => {
    const repo = makeRepo({
      findByIdAndUser: vi.fn().mockResolvedValue({ ...ENTRY, completedAt: null }),
      update: vi.fn().mockResolvedValue({ ...ENTRY, status: 'COMPLETED' }),
    });
    const service = new LibraryService(repo as never, makeGames() as never);

    await service.update('entry-1', 'user-1', { status: 'COMPLETED' });

    expect(repo.update).toHaveBeenCalledWith(
      'entry-1',
      expect.objectContaining({ completedAt: expect.any(Date) }),
    );
  });

  it('preserves completedAt when transitioning away from COMPLETED', async () => {
    const completedAt = new Date('2024-01-01');
    const repo = makeRepo({
      findByIdAndUser: vi.fn().mockResolvedValue({ ...ENTRY, status: 'COMPLETED', completedAt }),
      update: vi.fn().mockResolvedValue({ ...ENTRY, status: 'PAUSED', completedAt }),
    });
    const service = new LibraryService(repo as never, makeGames() as never);

    await service.update('entry-1', 'user-1', { status: 'PAUSED' });

    expect(repo.update).toHaveBeenCalledWith(
      'entry-1',
      expect.objectContaining({ completedAt: undefined }),
    );
  });

  it('does not overwrite completedAt when already completed', async () => {
    const completedAt = new Date('2024-01-01');
    const repo = makeRepo({
      findByIdAndUser: vi.fn().mockResolvedValue({ ...ENTRY, status: 'COMPLETED', completedAt }),
      update: vi.fn().mockResolvedValue({ ...ENTRY, status: 'COMPLETED', completedAt }),
    });
    const service = new LibraryService(repo as never, makeGames() as never);

    await service.update('entry-1', 'user-1', { status: 'COMPLETED' });

    expect(repo.update).toHaveBeenCalledWith(
      'entry-1',
      expect.objectContaining({ completedAt: undefined }),
    );
  });
});

describe('LibraryService.getById', () => {
  it('returns entry for valid owner', async () => {
    const repo = makeRepo({ findByIdAndUser: vi.fn().mockResolvedValue(ENTRY) });
    const service = new LibraryService(repo as never, makeGames() as never);

    const result = await service.getById('entry-1', 'user-1');
    expect(result).toEqual(ENTRY);
  });

  it('throws LibraryEntryNotFoundError when entry not found', async () => {
    const repo = makeRepo({ findByIdAndUser: vi.fn().mockResolvedValue(null) });
    const service = new LibraryService(repo as never, makeGames() as never);

    await expect(service.getById('entry-1', 'user-1')).rejects.toThrow(LibraryEntryNotFoundError);
  });
});

describe('LibraryService.remove', () => {
  it('deletes entry for valid owner', async () => {
    const repo = makeRepo({
      findByIdAndUser: vi.fn().mockResolvedValue(ENTRY),
      delete: vi.fn().mockResolvedValue(undefined),
    });
    const service = new LibraryService(repo as never, makeGames() as never);

    await service.remove('entry-1', 'user-1');
    expect(repo.delete).toHaveBeenCalledWith('entry-1');
  });

  it('throws LibraryEntryNotFoundError when entry not found', async () => {
    const repo = makeRepo({ findByIdAndUser: vi.fn().mockResolvedValue(null) });
    const service = new LibraryService(repo as never, makeGames() as never);

    await expect(service.remove('entry-1', 'user-1')).rejects.toThrow(LibraryEntryNotFoundError);
  });
});
