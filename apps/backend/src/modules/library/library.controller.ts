import type { FastifyReply, FastifyRequest } from 'fastify';
import type { CreateLibraryEntryInput, UpdateLibraryEntryInput } from './library.schema.js';
import type { LibraryService } from './library.service.js';

export class LibraryController {
  constructor(private readonly library: LibraryService) {}

  list = async (req: FastifyRequest, reply: FastifyReply) => {
    const entries = await this.library.list(req.session.userId as string);
    return reply.send(entries);
  };

  getById = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const entry = await this.library.getById(req.params.id, req.session.userId as string);
    return reply.send(entry);
  };

  create = async (req: FastifyRequest<{ Body: CreateLibraryEntryInput }>, reply: FastifyReply) => {
    const entry = await this.library.create(req.session.userId as string, req.body);
    return reply.code(201).send(entry);
  };

  update = async (
    req: FastifyRequest<{ Params: { id: string }; Body: UpdateLibraryEntryInput }>,
    reply: FastifyReply,
  ) => {
    const entry = await this.library.update(req.params.id, req.session.userId as string, req.body);
    return reply.send(entry);
  };

  remove = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    await this.library.remove(req.params.id, req.session.userId as string);
    return reply.code(204).send();
  };

  getStats = async (req: FastifyRequest, reply: FastifyReply) => {
    const stats = await this.library.getStats(req.session.userId as string);
    return reply.send(stats);
  };
}
