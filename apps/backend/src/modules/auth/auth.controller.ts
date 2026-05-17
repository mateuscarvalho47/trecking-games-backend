import type { FastifyReply, FastifyRequest } from 'fastify';
import { parse } from '@/lib/validate.js';
import type { UserService } from '@/modules/user/user.service.js';
import {
  deleteAccountSchema,
  loginSchema,
  registerSchema,
  resendVerificationSchema,
  updateAccountSchema,
} from './auth.schema.js';
import type { AuthService } from './auth.service.js';

export class AuthController {
  constructor(
    private auth: AuthService,
    private userService: UserService,
  ) {}

  register = async (req: FastifyRequest, reply: FastifyReply) => {
    const input = parse(registerSchema, req.body);
    await this.auth.register(input);
    return reply.code(201).send({ message: 'Conta criada. Verifique seu email para ativar.' });
  };

  login = async (req: FastifyRequest, reply: FastifyReply) => {
    const input = parse(loginSchema, req.body);
    const user = await this.auth.login(input);
    await req.session.regenerate();
    req.session.userId = user.id;
    return reply.send(user);
  };

  logout = async (req: FastifyRequest, reply: FastifyReply) => {
    await req.session.destroy();
    return reply.code(204).send();
  };

  me = async (req: FastifyRequest, _reply: FastifyReply) => {
    const user = await this.userService.getById(req.session.userId as string);
    return user;
  };

  verifyEmail = async (req: FastifyRequest, reply: FastifyReply) => {
    const { token } = req.query as { token: string };
    await this.auth.verifyEmail(token);
    return reply.send({ message: 'Email verificado com sucesso.' });
  };

  resendVerification = async (req: FastifyRequest, reply: FastifyReply) => {
    const input = parse(resendVerificationSchema, req.body);
    await this.auth.resendVerification(input);
    return reply.send({
      message: 'Se o email existir e não estiver verificado, um novo link foi enviado.',
    });
  };

  updateAccount = async (req: FastifyRequest, reply: FastifyReply) => {
    const input = parse(updateAccountSchema, req.body);
    const result = await this.auth.updateAccount(req.session.userId as string, input);
    return reply.send(result);
  };

  deleteAccount = async (req: FastifyRequest, reply: FastifyReply) => {
    const input = parse(deleteAccountSchema, req.body);
    await this.auth.deleteAccount(req.session.userId as string, input);
    await req.session.destroy();
    return reply.code(204).send();
  };

  consent = async (req: FastifyRequest, reply: FastifyReply) => {
    await this.userService.consent(req.session.userId as string);
    return reply.code(204).send();
  };

  exportData = async (req: FastifyRequest, reply: FastifyReply) => {
    const data = await this.auth.exportData(req.session.userId as string);
    return reply
      .header('Content-Disposition', 'attachment; filename="zerado-dados.json"')
      .send(data);
  };
}
