import type { ReactNode } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

interface AuthShellProps {
	mode?: "login" | "register";
	children?: ReactNode;
}

const TILES = [
	{ w: 80, h: 108, top: "8%", left: "5%", hue: 295, r: -8, delay: 0 },
	{ w: 60, h: 80, top: "15%", left: "78%", hue: 145, r: 12, delay: 1.5 },
	{ w: 72, h: 96, top: "60%", left: "88%", hue: 25, r: -5, delay: 0.8 },
	{ w: 64, h: 86, top: "72%", left: "3%", hue: 75, r: 7, delay: 2.1 },
	{ w: 52, h: 70, top: "40%", left: "93%", hue: 260, r: -14, delay: 1.1 },
	{ w: 56, h: 76, top: "30%", left: "2%", hue: 200, r: 10, delay: 0.4 },
];

export function AuthShell({ mode, children }: AuthShellProps) {
	return (
		<div className="relative min-h-screen flex items-center justify-center px-5 py-10 bg-bg-0 overflow-hidden">
			{/* Grid background */}
			<div
				className="absolute inset-0 pointer-events-none opacity-40"
				style={{
					backgroundImage: `
            linear-gradient(90deg, var(--color-grid-line) 1px, transparent 1px),
            linear-gradient(0deg,  var(--color-grid-line) 1px, transparent 1px)
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
					top: "50%",
					left: "50%",
					width: "80vw",
					height: "80vw",
					transform: "translate(-50%, -50%)",
					background:
						"radial-gradient(circle, var(--color-glow-accent) 0%, transparent 50%)",
				}}
			/>

			{/* Floating tiles — dynamic hue, must stay inline */}
			<style>{`
        @keyframes tilefloat {
          0%   { transform: translateY(0) rotate(var(--tr)); }
          100% { transform: translateY(-12px) rotate(var(--tr)); }
        }
      `}</style>
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
							border: `1px solid oklch(0.6 0.18 ${t.hue} / 0.35)`,
							background: `oklch(0.3 0.12 ${t.hue} / 0.15)`,
							filter: "blur(0.5px)",
							"--tr": `${t.r}deg`,
							animation: `tilefloat 10s ease-in-out ${t.delay}s infinite alternate`,
						} as React.CSSProperties
					}
				/>
			))}

			{/* Auth card */}
			<div className="relative z-10 w-full max-w-105 rounded-xl border border-border p-8 backdrop-blur-xl bg-bg-1/85 shadow-panel">
				{/* Brand */}
				<div className="flex items-center gap-2.5 mb-7">
					<svg
						role="img"
						aria-label="Detonado"
						width="22"
						height="22"
						viewBox="0 0 22 22"
						fill="none"
						className="text-accent-bright"
					>
						<rect
							x="2"
							y="2"
							width="8"
							height="8"
							rx="2"
							fill="currentColor"
							opacity="0.9"
						/>
						<rect
							x="12"
							y="2"
							width="8"
							height="8"
							rx="2"
							fill="currentColor"
							opacity="0.5"
						/>
						<rect
							x="2"
							y="12"
							width="8"
							height="8"
							rx="2"
							fill="currentColor"
							opacity="0.5"
						/>
						<rect
							x="12"
							y="12"
							width="8"
							height="8"
							rx="2"
							fill="currentColor"
							opacity="0.7"
						/>
					</svg>
					<span className="text-[19px] font-bold tracking-[-0.02em] text-text-hi">
						Detonado
					</span>
				</div>

				{children ?? (mode === "login" ? <LoginForm /> : <RegisterForm />)}

				<div className="mt-5 pt-4 border-t border-border-soft font-mono text-[11.5px] text-text-dim text-center tracking-[0.04em]">
					DETONADO · RASTREADOR DE JOGOS
				</div>
			</div>
		</div>
	);
}
