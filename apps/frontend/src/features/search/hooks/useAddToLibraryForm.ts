import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAddToLibrary } from "@/features/library/hooks/useLibrary";
import type { GameSearchResult } from "@/types/api";
import {
	type AddToLibraryFormValues,
	addToLibrarySchema,
} from "../schema/addToLibrarySchema";

export function useAddToLibraryForm(
	game: GameSearchResult,
	onAdded: (igdbId: number) => void,
) {
	const mutation = useAddToLibrary();

	const form = useForm<AddToLibraryFormValues>({
		resolver: zodResolver(addToLibrarySchema),
		defaultValues: {
			status: "BACKLOG",
			userPlatform: game.platforms[0] ?? "",
		},
	});

	const onSubmit = form.handleSubmit(async (values) => {
		await mutation.mutateAsync({
			igdbId: game.igdbId,
			status: values.status,
			userPlatform: values.userPlatform,
		});
		onAdded(game.igdbId);
	});

	return { form, onSubmit, isPending: mutation.isPending };
}
