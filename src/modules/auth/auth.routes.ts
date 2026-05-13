import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { requireAuth } from '@/lib/requireAuth.js';
import { UserRepository } from '@/modules/user/user.repository.js';
import { UserService } from '@/modules/user/user.service.js';
import { AuthController } from './auth.controller.js';
import { loginSchema, registerSchema } from './auth.schema.js';
import { AuthService } from './auth.service.js';

const userResponse = z.object({
  id: z.string(),
  email: z.email(),
  createdAt: z.date(),
});

export async function authRoutes(app: FastifyInstance) {
  const userRepo = new UserRepository(app.prisma);
  const userService = new UserService(userRepo);
  const authService = new AuthService(userRepo);
  const controller = new AuthController(authService, userService);

  app.post('/auth/register', {
    schema: {
      tags: ['auth'],
      summary: 'Registrar usuário',
      body: registerSchema,
      response: { 201: userResponse },
    },
    handler: controller.register,
  });

  app.post('/auth/login', {
    schema: {
      tags: ['auth'],
      summary: 'Login',
      body: loginSchema,
      response: {
        200: z.object({
          user: z.object({ id: z.string(), email: z.string() }),
        }),
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
