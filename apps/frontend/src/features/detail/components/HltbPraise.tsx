interface HltbPraiseProps {
	hoursPlayed: number;
	hltbMain: number;
}

function buildMessage(diffPct: number): string {
	const abs = Math.round(Math.abs(diffPct));
	if (diffPct >= 50) {
		return `Você zerou ${abs}% mais rápido que a maioria. Speedrun de respeito!`;
	}
	if (diffPct >= 20) {
		return `${abs}% mais rápido que a média. Mão calejada, hein?`;
	}
	if (diffPct >= -10) {
		return "Ritmo bem no compasso da galera. Zerada redonda!";
	}
	if (diffPct >= -40) {
		return `Você levou ${abs}% a mais que a média — aproveitou cada detalhe.`;
	}
	return `${abs}% acima da média. Baita exploração, nada passou batido!`;
}

export function HltbPraise({ hoursPlayed, hltbMain }: HltbPraiseProps) {
	const diffPct = ((hltbMain - hoursPlayed) / hltbMain) * 100;
	const message = buildMessage(diffPct);

	return (
		<div className="mt-2 bg-bg-2 border border-border-soft rounded-md px-3.5 py-2.5">
			<div className="text-heading font-semibold text-text-hi">{message}</div>
			<div className="mono-label text-text-lo text-overline mt-1">
				{hoursPlayed}h · média {hltbMain}h
			</div>
		</div>
	);
}
