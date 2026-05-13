import fp from 'fastify-plugin';
import { ZodError, z } from 'zod';
import { AppError, ValidationError } from '@/lib/errors.js';

export default fp(async (app) => {
  app.setErrorHandler((err, req, reply) => {
    if (err instanceof ZodError) {
      const e = new ValidationError(z.treeifyError(err));
      return reply.code(e.statusCode).send({
        error: { code: e.code, message: e.message, details: e.details },
      });
    }

    if (err instanceof AppError) {
      return reply.code(err.statusCode).send({
        error: { code: err.code, message: err.message, details: err.details },
      });
    }

    req.log.error({ err }, 'unhandled error');
    return reply.code(500).send({
      error: { code: 'INTERNAL', message: 'Erro interno' },
    });
  });
});
