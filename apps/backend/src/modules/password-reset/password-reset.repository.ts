import type { PrismaClient } from '@/generated/prisma/client.js';

export class PasswordResetRepository {
  constructor(private prisma: PrismaClient) {}

  createToken(userId: string, codeHash: string, expiresAt: Date) {
    return this.prisma.passwordResetToken.create({
      data: { userId, codeHash, expiresAt },
      select: { id: true },
    });
  }

  findActiveTokensByUserId(userId: string) {
    return this.prisma.passwordResetToken.findMany({
      where: { userId, usedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
      select: { id: true, codeHash: true },
    });
  }

  markUsed(id: string) {
    return this.prisma.passwordResetToken.update({
      where: { id },
      data: { usedAt: new Date() },
      select: { id: true },
    });
  }

  invalidateActiveForUser(userId: string) {
    return this.prisma.passwordResetToken.updateMany({
      where: { userId, usedAt: null },
      data: { usedAt: new Date() },
    });
  }
}
