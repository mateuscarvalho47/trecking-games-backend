import fp from 'fastify-plugin';
import { createClient } from 'redis';
import { env } from '@/config/env.js';

type RedisClient = ReturnType<typeof createClient>;

declare module 'fastify' {
  interface FastifyInstance {
    redis: RedisClient;
  }
}

export default fp(async (app) => {
  const redis = createClient({ url: env.REDIS_URL });

  redis.on('error', (err) => app.log.error({ err }, 'redis error'));

  await redis.connect();

  app.decorate('redis', redis);

  app.addHook('onClose', async () => {
    await redis.quit();
  });
});
