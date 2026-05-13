import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EmailAlreadyTakenError, InvalidCredentialsError } from '@/modules/auth/auth.errors.js';
import { AuthService } from '@/modules/auth/auth.service.js';

vi.mock('@/lib/hash.js', () => ({
  hashPassword: vi.fn().mockResolvedValue('hashed-password'),
  verifyPassword: vi.fn(),
}));

import { verifyPassword } from '@/lib/hash.js';

function makeRepo(overrides: Record<string, unknown> = {}) {
  return {
    findByEmail: vi.fn(),
    findByEmailWithHash: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    ...overrides,
  };
}

describe('AuthService.register', () => {
  it('creates user when email is available', async () => {
    const repo = makeRepo({
      findByEmail: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({ id: '1', email: 'a@b.com', createdAt: new Date() }),
    });
    const service = new AuthService(repo as never);

    const result = await service.register({ email: 'a@b.com', password: '12345678' });

    expect(repo.create).toHaveBeenCalledWith({ email: 'a@b.com', passwordHash: 'hashed-password' });
    expect(result.email).toBe('a@b.com');
  });

  it('throws EmailAlreadyTakenError when email is taken', async () => {
    const repo = makeRepo({
      findByEmail: vi.fn().mockResolvedValue({ id: '1', email: 'a@b.com' }),
    });
    const service = new AuthService(repo as never);

    await expect(service.register({ email: 'a@b.com', password: '12345678' })).rejects.toThrow(
      EmailAlreadyTakenError,
    );
  });
});

describe('AuthService.login', () => {
  beforeEach(() => {
    vi.mocked(verifyPassword).mockReset();
  });

  it('returns user data on valid credentials', async () => {
    const user = { id: '1', email: 'a@b.com', passwordHash: 'hashed-password' };
    const repo = makeRepo({ findByEmailWithHash: vi.fn().mockResolvedValue(user) });
    vi.mocked(verifyPassword).mockResolvedValue(true);
    const service = new AuthService(repo as never);

    const result = await service.login({ email: 'a@b.com', password: '12345678' });

    expect(result).toEqual({ id: '1', email: 'a@b.com' });
  });

  it('throws InvalidCredentialsError when user does not exist', async () => {
    const repo = makeRepo({ findByEmailWithHash: vi.fn().mockResolvedValue(null) });
    const service = new AuthService(repo as never);

    await expect(service.login({ email: 'a@b.com', password: '12345678' })).rejects.toThrow(
      InvalidCredentialsError,
    );
  });

  it('throws InvalidCredentialsError when password is wrong', async () => {
    const user = { id: '1', email: 'a@b.com', passwordHash: 'hashed-password' };
    const repo = makeRepo({ findByEmailWithHash: vi.fn().mockResolvedValue(user) });
    vi.mocked(verifyPassword).mockResolvedValue(false);
    const service = new AuthService(repo as never);

    await expect(service.login({ email: 'a@b.com', password: 'wrong' })).rejects.toThrow(
      InvalidCredentialsError,
    );
  });
});
