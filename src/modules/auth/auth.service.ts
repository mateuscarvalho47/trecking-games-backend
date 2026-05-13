import { hashPassword, verifyPassword } from '@/lib/hash.js';
import type { UserRepository } from '@/modules/user/user.repository.js';
import { EmailAlreadyTakenError, InvalidCredentialsError } from './auth.errors.js';
import type { LoginInput, RegisterInput } from './auth.schema.js';

export class AuthService {
  constructor(private users: UserRepository) {}

  async register(input: RegisterInput) {
    const exists = await this.users.findByEmail(input.email);
    if (exists) throw new EmailAlreadyTakenError();

    const passwordHash = await hashPassword(input.password);
    return this.users.create({ email: input.email, passwordHash });
  }

  async login(input: LoginInput) {
    const user = await this.users.findByEmailWithHash(input.email);
    if (!user) throw new InvalidCredentialsError();

    const ok = await verifyPassword(user.passwordHash, input.password);
    if (!ok) throw new InvalidCredentialsError();

    return { id: user.id, email: user.email };
  }
}
