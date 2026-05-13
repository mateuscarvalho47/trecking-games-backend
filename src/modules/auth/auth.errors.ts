import { ConflictError, UnauthorizedError } from '@/lib/errors.js';

export class EmailAlreadyTakenError extends ConflictError {
  constructor() {
    super('Email já cadastrado');
  }
}

export class InvalidCredentialsError extends UnauthorizedError {
  constructor() {
    super('Credenciais inválidas');
  }
}
