import type { FastifyReply, FastifyRequest } from 'fastify';
import { UnauthorizedError } from '@/lib/errors.js';

declare module 'fastify' {
  interface FastifyRequest {
    userId: string;
  }
}

export async function requireAuth(req: FastifyRequest, _reply: FastifyReply) {
  if (!req.session.userId) throw new UnauthorizedError();
  req.userId = req.session.userId;
}
