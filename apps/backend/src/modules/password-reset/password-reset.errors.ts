import { UnauthorizedError } from '@/lib/errors.js';

export class InvalidOrExpiredResetTokenError extends UnauthorizedError {
  constructor() {
    super('Código inválido ou expirado.');
  }
}
