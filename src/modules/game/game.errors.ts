import { NotFoundError } from '@/lib/errors.js';

export class GameNotFoundError extends NotFoundError {
  constructor() {
    super('Game');
  }
}
