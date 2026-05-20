import { cva, type VariantProps } from "class-variance-authority";
import { STATUS_BY_KEY } from "@/shared/constants/statuses";
import { useAppStore } from "@/store/useAppStore";
import type { GameStatus } from "@/types/api";

const badge = cva(
	"inline-flex items-center px-2 text-2xs leading-none font-semibold tracking-[0.01em] rounded-sm whitespace-nowrap",
	{
		variants: {
			size: {
				sm: "h-5",
				md: "h-[22px]",
			},
		},
		defaultVariants: {
			size: "md",
		},
	},
);

type BadgeVariants = VariantProps<typeof badge>;

interface StatusBadgeProps extends BadgeVariants {
	status: GameStatus;
}

export function StatusBadge({ status, size }: StatusBadgeProps) {
	const def = STATUS_BY_KEY[status];
	const theme = useAppStore((s) => s.theme);
	const color = theme === "light" ? def.colorLight : def.color;
	const bgColor = theme === "light" ? def.bgColorLight : def.bgColor;
	const borderColor =
		theme === "light" ? def.borderColorLight : def.borderColor;
	return (
		<span
			className={badge({ size })}
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
