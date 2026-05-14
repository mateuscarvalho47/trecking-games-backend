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

    if (
      err != null &&
      typeof err === 'object' &&
      'statusCode' in err &&
      typeof (err as { statusCode: unknown }).statusCode === 'number' &&
      (err as { statusCode: number }).statusCode < 500
    ) {
      const e = err as { statusCode: number; code?: string; message?: string };
      return reply.code(e.statusCode).send({
        error: { code: e.code ?? 'VALIDATION', message: e.message ?? 'Bad request' },
      });
    }

    req.log.error({ err }, 'unhandled error');
    return reply.code(500).send({
      error: { code: 'INTERNAL', message: 'Erro interno' },
    });
  });
});
