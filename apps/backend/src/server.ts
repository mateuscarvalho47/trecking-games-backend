import { buildApp } from '@/app.js';
import { env } from '@/config/env.js';

const app = await buildApp();

try {
  await app.listen({ port: env.PORT, host: '0.0.0.0' });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}

for (const sig of ['SIGINT', 'SIGTERM'] as const) {
  process.on(sig, async () => {
    app.log.info(`recebido ${sig}, encerrando`);
    await app.close();
    process.exit(0);
  });
}
