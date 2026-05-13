import { z } from 'zod';

export const LibraryStatusEnum = z.enum([
  'WISHLIST',
  'BACKLOG',
  'PLAYING',
  'PAUSED',
  'COMPLETED',
  'DROPPED',
]);

export type LibraryStatus = z.infer<typeof LibraryStatusEnum>;

export const LibraryEntrySchema = z.object({
  id: z.string(),
  userId: z.string(),
  igdbId: z.number(),
  name: z.string(),
  coverUrl: z.string().nullable(),
  genres: z.array(z.string()),
  platforms: z.array(z.string()),
  status: LibraryStatusEnum,
  userPlatform: z.string().nullable(),
  rating: z.number().nullable(),
  hoursPlayed: z.preprocess((v) => (v != null ? Number(v) : null), z.number().nullable()),
  notes: z.string().nullable(),
  completedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type LibraryEntry = z.infer<typeof LibraryEntrySchema>;

export const CreateLibraryEntryInput = z.object({
  igdbId: z.number().int().positive(),
  status: LibraryStatusEnum,
  userPlatform: z.string().optional(),
});

export const UpdateLibraryEntryInput = z
  .object({
    status: LibraryStatusEnum,
    userPlatform: z.string().nullable(),
    rating: z.number().int().min(0).max(10).nullable(),
    hoursPlayed: z.number().min(0).nullable(),
    notes: z.string().nullable(),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, { message: 'At least one field required' });

export const LibraryListQuery = z.object({});

export const LibraryStatsSchema = z.object({
  totalGames: z.number(),
  totalHours: z.number(),
  countByStatus: z.record(LibraryStatusEnum, z.number()),
  topGenres: z.array(z.object({ genre: z.string(), count: z.number() })),
  topPlatforms: z.array(z.object({ platform: z.string(), count: z.number() })),
  ratingDistribution: z.array(z.object({ rating: z.number(), count: z.number() })),
  completedTimeline: z.array(z.object({ month: z.string(), count: z.number() })),
});

export type LibraryStats = z.infer<typeof LibraryStatsSchema>;

export type CreateLibraryEntryInput = z.infer<typeof CreateLibraryEntryInput>;
export type UpdateLibraryEntryInput = z.infer<typeof UpdateLibraryEntryInput>;
