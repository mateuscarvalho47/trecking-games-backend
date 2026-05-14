import type { FastifyReply, FastifyRequest } from 'fastify';
import { UnauthorizedError } from '@/lib/errors.js';

export async function requireAuth(req: FastifyRequest, _reply: FastifyReply) {
  if (!req.session.userId) throw new UnauthorizedError();
}
