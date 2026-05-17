import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Cover } from "@/shared/components/Cover";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { STATUS_BY_KEY, STATUSES } from "@/shared/constants/statuses";
import { useAppStore } from "@/store/useAppStore";
import type { LibraryEntry } from "@/types/api";
import { useDetailForm } from "../hooks/useDetailForm";
import { useRemoveLibraryEntry } from "../hooks/useLibraryEntry";
import { ConfirmRemoveModal } from "./ConfirmRemoveModal";

const RATING_TICKS = Array.from({ length: 9 }, (_, i) => i);

function getCoverData(game: LibraryEntry) {
	return {
		hue: STATUS_BY_KEY[game.status]?.hue ?? 280,
		scheme: "duotone" as const,
		glyph: game.name[0],
	};
}

interface DetailScreenProps {
	game: LibraryEntry;
}

export function DetailScreen({ game }: DetailScreenProps) {
	const navigate = useNavigate();
	const remove = useRemoveLibraryEntry(game.id);
	const [confirmRemove, setConfirmRemove] = useState(false);

	const { form, saved } = useDetailForm(game);
	const { control, register, watch } = form;

	const theme = useAppStore((s) => s.theme);
	const status = watch("status");
	const rating = watch("rating");
	const coverData = getCoverData({ ...game, status });
	const statusDef = STATUS_BY_KEY[status];

	return (
		<>
			<div>
				{/* Hero */}
				<div className="relative overflow-hidden px-5.5">
					{/* Blurred bg */}
					<div className="absolute inset-0 z-0 overflow-hidden blur-[60px] saturate-140 opacity-55 scale-[1.2]">
						<Cover
							game={{
								name: game.name,
								platforms: game.platforms,
								cover: coverData,
								coverUrl: game.coverUrl,
							}}
							size="hero"
							withTitle={false}
						/>
					</div>
					{/* Overlay */}
					<div
						className="absolute inset-0 z-10"
						style={{
							background:
								"linear-gradient(180deg, var(--color-hero-overlay-start) 0%, var(--color-hero-overlay-end) 90%)",
						}}
					/>

					{/* Bar */}
					<div className="relative z-20 flex justify-between items-center py-5">
						<Button
							variant="outline"
							size="sm"
							onClick={() => navigate({ to: "/library" })}
							className="backdrop-blur-sm bg-bg-1/90 border-border-strong text-text-hi hover:bg-bg-1"
						>
							← Biblioteca
						</Button>
						<div className="flex gap-2 items-center">
							{saved && (
								<span
									className="inline-flex items-center gap-1.5 font-mono text-[10.5px] rounded-[5px] py-0.5 px-2"
									style={{
										color: "var(--color-accent-bright)",
										background: "var(--color-accent-soft)",
										border: "1px solid var(--color-accent-rim)",
									}}
								>
									✓ Salvo
								</span>
							)}
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setConfirmRemove(true)}
								className="backdrop-blur-sm bg-bg-1/90 border border-border-strong hover:bg-bg-1"
								style={{
									color:
										theme === "light"
											? "oklch(0.48 0.18 25)"
											: "oklch(0.75 0.14 25)",
								}}
							>
								Remover
							</Button>
						</div>
					</div>

					{/* Content */}
					<div className="relative z-20 flex flex-col md:grid md:grid-cols-[260px_1fr] gap-6 md:gap-9 py-7 pb-10 items-center md:items-start">
						{/* Cover */}
						<div className="w-[140px] md:w-auto aspect-3/4 rounded-md overflow-hidden shadow-[0_28px_60px_oklch(0_0_0/0.6)] shrink-0">
							<Cover
								game={{
									name: game.name,
									year: undefined,
									platforms: game.platforms,
									cover: coverData,
									coverUrl: game.coverUrl,
								}}
								size="lg"
							/>
						</div>

						{/* Head info */}
						<div className="flex flex-col gap-3.5 pt-2 w-full text-center md:text-left">
							<div className="mono-label">{game.genres.join(" · ")}</div>
							<h1 className="text-[28px] md:text-[42px] font-bold leading-[1.05] m-0 text-text-hi tracking-[-0.035em]">
								{game.name}
							</h1>
							<div className="text-text-md text-[13.5px]">
								{game.platforms.join(" · ")}
							</div>
							<div className="flex gap-1.5 flex-wrap justify-center md:justify-start">
								<StatusBadge status={status} />
							</div>

							{/* Quick stats */}
							<div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-2 p-4 border border-border-soft rounded-md backdrop-blur-sm bg-bg-1/70 text-left">
								{[
									{ label: "Status", val: statusDef.label },
									{ label: "Plataforma", val: game.userPlatform ?? "—" },
									{
										label: "Avaliação",
										val: game.rating != null ? `${game.rating}/10` : "—",
									},
									{
										label: "Horas",
										val:
											game.hoursPlayed != null ? `${game.hoursPlayed}h` : "—",
									},
								].map(({ label, val }) => (
									<div key={label} className="flex flex-col gap-1.5">
										<div className="mono-label">{label}</div>
										<div className="text-[14px] text-text-hi">{val}</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Body — edit form */}
				<div className="px-5.5 py-6 pb-15">
					<div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4.5">
						{/* Edit form */}
						<div className="bg-bg-1 border border-border-soft rounded-lg p-5.5">
							<div className="text-[14.5px] font-semibold tracking-tight text-text-hi mb-5">
								Editar entrada
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">
								{/* Status picker */}
								<div className="col-span-2">
									<Label className="mono-label block mb-1.5">Status</Label>
									<Controller
										control={control}
										name="status"
										render={({ field }) => (
											<div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
												{STATUSES.map((s) => (
													<button
														type="button"
														key={s.key}
														onClick={() => field.onChange(s.key)}
														className="flex items-center gap-2 h-8 px-2.5 rounded-[7px] cursor-pointer text-[12px] font-medium border-0"
														style={
															field.value === s.key
																? {
																		background:
																			theme === "light"
																				? s.bgColorLight
																				: `oklch(0.3 0.06 ${s.hue} / 0.35)`,
																		border: `1px solid ${theme === "light" ? s.borderColorLight : `oklch(0.6 0.15 ${s.hue} / 0.5)`}`,
																		color:
																			theme === "light"
																				? s.colorLight
																				: `oklch(0.92 0.05 ${s.hue})`,
																		fontFamily: "inherit",
																	}
																: {
																		background: "var(--color-bg-2)",
																		border:
																			"1px solid var(--color-border-soft)",
																		color: "var(--color-text-md)",
																		fontFamily: "inherit",
																	}
														}
													>
														<div
															className="size-1.5 rounded-full shrink-0"
															style={{
																background:
																	theme === "light"
																		? s.borderColorLight
																		: s.color,
															}}
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
											<Select
												value={field.value ?? ""}
												onValueChange={field.onChange}
											>
												<SelectTrigger className="w-full h-9.5 bg-bg-2 border-border text-text-hi text-[13.5px] rounded-[8px]">
													<SelectValue placeholder="—" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="">—</SelectItem>
													{game.platforms.map((p) => (
														<SelectItem key={p} value={p}>
															{p}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										)}
									/>
								</div>

								{/* Hours */}
								{["PLAYING", "PAUSED", "COMPLETED", "DROPPED"].includes(
									status,
								) && (
									<div>
										<Label className="mono-label block mb-1.5">
											Horas jogadas
										</Label>
										<Controller
											control={control}
											name="hoursPlayed"
											render={({ field }) => (
												<div className="flex items-center bg-bg-2 border border-border rounded-[8px] h-9.5 overflow-hidden">
													<button
														type="button"
														onClick={() =>
															field.onChange(Math.max(0, field.value - 0.5))
														}
														className="flex items-center justify-center w-9 shrink-0 h-full text-text-dim hover:text-text-hi hover:bg-bg-3 border-r border-border transition-colors cursor-pointer bg-transparent"
													>
														<span className="text-[16px] leading-none select-none">
															−
														</span>
													</button>
													<div className="flex-1 flex items-center justify-center gap-0.5">
														<input
															type="text"
															inputMode="decimal"
															value={field.value || ""}
															onChange={(e) => {
																const val = parseFloat(
																	e.target.value.replace(",", "."),
																);
																field.onChange(
																	Number.isNaN(val) ? 0 : Math.max(0, val),
																);
															}}
															className="w-14 text-center bg-transparent border-0 outline-none text-text-hi text-[13.5px]"
														/>
														<span className="text-text-dim text-[12px]">h</span>
													</div>
													<button
														type="button"
														onClick={() => field.onChange(field.value + 0.5)}
														className="flex items-center justify-center w-9 shrink-0 h-full text-text-dim hover:text-text-hi hover:bg-bg-3 border-l border-border transition-colors cursor-pointer bg-transparent"
													>
														<span className="text-[16px] leading-none select-none">
															+
														</span>
													</button>
												</div>
											)}
										/>
									</div>
								)}

								{/* Rating slider */}
								{["PAUSED", "COMPLETED", "DROPPED"].includes(status) && (
									<div className="col-span-2">
										<div className="flex items-baseline justify-between mb-1.5">
											<Label className="mono-label">Avaliação</Label>
											<span className="text-[16px] text-text-hi">
												<b className="font-bold">{rating}</b>
												<span className="text-[11px] text-text-lo ml-px">
													/10
												</span>
											</span>
										</div>
										<div className="relative h-9 bg-bg-2 border border-border rounded-[8px] overflow-hidden">
											<div
												className="absolute top-0 bottom-0 left-0 pointer-events-none transition-[width] duration-150 gradient-accent-fill"
												style={{ width: `${(rating / 10) * 100}%` }}
											/>
											<div className="absolute inset-0 flex items-center justify-between px-2.5 pointer-events-none">
												{RATING_TICKS.map((i) => (
													<div key={i} className="w-px h-2 bg-border-strong" />
												))}
											</div>
											<Controller
												control={control}
												name="rating"
												render={({ field }) => (
													<input
														type="range"
														min={0}
														max={10}
														step={0.5}
														value={field.value}
														onChange={(e) =>
															field.onChange(parseFloat(e.target.value))
														}
														className="absolute inset-0 w-full h-full appearance-none bg-transparent cursor-pointer m-0 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[3px] [&::-webkit-slider-thumb]:h-9 [&::-webkit-slider-thumb]:rounded-sm [&::-webkit-slider-thumb]:bg-white/60 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-[3px] [&::-moz-range-thumb]:h-9 [&::-moz-range-thumb]:rounded-sm [&::-moz-range-thumb]:bg-white/60 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
													/>
												)}
											/>
										</div>
										<div className="flex justify-between text-[11px] text-text-dim px-0.5 mt-1">
											{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
												<span key={n}>{n}</span>
											))}
										</div>
									</div>
								)}

								{/* Notes */}
								<div className="col-span-2">
									<Label className="mono-label block mb-1.5">Notas</Label>
									<Textarea
										{...register("notes")}
										placeholder="Suas anotações sobre o jogo..."
										rows={4}
										className="bg-bg-2 border-border text-text-hi placeholder:text-text-lo resize-y leading-relaxed"
									/>
								</div>

								{/* Completed at */}
								{status === "COMPLETED" && (
									<div>
										<Label className="mono-label block mb-1.5">
											Data de conclusão
										</Label>
										<Input
											type="date"
											{...register("completedAt")}
											className="bg-bg-2 border-border text-text-hi h-9.5"
										/>
									</div>
								)}
							</div>
						</div>

						{/* Side panel */}
						<div className="bg-bg-1 border border-border-soft rounded-lg p-5.5 self-start">
							<div className="text-[14.5px] font-semibold tracking-tight text-text-hi mb-4">
								Informações
							</div>
							<dl>
								{[
									{ label: "Gêneros", val: game.genres.join(", ") || "—" },
									{
										label: "Plataformas",
										val: game.platforms.join(", ") || "—",
									},
									{
										label: "Adicionado em",
										val: new Date(game.createdAt).toLocaleDateString("pt-BR"),
									},
									{
										label: "Atualizado em",
										val: new Date(game.updatedAt).toLocaleDateString("pt-BR"),
									},
								].map(({ label, val }) => (
									<div
										key={label}
										className="grid grid-cols-[110px_1fr] gap-3 py-2.5 border-b border-border-soft"
									>
										<dt className="mono-label">{label}</dt>
										<dd className="text-[13px] text-text-hi m-0">{val}</dd>
									</div>
								))}
							</dl>
						</div>
					</div>
				</div>
			</div>

			{confirmRemove && (
				<ConfirmRemoveModal
					gameName={game.name}
					onConfirm={async () => {
						await remove.mutateAsync();
						toast.success("Jogo removido da biblioteca");
						navigate({ to: "/library" });
					}}
					onCancel={() => setConfirmRemove(false)}
					isPending={remove.isPending}
				/>
			)}
		</>
	);
}
