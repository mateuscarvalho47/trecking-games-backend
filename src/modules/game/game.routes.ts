import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { requireAuth } from '@/lib/requireAuth.js';
import { GameController } from './game.controller.js';
import { gameDetailSchema, gameSearchResultSchema, searchQuerySchema } from './game.schema.js';
import { GameService } from './game.service.js';

const igdbIdParam = z.object({ igdbId: z.coerce.number().int().positive() });

export async function gameRoutes(app: FastifyInstance) {
  const service = new GameService(app.igdb, app.redis);
  const controller = new GameController(service);

  app.get('/games/search', {
    schema: {
      tags: ['games'],
      summary: 'Buscar jogos por nome',
      security: [{ sessionCookie: [] }],
      querystring: searchQuerySchema,
      response: { 200: z.array(gameSearchResultSchema) },
    },
    preHandler: requireAuth,
    handler: controller.search,
  });

  app.get('/games/:igdbId', {
    schema: {
      tags: ['games'],
      summary: 'Buscar jogo por ID IGDB',
      security: [{ sessionCookie: [] }],
      params: igdbIdParam,
      response: { 200: gameDetailSchema },
    },
    preHandler: requireAuth,
    handler: controller.getById,
  });
}
