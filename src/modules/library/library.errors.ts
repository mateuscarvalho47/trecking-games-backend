import { ConflictError, NotFoundError } from '@/lib/errors.js';

export class LibraryEntryNotFoundError extends NotFoundError {
  constructor() {
    super('Library entry');
  }
}

export class LibraryEntryAlreadyExistsError extends ConflictError {
  constructor() {
    super('Game already in library');
  }
}
