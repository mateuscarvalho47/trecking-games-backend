import { z } from "zod";

export const addToLibrarySchema = z.object({
	status: z.enum([
		"WISHLIST",
		"BACKLOG",
		"PLAYING",
		"PAUSED",
		"COMPLETED",
		"DROPPED",
	]),
	userPlatform: z.string().min(1, "Selecione uma plataforma"),
});

export type AddToLibraryFormValues = z.infer<typeof addToLibrarySchema>;
