import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { STATUSES } from "@/shared/constants/statuses";
import { useAppStore } from "@/store/useAppStore";
import type { GameStatus, LibraryEntry } from "@/types/api";

interface StatusPillsProps {
	library: LibraryEntry[];
	active: GameStatus | null;
	onChange: (s: GameStatus | null) => void;
}

export function StatusPills({ library, active, onChange }: StatusPillsProps) {
	const theme = useAppStore((s) => s.theme);
	const total = library.length;
	const countByStatus = useMemo(() => {
		const counts = {} as Record<GameStatus, number>;
		for (const g of library) counts[g.status] = (counts[g.status] ?? 0) + 1;
		return counts;
	}, [library]);

	return (
		<div className="flex gap-1 flex-wrap">
			<button
				type="button"
				onClick={() => onChange(null)}
				className={cn(
					"inline-flex items-center gap-1.5 h-7.5 px-3 rounded-full text-[13.5px] font-medium cursor-pointer transition-all border",
					active === null
						? "text-text-hi border-border-strong bg-bg-3/50"
						: "text-text-md border-border-soft bg-bg-1",
				)}
				style={{ fontFamily: "inherit" }}
			>
				Todos
				<span
					className={cn(
						"text-[11.5px] pl-1.5 ml-0.5 border-l border-border-soft",
						active === null ? "text-text-md" : "text-text-lo",
					)}
				>
					{total}
				</span>
			</button>

			{STATUSES.map((s) => {
				const count = countByStatus[s.key] ?? 0;
				const isActive = active === s.key;
				return (
					<button
						type="button"
						key={s.key}
						onClick={() => onChange(isActive ? null : s.key)}
						className={cn(
							"inline-flex items-center gap-1.5 h-7.5 px-3 rounded-full text-[13.5px] font-medium cursor-pointer transition-all border",
							isActive
								? "border-transparent"
								: "text-text-md border-border-soft bg-bg-1",
						)}
						style={
							isActive
								? theme === "light"
									? {
											background: s.bgColorLight,
											borderColor: s.borderColorLight,
											color: s.colorLight,
											fontFamily: "inherit",
										}
									: {
											background: `oklch(0.25 0.06 ${s.hue} / 0.5)`,
											borderColor: `oklch(0.5 0.15 ${s.hue} / 0.55)`,
											color: "oklch(0.96 0.006 75)",
											fontFamily: "inherit",
										}
								: { fontFamily: "inherit" }
						}
					>
						{s.label}
						<span className="text-[11.5px] pl-1.5 ml-0.5 border-l border-border-soft text-text-lo">
							{count}
						</span>
					</button>
				);
			})}
		</div>
	);
}
