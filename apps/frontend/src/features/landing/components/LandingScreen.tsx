import { useNavigate } from "@tanstack/react-router";
import { usePageTitle } from "@/shared/hooks/usePageTitle";

const TILES = [
	{ w: 80, h: 108, top: "6%", left: "4%", hue: 295, r: -8, delay: 0 },
	{ w: 60, h: 80, top: "12%", left: "80%", hue: 145, r: 12, delay: 1.5 },
	{ w: 72, h: 96, top: "62%", left: "88%", hue: 25, r: -5, delay: 0.8 },
	{ w: 64, h: 86, top: "70%", left: "3%", hue: 75, r: 7, delay: 2.1 },
	{ w: 52, h: 70, top: "38%", left: "92%", hue: 260, r: -14, delay: 1.1 },
	{ w: 56, h: 76, top: "28%", left: "2%", hue: 200, r: 10, delay: 0.4 },
	{ w: 44, h: 60, top: "50%", left: "85%", hue: 320, r: 6, delay: 1.8 },
	{ w: 68, h: 90, top: "80%", left: "70%", hue: 180, r: -10, delay: 0.6 },
];

const FEATURES = [
	{
		icon: "📚",
		label: "Biblioteca",
		desc: "Organize todos seus jogos por status — jogando, zerado, backlog.",
	},
	{
		icon: "📊",
		label: "Estatísticas",
		desc: "Visualize horas jogadas, plataformas e histórico ao longo do tempo.",
	},
	{
		icon: "🔍",
		label: "Busca rápida",
		desc: "Encontre qualquer jogo com Ctrl+K e adicione em segundos.",
	},
];

export function LandingScreen() {
	usePageTitle();
	const navigate = useNavigate();

	return (
		<div className="relative min-h-screen flex flex-col items-center justify-center px-5 py-16 bg-bg-0 overflow-hidden">
			<style>{`
        @keyframes tilefloat {
          0%   { transform: translateY(0) rotate(var(--tr)); }
          100% { transform: translateY(-12px) rotate(var(--tr)); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

			{/* Grid background */}
			<div
				className="absolute inset-0 pointer-events-none opacity-30"
				style={{
					backgroundImage: `
            linear-gradient(90deg, var(--color-grid-line) 1px, transparent 1px),
            linear-gradient(0deg, var(--color-grid-line) 1px, transparent 1px)
          `,
					backgroundSize: "48px 48px",
					maskImage:
						"radial-gradient(ellipse at center, black 30%, transparent 75%)",
				}}
			/>

			{/* Glow */}
			<div
				className="absolute pointer-events-none"
				style={{
					top: "40%",
					left: "50%",
					width: "90vw",
					height: "90vw",
					transform: "translate(-50%, -50%)",
					background:
						"radial-gradient(circle, var(--color-glow-accent) 0%, transparent 50%)",
				}}
			/>

			{/* Floating tiles */}
			{TILES.map((t) => (
				<div
					key={`${t.top}-${t.left}`}
					className="absolute rounded-sm"
					style={
						{
							width: t.w,
							height: t.h,
							top: t.top,
							left: t.left,
							border: `1px solid oklch(0.6 0.18 ${t.hue} / 0.25)`,
							background: `oklch(0.3 0.12 ${t.hue} / 0.1)`,
							filter: "blur(0.5px)",
							"--tr": `${t.r}deg`,
							animation: `tilefloat 10s ease-in-out ${t.delay}s infinite alternate`,
						} as React.CSSProperties
					}
				/>
			))}

			{/* Content */}
			<div
				className="relative z-10 flex flex-col items-center text-center max-w-2xl"
				style={{ animation: "fadeUp 0.5s ease-out both" }}
			>
				{/* Logo */}
				<div className="flex items-center gap-3 mb-10">
					<img
						src="/logo.svg"
						alt="Detonado"
						width="36"
						height="36"
						className="rounded-[10px]"
						fetchPriority="high"
					/>
					<span className="text-[28px] font-bold tracking-[-0.03em] text-text-hi">
						Detonado
					</span>
				</div>

				{/* Headline */}
				<h1
					className="text-[30px] sm:text-[44px] font-bold tracking-[-0.03em] leading-[1.1] mb-4 text-text-hi"
					style={{ textShadow: "0 0 80px oklch(0.5 0.18 17 / 0.3)" }}
				>
					Sua biblioteca de jogos,{" "}
					<span style={{ color: "var(--color-accent-bright)" }}>
						organizada.
					</span>
				</h1>

				<p className="text-[17px] text-text-md leading-relaxed mb-10 max-w-lg">
					Rastreie o que está jogando, o que zerou e o backlog que nunca para de
					crescer. Tudo num lugar só.
				</p>

				{/* CTA buttons */}
				<div className="flex flex-col sm:flex-row gap-3 mb-16 w-full sm:w-auto">
					<button
						type="button"
						onClick={() => navigate({ to: "/register" })}
						className="h-11 px-7 rounded-[10px] text-[14px] font-semibold cursor-pointer border-0"
						style={{
							background: "var(--color-primary)",
							color: "var(--color-primary-foreground)",
							boxShadow: "0 0 24px oklch(0.5 0.18 17 / 0.4)",
							fontFamily: "inherit",
						}}
					>
						Criar conta grátis
					</button>
					<button
						type="button"
						onClick={() => navigate({ to: "/login" })}
						className="h-11 px-7 rounded-[10px] text-[14px] font-medium cursor-pointer"
						style={{
							background: "var(--color-bg-2)",
							border: "1px solid var(--color-border)",
							color: "var(--color-text-md)",
							fontFamily: "inherit",
						}}
					>
						Já tenho conta
					</button>
				</div>

				{/* Feature grid */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
					{FEATURES.map((f) => (
						<div
							key={f.label}
							className="rounded-xl p-5 text-left"
							style={{
								background: "var(--color-card)",
								border: "1px solid var(--color-border-soft)",
								backdropFilter: "blur(8px)",
							}}
						>
							<div className="text-2xl mb-3">{f.icon}</div>
							<div className="text-[13.5px] font-semibold text-text-hi mb-1.5">
								{f.label}
							</div>
							<div className="text-[12px] text-text-lo leading-relaxed">
								{f.desc}
							</div>
						</div>
					))}
				</div>

				<div className="mt-12 font-mono text-[10.5px] text-text-dim tracking-[0.08em]">
					DETONADO · RASTREADOR DE JOGOS
				</div>
			</div>
		</div>
	);
}
