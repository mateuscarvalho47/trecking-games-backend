import { z } from 'zod';

// Auth
export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(100),
});

export const loginSchema = registerSchema;

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

// Library
export const LibraryStatusEnum = z.enum([
  'WISHLIST',
  'BACKLOG',
  'PLAYING',
  'PAUSED',
  'COMPLETED',
  'DROPPED',
]);

export type LibraryStatus = z.infer<typeof LibraryStatusEnum>;

export const createLibraryEntryInput = z.object({
  igdbId: z.number().int().positive(),
  status: LibraryStatusEnum,
  userPlatform: z.string().optional(),
});

export const updateLibraryEntryInput = z
  .object({
    status: LibraryStatusEnum,
    userPlatform: z.string().nullable(),
    rating: z.number().int().min(0).max(10).nullable(),
    hoursPlayed: z.number().min(0).nullable(),
    notes: z.string().nullable(),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, { message: 'At least one field required' });

export type CreateLibraryEntryInput = z.infer<typeof createLibraryEntryInput>;
export type UpdateLibraryEntryInput = z.infer<typeof updateLibraryEntryInput>;

export const libraryStatsSchema = z.object({
  totalGames: z.number(),
  totalHours: z.number(),
  countByStatus: z.record(LibraryStatusEnum, z.number()),
  topGenres: z.array(z.object({ genre: z.string(), count: z.number() })),
  topPlatforms: z.array(z.object({ platform: z.string(), count: z.number() })),
  ratingDistribution: z.array(z.object({ rating: z.number(), count: z.number() })),
  completedTimeline: z.array(z.object({ month: z.string(), count: z.number() })),
});

export type LibraryStats = z.infer<typeof libraryStatsSchema>;

// Game
export const searchQuerySchema = z.object({
  q: z.string().min(2),
});

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

export type SearchQuery = z.infer<typeof searchQuerySchema>;
export type GameSearchResult = z.infer<typeof gameSearchResultSchema>;
export type GameDetail = z.infer<typeof gameDetailSchema>;
