import type { PrismaClient } from '@/generated/prisma/client.js';

export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, createdAt: true },
    });
  }

  findByEmailWithHash(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, passwordHash: true, emailVerified: true },
    });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, createdAt: true },
    });
  }

  create(data: { email: string; passwordHash: string; emailVerificationToken: string }) {
    return this.prisma.user.create({
      data,
      select: { id: true, email: true, createdAt: true },
    });
  }

  findByVerificationToken(token: string) {
    return this.prisma.user.findUnique({
      where: { emailVerificationToken: token },
      select: { id: true, email: true },
    });
  }

  verifyEmail(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true, emailVerificationToken: null },
      select: { id: true, email: true },
    });
  }
}
