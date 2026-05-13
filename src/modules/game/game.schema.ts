import { z } from 'zod';

export const gameSearchResultSchema = z.object({
  igdbId: z.number(),
  name: z.string(),
  coverUrl: z.string().optional(),
  releaseYear: z.number().optional(),
  platforms: z.array(z.string()),
  genres: z.array(z.string()),
});

export const gameDetailSchema = gameSearchResultSchema.extend({
  summary: z.string().optional(),
});

export const searchQuerySchema = z.object({
  q: z.string().min(2),
});

export type GameSearchResult = z.infer<typeof gameSearchResultSchema>;
export type GameDetail = z.infer<typeof gameDetailSchema>;
export type SearchQuery = z.infer<typeof searchQuerySchema>;
