import { z } from 'zod';

export const hltbTimesSchema = z.object({
  mainHours: z.number().nullable(),
  mainExtraHours: z.number().nullable(),
  completionistHours: z.number().nullable(),
});

export type HltbTimes = z.infer<typeof hltbTimesSchema>;
