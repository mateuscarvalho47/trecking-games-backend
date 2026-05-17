import { Resend } from 'resend';
import { env } from '@/config/env.js';

const resend = new Resend(env.RESEND_API_KEY);

export async function sendVerificationEmail(to: string, token: string) {
  const url = `${env.APP_URL}/verify-email?token=${token}`;

  const { error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to,
    subject: 'Confirme seu email — Zerado',
    html: `
      <p>Bem-vindo ao Zerado!</p>
      <p>Clique no link abaixo para confirmar seu email:</p>
      <a href="${url}">${url}</a>
      <p>O link expira em 24 horas.</p>
    `,
  });

  if (error) {
    console.error('[email] resend error for %s: %o', to, error);
    throw new Error(error.message);
  }

  console.info('[email] verification sent to %s', to);
}
