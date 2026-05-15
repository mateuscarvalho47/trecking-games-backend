import fastifyRateLimit from '@fastify/rate-limit';
import fp from 'fastify-plugin';

export default fp(async (app) => {
  await app.register(fastifyRateLimit, {
    global: false,
  });
});
