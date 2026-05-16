import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { requireAuth } from '@/lib/requireAuth.js';
import { UserRepository } from '@/modules/user/user.repository.js';
import { UserService } from '@/modules/user/user.service.js';
import { AuthController } from './auth.controller.js';
import { loginSchema, registerSchema, resendVerificationSchema } from './auth.schema.js';
import { AuthService } from './auth.service.js';

const userResponse = z.object({
  id: z.string(),
  email: z.email(),
  createdAt: z.date(),
});

const messageResponse = z.object({ message: z.string() });

export async function authRoutes(app: FastifyInstance) {
  const userRepo = new UserRepository(app.prisma);
  const userService = new UserService(userRepo);
  const authService = new AuthService(userRepo);
  const controller = new AuthController(authService, userService);

  app.post('/auth/register', {
    config: { rateLimit: { max: 5, timeWindow: '1 minute' } },
    schema: {
      tags: ['auth'],
      summary: 'Registrar usuário',
      body: registerSchema,
      response: { 201: messageResponse },
    },
    handler: controller.register,
  });

  app.get('/auth/verify-email', {
    schema: {
      tags: ['auth'],
      summary: 'Verificar email',
      querystring: z.object({ token: z.string().min(1) }),
      response: { 200: messageResponse },
    },
    handler: controller.verifyEmail,
  });

  app.post('/auth/resend-verification', {
    config: { rateLimit: { max: 3, timeWindow: '5 minutes' } },
    schema: {
      tags: ['auth'],
      summary: 'Reenviar email de verificação',
      body: resendVerificationSchema,
      response: { 200: messageResponse },
    },
    handler: controller.resendVerification,
  });

  app.post('/auth/login', {
    config: { rateLimit: { max: 10, timeWindow: '1 minute' } },
    schema: {
      tags: ['auth'],
      summary: 'Login',
      body: loginSchema,
      response: {
        200: z.object({ id: z.string(), email: z.string() }),
      },
    },
    handler: controller.login,
  });

  app.post('/auth/logout', {
    schema: { tags: ['auth'], summary: 'Logout', response: { 204: z.null() } },
    handler: controller.logout,
  });

  app.get('/auth/me', {
    schema: {
      tags: ['auth'],
      summary: 'Usuário atual',
      security: [{ sessionCookie: [] }],
      response: { 200: userResponse },
    },
    preHandler: requireAuth,
    handler: controller.me,
  });
}
