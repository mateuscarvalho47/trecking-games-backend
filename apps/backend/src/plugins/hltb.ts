import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { env } from '@/config/env.js';
import { HltbClient } from '@/lib/hltb/client.js';

declare module 'fastify' {
  interface FastifyInstance {
    hltb: HltbClient;
  }
}

export default fp(async (app: FastifyInstance) => {
  const client = new HltbClient(app.redis, env.HLTB_TIMEOUT_MS, app.log);
  app.decorate('hltb', client);
});
