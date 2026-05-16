import { z } from "zod";

export const detailSchema = z.object({
	status: z.enum([
		"WISHLIST",
		"BACKLOG",
		"PLAYING",
		"PAUSED",
		"COMPLETED",
		"DROPPED",
	]),
	userPlatform: z.string(),
	rating: z.number().min(0).max(10),
	hoursPlayed: z.number().min(0),
	notes: z.string(),
	completedAt: z.string(),
});

export type DetailFormValues = z.infer<typeof detailSchema>;
