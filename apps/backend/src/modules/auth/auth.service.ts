import { randomBytes } from 'node:crypto';
import { sendVerificationEmail } from '@/lib/email.js';
import { hashPassword, verifyPassword } from '@/lib/hash.js';
import type { UserRepository } from '@/modules/user/user.repository.js';
import {
  EmailAlreadyTakenError,
  EmailAlreadyVerifiedError,
  EmailNotVerifiedError,
  InvalidCredentialsError,
  InvalidVerificationTokenError,
} from './auth.errors.js';
import type { LoginInput, RegisterInput, ResendVerificationInput } from './auth.schema.js';

export class AuthService {
  constructor(private users: UserRepository) {}

  async register(input: RegisterInput) {
    const exists = await this.users.findByEmail(input.email);
    if (exists) throw new EmailAlreadyTakenError();

    const passwordHash = await hashPassword(input.password);
    const emailVerificationToken = randomBytes(32).toString('hex');

    const user = await this.users.create({
      email: input.email,
      passwordHash,
      emailVerificationToken,
    });

    try {
      await sendVerificationEmail(input.email, emailVerificationToken);
    } catch {
      console.error(
        '[auth] verification email failed for %s — account created, user must resend',
        input.email,
      );
    }

    return user;
  }

  async login(input: LoginInput) {
    const user = await this.users.findByEmailWithHash(input.email);
    if (!user) throw new InvalidCredentialsError();

    const ok = await verifyPassword(user.passwordHash, input.password);
    if (!ok) throw new InvalidCredentialsError();

    if (!user.emailVerified) throw new EmailNotVerifiedError();

    return { id: user.id, email: user.email };
  }

  async verifyEmail(token: string) {
    const user = await this.users.findByVerificationToken(token);
    if (!user) throw new InvalidVerificationTokenError();

    return this.users.verifyEmail(user.id);
  }

  async resendVerification(input: ResendVerificationInput) {
    const user = await this.users.findByEmailForResend(input.email);

    // Always return success to avoid user enumeration
    if (!user) return;
    if (user.emailVerified) throw new EmailAlreadyVerifiedError();

    const token = randomBytes(32).toString('hex');
    await this.users.updateVerificationToken(user.id, token);

    try {
      await sendVerificationEmail(user.email, token);
    } catch {
      console.error('[auth] resend verification email failed for %s', user.email);
    }
  }
}
