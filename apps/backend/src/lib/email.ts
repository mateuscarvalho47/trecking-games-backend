import nodemailer from 'nodemailer';
import { env } from '@/config/env.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(to: string, token: string) {
  const url = `${env.APP_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `Ludex <${env.SMTP_USER}>`,
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
