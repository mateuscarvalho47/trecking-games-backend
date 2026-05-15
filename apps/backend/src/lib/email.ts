import { Resend } from 'resend';
import { env } from '@/config/env.js';

const resend = new Resend(env.RESEND_API_KEY);

export async function sendVerificationEmail(to: string, token: string) {
  const url = `${env.APP_URL}/verify-email?token=${token}`;

  await resend.emails.send({
    from: 'Ludex <noreply@ludex.app>',
    to,
    subject: 'Confirme seu email — Ludex',
    html: `
      <p>Bem-vindo ao Ludex!</p>
      <p>Clique no link abaixo para confirmar seu email:</p>
      <a href="${url}">${url}</a>
      <p>O link expira em 24 horas.</p>
    `,
  });
}
