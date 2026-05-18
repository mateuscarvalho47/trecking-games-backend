import Fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { env } from '@/config/env.js';
import { authRoutes } from '@/modules/auth/auth.routes.js';
import { gameRoutes } from '@/modules/game/game.routes.js';
import { libraryRoutes } from '@/modules/library/library.routes.js';
import { passwordResetRoutes } from '@/modules/password-reset/password-reset.routes.js';
import corsPlugin from '@/plugins/cors.js';
import cronPlugin from '@/plugins/cron.js';
import errorHandlerPlugin from '@/plugins/errorHandler.js';
import hltbPlugin from '@/plugins/hltb.js';
import igdbPlugin from '@/plugins/igdb.js';
import prismaPlugin from '@/plugins/prisma.js';
import rateLimitPlugin from '@/plugins/rateLimit.js';
import redisPlugin from '@/plugins/redis.js';
import sessionPlugin from '@/plugins/session.js';
import swaggerPlugin from '@/plugins/swagger.js';

export async function buildApp() {
  const app = Fastify({
    logger: {
      transport: env.NODE_ENV === 'development' ? { target: 'pino-pretty' } : undefined,
    },
    trustProxy: true,
  }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(errorHandlerPlugin);
  await app.register(corsPlugin);
  await app.register(rateLimitPlugin);
  await app.register(prismaPlugin);
  await app.register(redisPlugin);
  await app.register(sessionPlugin);
  await app.register(cronPlugin);
  await app.register(igdbPlugin);
  await app.register(hltbPlugin);
  await app.register(swaggerPlugin);

  await app.register(authRoutes, { prefix: '/api' });
  await app.register(passwordResetRoutes, { prefix: '/api' });
  await app.register(gameRoutes, { prefix: '/api' });
  await app.register(libraryRoutes, { prefix: '/api' });

  app.get('/health', async () => ({ ok: true }));

  return app;
}
