import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Cover } from "@/shared/components/Cover";
import { STATUSES } from "@/shared/constants/statuses";
import type { GameSearchResult } from "@/types/api";
import { useAddToLibraryForm } from "../hooks/useAddToLibraryForm";

interface AddToLibraryModalProps {
	game: GameSearchResult;
	onClose: () => void;
	onAdded: (igdbId: number) => void;
}

export function AddToLibraryModal({
	game,
	onClose,
	onAdded,
}: AddToLibraryModalProps) {
	const { form, onSubmit, isPending } = useAddToLibraryForm(game, onAdded);
	const { control } = form;

	return (
		<Dialog
			open
			onOpenChange={(open) => {
				if (!open) onClose();
			}}
		>
			<DialogContent
				className="p-0 gap-0 max-w-180 bg-bg-1 border border-border rounded-xl"
				style={{
					boxShadow:
						"0 1px 0 oklch(1 0 0 / 0.06) inset, 0 24px 60px oklch(0 0 0 / 0.55)",
				}}
			>
				<DialogHeader className="px-4.5 py-3.5 border-b border-border-soft">
					<DialogTitle className="text-[14px] text-text-hi">
						Adicionar à biblioteca
					</DialogTitle>
				</DialogHeader>

				<form
					onSubmit={onSubmit}
					className="flex flex-col sm:grid sm:gap-7 gap-5 p-5 sm:p-6"
					style={{ gridTemplateColumns: "200px 1fr" }}
				>
					{/* Cover */}
					<div className="w-[120px] sm:w-auto aspect-3/4 rounded-md overflow-hidden mx-auto sm:mx-0">
						<Cover
							game={{
								name: game.name,
								year: game.releaseYear,
								platforms: game.platforms,
								cover: { hue: 295, scheme: "duotone", glyph: game.name[0] },
								coverUrl: game.coverUrl,
							}}
							size="lg"
						/>
					</div>

					{/* Form fields */}
					<div className="flex flex-col gap-4">
						<div>
							<div className="mono-label text-accent-bright">
								{game.genres.slice(0, 2).join(" · ")}
							</div>
							<h2 className="text-[22px] font-semibold tracking-tight mt-1 mb-0 text-text-hi">
								{game.name}
							</h2>
							<div className="text-[12.5px] text-text-md font-mono mt-0.5">
								{game.releaseYear ?? "TBA"} ·{" "}
								{game.platforms.slice(0, 3).join(", ")}
							</div>
						</div>

						{/* Status picker */}
						<div>
							<Label className="mono-label block mb-2">Status</Label>
							<Controller
								control={control}
								name="status"
								render={({ field }) => (
									<div className="grid grid-cols-2 gap-1.5">
										{STATUSES.map((s) => (
											<button
												type="button"
												key={s.key}
												onClick={() => field.onChange(s.key)}
												className="flex items-center gap-2 h-8 px-2.5 rounded-[7px] cursor-pointer text-[12px] font-medium border-0"
												style={{
													background:
														field.value === s.key
															? `oklch(0.3 0.06 ${s.hue} / 0.35)`
															: "oklch(0.19 0.009 28)",
													border: `1px solid ${field.value === s.key ? `oklch(0.6 0.15 ${s.hue} / 0.5)` : "oklch(0.22 0.009 28)"}`,
													color:
														field.value === s.key
															? `oklch(0.92 0.05 ${s.hue})`
															: "oklch(0.72 0.012 75)",
													fontFamily: "inherit",
												}}
											>
												<div
													className="size-1.5 rounded-full shrink-0"
													style={{ background: s.color }}
												/>
												{s.label}
											</button>
										))}
									</div>
								)}
							/>
						</div>

						{/* Platform */}
						<div>
							<Label className="mono-label block mb-1.5">Plataforma</Label>
							<Controller
								control={control}
								name="userPlatform"
								render={({ field }) => (
									<div className="relative">
										<select
											{...field}
											className="w-full h-9.5 px-3 pr-8 bg-bg-2 border border-border rounded-[8px] text-text-hi text-[13.5px] appearance-none cursor-pointer outline-none focus:border-accent"
											style={{ fontFamily: "inherit" }}
										>
											{game.platforms.map((p) => (
												<option key={p} value={p} className="bg-bg-2">
													{p}
												</option>
											))}
										</select>
										<div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-lo text-[11px]">
											▾
										</div>
									</div>
								)}
							/>
						</div>

						<div className="flex gap-2.5 justify-end mt-2">
							<Button
								type="button"
								variant="ghost"
								onClick={onClose}
								className="h-9 border border-border text-text-md rounded-[8px]"
							>
								Cancelar
							</Button>
							<Button
								variant="accent"
								type="submit"
								disabled={isPending}
								className="h-9 rounded-[8px]"
							>
								{isPending ? "Adicionando..." : "Adicionar"}
							</Button>
						</div>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
