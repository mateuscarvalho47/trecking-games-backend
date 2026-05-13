import type { FastifyReply, FastifyRequest } from 'fastify';
import { GameNotFoundError } from './game.errors.js';
import type { GameService } from './game.service.js';

export class GameController {
  constructor(private readonly games: GameService) {}

  search = async (
    req: FastifyRequest<{ Querystring: { q: string } }>,
    reply: FastifyReply,
  ) => {
    const results = await this.games.search(req.query.q);
    return reply.send(results);
  };

  getById = async (
    req: FastifyRequest<{ Params: { igdbId: number } }>,
    reply: FastifyReply,
  ) => {
    const game = await this.games.getById(req.params.igdbId);
    if (!game) throw new GameNotFoundError();
    return reply.send(game);
  };
}
