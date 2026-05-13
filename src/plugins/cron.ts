import { Cron } from 'croner';
import fp from 'fastify-plugin';

export default fp(async (app) => {
  const jobs: Cron[] = [];

  jobs.push(
    new Cron('0 * * * *', { name: 'hourly-heartbeat' }, () => {
      app.log.info('cron: heartbeat horário');
    }),
  );

  app.addHook('onClose', async () => {
    for (const j of jobs) j.stop();
  });
});
