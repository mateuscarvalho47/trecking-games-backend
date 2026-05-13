import type { GameService } from '@/modules/game/game.service.js';
import { LibraryEntryAlreadyExistsError, LibraryEntryNotFoundError } from './library.errors.js';
import type { LibraryRepository } from './library.repository.js';
import type { CreateLibraryEntryInput, UpdateLibraryEntryInput } from './library.schema.js';

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
}
