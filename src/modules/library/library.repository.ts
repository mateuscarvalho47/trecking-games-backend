import type { Prisma, PrismaClient } from '@/generated/prisma/client.js';
import type { UpdateLibraryEntryInput } from './library.schema.js';

export class LibraryRepository {
  constructor(private readonly db: PrismaClient) {}

  findAllByUser(userId: string) {
    return this.db.libraryEntry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  findByIdAndUser(id: string, userId: string) {
    return this.db.libraryEntry.findFirst({ where: { id, userId } });
  }

  findByUserAndIgdbId(userId: string, igdbId: number) {
    return this.db.libraryEntry.findUnique({ where: { userId_igdbId: { userId, igdbId } } });
  }

  create(data: Prisma.LibraryEntryCreateInput) {
    return this.db.libraryEntry.create({ data });
  }

  update(id: string, data: UpdateLibraryEntryInput & { completedAt?: Date | null }) {
    return this.db.libraryEntry.update({ where: { id }, data });
  }

  delete(id: string) {
    return this.db.libraryEntry.delete({ where: { id } });
  }
}
