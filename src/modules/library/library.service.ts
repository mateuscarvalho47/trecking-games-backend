import type { GameService } from '@/modules/game/game.service.js';
import { LibraryEntryAlreadyExistsError, LibraryEntryNotFoundError } from './library.errors.js';
import type { LibraryRepository } from './library.repository.js';
import type { CreateLibraryEntryInput, LibraryStats, UpdateLibraryEntryInput } from './library.schema.js';

const ALL_STATUSES = ['WISHLIST', 'BACKLOG', 'PLAYING', 'PAUSED', 'COMPLETED', 'DROPPED'] as const;

export class LibraryService {
  constructor(
    private readonly repo: LibraryRepository,
    private readonly games: GameService,
  ) {}

  async list(userId: string) {
    return this.repo.findAllByUser(userId);
  }

  async getById(id: string, userId: string) {
    const entry = await this.repo.findByIdAndUser(id, userId);
    if (!entry) throw new LibraryEntryNotFoundError();
    return entry;
  }

  async create(userId: string, input: CreateLibraryEntryInput) {
    const duplicate = await this.repo.findByUserAndIgdbId(userId, input.igdbId);
    if (duplicate) throw new LibraryEntryAlreadyExistsError();

    const game = await this.games.getById(input.igdbId);
    if (!game) throw new LibraryEntryNotFoundError();

    const completedAt = input.status === 'COMPLETED' ? new Date() : null;

    return this.repo.create({
      user: { connect: { id: userId } },
      igdbId: input.igdbId,
      name: game.name,
      coverUrl: game.coverUrl ?? null,
      genres: game.genres,
      platforms: game.platforms,
      status: input.status,
      userPlatform: input.userPlatform ?? null,
      completedAt,
    });
  }

  async update(id: string, userId: string, input: UpdateLibraryEntryInput) {
    const entry = await this.repo.findByIdAndUser(id, userId);
    if (!entry) throw new LibraryEntryNotFoundError();

    const completedAt =
      input.status === 'COMPLETED' && entry.completedAt === null ? new Date() : undefined;

    return this.repo.update(id, { ...input, completedAt });
  }

  async remove(id: string, userId: string) {
    const entry = await this.repo.findByIdAndUser(id, userId);
    if (!entry) throw new LibraryEntryNotFoundError();
    await this.repo.delete(id);
  }

  async getStats(userId: string): Promise<LibraryStats> {
    const { totalGames, totalHoursAgg, statusGroups, ratingGroups, topGenres, topPlatforms, completedTimeline } =
      await this.repo.getStats(userId);

    const countByStatus = Object.fromEntries(ALL_STATUSES.map((s) => [s, 0])) as Record<
      (typeof ALL_STATUSES)[number],
      number
    >;
    for (const g of statusGroups) {
      countByStatus[g.status] = g._count.status;
    }

    return {
      totalGames,
      totalHours: totalHoursAgg._sum.hoursPlayed ? Number(totalHoursAgg._sum.hoursPlayed) : 0,
      countByStatus,
      topGenres: topGenres.map((r) => ({ genre: r.genre, count: Number(r.count) })),
      topPlatforms: topPlatforms.map((r) => ({ platform: r.platform, count: Number(r.count) })),
      ratingDistribution: ratingGroups.map((r) => ({ rating: r.rating as number, count: r._count.rating })),
      completedTimeline: completedTimeline.map((r) => ({ month: r.month, count: Number(r.count) })),
    };
  }
}
