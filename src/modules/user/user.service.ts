import { NotFoundError } from '@/lib/errors.js';
import type { UserRepository } from './user.repository.js';

export class UserService {
  constructor(private users: UserRepository) {}

  async getById(id: string) {
    const user = await this.users.findById(id);
    if (!user) throw new NotFoundError('Usuário');
    return user;
  }
}
