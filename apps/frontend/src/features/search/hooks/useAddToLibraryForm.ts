import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
		try {
			await mutation.mutateAsync({
				igdbId: game.igdbId,
				status: values.status,
				userPlatform: values.userPlatform,
			});
			toast.success("Adicionado à biblioteca!");
			onAdded(game.igdbId);
		} catch (err) {
			toast.error((err as Error).message ?? "Erro ao adicionar jogo");
		}
	});

	return { form, onSubmit, isPending: mutation.isPending };
}
