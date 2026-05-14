import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { env } from '@/config/env.js';
import { IgdbClient } from '@/lib/igdb/client.js';

declare module 'fastify' {
  interface FastifyInstance {
    igdb: IgdbClient;
  }
}

export default fp(async (app: FastifyInstance) => {
  const client = new IgdbClient(
    app.redis,
    env.IGDB_CLIENT_ID,
    env.IGDB_CLIENT_SECRET,
    env.IGDB_TIMEOUT_MS,
  );
  app.decorate('igdb', client);
});
