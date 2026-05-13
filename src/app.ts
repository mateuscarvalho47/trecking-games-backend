import Fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { env } from '@/config/env.js';
import { authRoutes } from '@/modules/auth/auth.routes.js';
import { gameRoutes } from '@/modules/game/game.routes.js';
import corsPlugin from '@/plugins/cors.js';
import cronPlugin from '@/plugins/cron.js';
import errorHandlerPlugin from '@/plugins/errorHandler.js';
import prismaPlugin from '@/plugins/prisma.js';
import igdbPlugin from '@/plugins/igdb.js';
import redisPlugin from '@/plugins/redis.js';
import sessionPlugin from '@/plugins/session.js';
import swaggerPlugin from '@/plugins/swagger.js';

export async function buildApp() {
  const app = Fastify({
    logger: {
      transport: env.NODE_ENV === 'development' ? { target: 'pino-pretty' } : undefined,
    },
  }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(errorHandlerPlugin);
  await app.register(corsPlugin);
  await app.register(prismaPlugin);
  await app.register(redisPlugin);
  await app.register(sessionPlugin);
  await app.register(cronPlugin);
  await app.register(igdbPlugin);
  await app.register(swaggerPlugin);

  await app.register(authRoutes);
  await app.register(gameRoutes);

  app.get('/health', async () => ({ ok: true }));

  return app;
}
