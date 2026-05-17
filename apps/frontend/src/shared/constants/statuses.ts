import type { GameStatus } from "@/types/api";

export interface StatusDef {
	key: GameStatus;
	label: string;
	hue: number;
	color: string;
	bgColor: string;
	borderColor: string;
	colorLight: string;
	bgColorLight: string;
	borderColorLight: string;
}

export const STATUSES: StatusDef[] = [
	{
		key: "WISHLIST",
		label: "Wishlist",
		hue: 75,
		color: "oklch(0.88 0.18 75)",
		bgColor: "oklch(0.3 0.08 75 / 0.3)",
		borderColor: "oklch(0.5 0.15 75 / 0.5)",
		colorLight: "oklch(0.28 0.18 75)",
		bgColorLight: "oklch(0.88 0.05 75 / 0.35)",
		borderColorLight: "oklch(0.65 0.12 75 / 0.5)",
	},
	{
		key: "BACKLOG",
		label: "Fila",
		hue: 260,
		color: "oklch(0.88 0.18 260)",
		bgColor: "oklch(0.3 0.08 260 / 0.3)",
		borderColor: "oklch(0.5 0.15 260 / 0.5)",
		colorLight: "oklch(0.28 0.18 260)",
		bgColorLight: "oklch(0.88 0.05 260 / 0.35)",
		borderColorLight: "oklch(0.65 0.12 260 / 0.5)",
	},
	{
		key: "PLAYING",
		label: "Jogando",
		hue: 195,
		color: "oklch(0.88 0.18 195)",
		bgColor: "oklch(0.3 0.08 195 / 0.3)",
		borderColor: "oklch(0.5 0.15 195 / 0.5)",
		colorLight: "oklch(0.28 0.18 195)",
		bgColorLight: "oklch(0.88 0.05 195 / 0.35)",
		borderColorLight: "oklch(0.65 0.12 195 / 0.5)",
	},
	{
		key: "PAUSED",
		label: "Pausado",
		hue: 200,
		color: "oklch(0.88 0.18 200)",
		bgColor: "oklch(0.3 0.08 200 / 0.3)",
		borderColor: "oklch(0.5 0.15 200 / 0.5)",
		colorLight: "oklch(0.28 0.18 200)",
		bgColorLight: "oklch(0.88 0.05 200 / 0.35)",
		borderColorLight: "oklch(0.65 0.12 200 / 0.5)",
	},
	{
		key: "COMPLETED",
		label: "Completo",
		hue: 145,
		color: "oklch(0.88 0.18 145)",
		bgColor: "oklch(0.3 0.08 145 / 0.3)",
		borderColor: "oklch(0.5 0.15 145 / 0.5)",
		colorLight: "oklch(0.28 0.18 145)",
		bgColorLight: "oklch(0.88 0.05 145 / 0.35)",
		borderColorLight: "oklch(0.65 0.12 145 / 0.5)",
	},
	{
		key: "DROPPED",
		label: "Abandonado",
		hue: 25,
		color: "oklch(0.88 0.18 25)",
		bgColor: "oklch(0.3 0.08 25 / 0.3)",
		borderColor: "oklch(0.5 0.15 25 / 0.5)",
		colorLight: "oklch(0.28 0.18 25)",
		bgColorLight: "oklch(0.88 0.05 25 / 0.35)",
		borderColorLight: "oklch(0.65 0.12 25 / 0.5)",
	},
];

export const STATUS_BY_KEY = Object.fromEntries(
	STATUSES.map((s) => [s.key, s]),
) as Record<GameStatus, StatusDef>;
