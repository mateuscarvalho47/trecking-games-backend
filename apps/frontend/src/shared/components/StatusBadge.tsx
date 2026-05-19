import { cn } from "@/lib/utils";
import { STATUS_BY_KEY } from "@/shared/constants/statuses";
import { useAppStore } from "@/store/useAppStore";
import type { GameStatus } from "@/types/api";

interface StatusBadgeProps {
	status: GameStatus;
	size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
	const def = STATUS_BY_KEY[status];
	const theme = useAppStore((s) => s.theme);
	const color = theme === "light" ? def.colorLight : def.color;
	const bgColor = theme === "light" ? def.bgColorLight : def.bgColor;
	const borderColor =
		theme === "light" ? def.borderColorLight : def.borderColor;
	return (
		<span
			className={cn(
				"inline-flex items-center px-2 font-semibold tracking-[0.01em] rounded-sm whitespace-nowrap",
				size === "sm" ? "h-5 text-2xs" : "h-[22px] text-[12px]",
			)}
			style={{
				border: `1px solid ${borderColor}`,
				color,
				background: bgColor,
			}}
		>
			{def.label}
		</span>
	);
}
