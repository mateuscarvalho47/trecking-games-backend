import { createFileRoute } from "@tanstack/react-router";
import { DetailScreen } from "@/features/detail/components/DetailScreen";
import { useLibraryEntry } from "@/features/detail/hooks/useLibraryEntry";

export const Route = createFileRoute("/library/$igdbId")({
	component: DetailPage,
});

function DetailPage() {
	const { igdbId } = Route.useParams();
	const { data: game, isLoading, error } = useLibraryEntry(Number(igdbId));

	if (isLoading) {
		return (
			<div style={{ padding: "28px 22px" }}>
				<div
					style={{
						height: 300,
						background: "oklch(0.16 0.006 280)",
						borderRadius: 14,
					}}
				/>
			</div>
		);
	}

	if (error || !game) {
		return (
			<div
				style={{
					padding: "28px 22px",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: 16,
					paddingTop: 80,
					textAlign: "center",
				}}
			>
				<p style={{ color: "oklch(0.72 0.010 280)", fontSize: 14 }}>
					Jogo não encontrado na biblioteca.
				</p>
			</div>
		);
	}

	return <DetailScreen game={game} />;
}
