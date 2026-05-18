export function formatHours(hours: number | null | undefined): string {
	if (hours == null || hours <= 0) return "—";
	return `${hours}h`;
}
