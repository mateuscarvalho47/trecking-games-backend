import { Button } from "@/components/ui/button";
import { Cover } from "@/shared/components/Cover";
import { HltbStat } from "@/shared/components/HltbStat";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { STATUS_BY_KEY } from "@/shared/constants/statuses";
import type { LibraryEntry } from "@/types/api";
import type { DetailFormValues } from "../schema/detailSchema";
import { HltbPraise } from "./HltbPraise";

interface DetailHeroProps {
	game: LibraryEntry;
	status: DetailFormValues["status"];
	saved: boolean;
	theme: "light" | "dark";
	onBack: () => void;
	onRemove: () => void;
}

export function DetailHero({
	game,
	status,
	saved,
	theme,
	onBack,
	onRemove,
}: DetailHeroProps) {
	const statusDef = STATUS_BY_KEY[status];
	const coverData = {
		hue: STATUS_BY_KEY[status]?.hue ?? 280,
		scheme: "duotone" as const,
		glyph: game.name[0],
	};

	return (
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
					onClick={onBack}
					className="backdrop-blur-sm bg-bg-1/90 border-border-strong text-text-hi hover:bg-bg-1"
				>
					← Biblioteca
				</Button>
				<div className="flex gap-2 items-center">
					{saved && (
						<span
							className="inline-flex items-center gap-1.5 font-mono text-[11.5px] rounded-[5px] py-0.5 px-2"
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
						onClick={onRemove}
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
				<div className="w-35 md:w-auto aspect-3/4 rounded-md overflow-hidden shadow-[0_28px_60px_oklch(0_0_0/0.6)] shrink-0">
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
					<h1 className="text-[29px] md:text-[43px] font-bold leading-[1.05] m-0 text-text-hi tracking-[-0.035em]">
						{game.name}
					</h1>
					<div className="text-text-md text-[14.5px]">
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
								val: game.hoursPlayed != null ? `${game.hoursPlayed}h` : "—",
							},
						].map(({ label, val }) => (
							<div key={label} className="flex flex-col gap-1.5">
								<div className="mono-label">{label}</div>
								<div className="text-[15px] text-text-hi">{val}</div>
							</div>
						))}
					</div>

					{(game.hltbMain != null ||
						game.hltbMainExtra != null ||
						game.hltbCompletionist != null) && (
						<div className="mt-2">
							<div className="mono-label mb-1.5">Tempo para zerar</div>
							<div className="grid grid-cols-3 gap-2">
								<HltbStat label="Main" hours={game.hltbMain} />
								<HltbStat label="Main + Extra" hours={game.hltbMainExtra} />
								<HltbStat label="Completista" hours={game.hltbCompletionist} />
							</div>
						</div>
					)}

					{status === "COMPLETED" &&
						game.hoursPlayed != null &&
						game.hoursPlayed > 0 &&
						game.hltbMain != null &&
						game.hltbMain > 0 && (
							<HltbPraise
								hoursPlayed={game.hoursPlayed}
								hltbMain={game.hltbMain}
							/>
						)}
				</div>
			</div>
		</div>
	);
}
