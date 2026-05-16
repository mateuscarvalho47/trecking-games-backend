import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useVerifyEmail } from "../hooks/useAuth";

const VERIFIED_KEY = "cartucheira_email_verified";

export function VerifyEmailScreen() {
	const search = useSearch({ strict: false });
	const token = (search as Record<string, string>).token ?? "";
	const navigate = useNavigate();
	const [alreadyVerified] = useState(
		() => localStorage.getItem(VERIFIED_KEY) === "true",
	);
	const verify = useVerifyEmail(token, !alreadyVerified);

	useEffect(() => {
		if (verify.isSuccess) {
			localStorage.setItem(VERIFIED_KEY, "true");
		}
	}, [verify.isSuccess]);

	return (
		<div className="relative min-h-screen flex items-center justify-center px-5 py-10 bg-bg-0 overflow-hidden">
			{/* Grid background */}
			<div
				className="absolute inset-0 pointer-events-none opacity-40"
				style={{
					backgroundImage: `
            linear-gradient(90deg, oklch(0.2 0.006 28) 1px, transparent 1px),
            linear-gradient(0deg,  oklch(0.2 0.006 28) 1px, transparent 1px)
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
						"radial-gradient(circle, oklch(0.5 0.14 145 / 0.3) 0%, transparent 50%)",
				}}
			/>

			{/* Card */}
			<div className="relative z-10 w-full max-w-105 rounded-xl border border-border p-8 backdrop-blur-xl bg-bg-1/85 shadow-panel">
				{/* Brand */}
				<div className="flex items-center gap-2.5 mb-7">
					<svg
						role="img"
						aria-label="Cartucheira"
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
					<span className="text-[18px] font-bold tracking-[-0.02em] text-text-hi">
						Cartucheira
					</span>
				</div>

				{verify.isLoading && (
					<div className="flex flex-col gap-3">
						<span className="font-mono text-[10.5px] tracking-widest uppercase text-accent-bright block">
							Verificando
						</span>
						<h1 className="text-2xl font-semibold tracking-tight text-text-hi m-0">
							Confirmando email...
						</h1>
						<p className="text-[13px] text-text-md leading-[1.55] m-0">
							Aguarde um momento.
						</p>
					</div>
				)}

				{(verify.isSuccess || alreadyVerified) && (
					<div className="flex flex-col gap-5">
						<div className="flex flex-col gap-2">
							<div className="flex items-center gap-2 mb-1">
								<svg
									aria-hidden="true"
									width="16"
									height="16"
									viewBox="0 0 16 16"
									fill="none"
									className="text-accent-bright shrink-0"
								>
									<circle
										cx="8"
										cy="8"
										r="7"
										stroke="currentColor"
										strokeWidth="1.5"
									/>
									<path
										d="M5 8l2 2 4-4"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
								<span className="font-mono text-[10.5px] tracking-widest uppercase text-accent-bright">
									Email confirmado
								</span>
							</div>
							<h1 className="text-2xl font-semibold tracking-tight text-text-hi m-0">
								Tudo certo!
							</h1>
							<p className="text-[13px] text-text-md leading-[1.55] m-0 max-w-[38ch]">
								Seu email foi verificado com sucesso. Sua conta está ativa e
								pronta para uso.
							</p>
						</div>

						<div className="rounded-lg border border-accent-bright/20 bg-accent-bright/5 px-4 py-3">
							<p className="text-[12.5px] text-accent-bright font-medium m-0 leading-[1.5]">
								Você já pode entrar na sua conta com o email e senha
								cadastrados.
							</p>
						</div>

						<Button
							variant="accent"
							className="w-full h-10 rounded-[8px]"
							onClick={() => {
								localStorage.removeItem(VERIFIED_KEY);
								navigate({ to: "/login" });
							}}
						>
							Entrar na conta
						</Button>
					</div>
				)}

				{verify.isError && !alreadyVerified && (
					<div className="flex flex-col gap-4">
						<div>
							<span className="font-mono text-[10.5px] tracking-widest uppercase text-chart-5 block mb-2">
								Erro
							</span>
							<h1 className="text-2xl font-semibold tracking-tight text-text-hi m-0 mb-2">
								Link inválido
							</h1>
							<p className="text-[13px] text-text-md leading-[1.55] m-0 max-w-[36ch]">
								{(verify.error as Error)?.message ??
									"Token de verificação inválido ou expirado."}
							</p>
						</div>
						<Button
							variant="outline"
							className="w-full h-10 rounded-[8px] mt-1"
							onClick={() => navigate({ to: "/register" })}
						>
							Criar nova conta
						</Button>
					</div>
				)}

				{!token && !verify.isLoading && !alreadyVerified && (
					<div className="flex flex-col gap-4">
						<div>
							<span className="font-mono text-[10.5px] tracking-widest uppercase text-chart-5 block mb-2">
								Erro
							</span>
							<h1 className="text-2xl font-semibold tracking-tight text-text-hi m-0 mb-2">
								Token ausente
							</h1>
							<p className="text-[13px] text-text-md leading-[1.55] m-0 max-w-[36ch]">
								Use o link enviado para o seu email.
							</p>
						</div>
						<Button
							variant="outline"
							className="w-full h-10 rounded-[8px] mt-1"
							onClick={() => navigate({ to: "/login" })}
						>
							Voltar ao login
						</Button>
					</div>
				)}

				<div className="mt-5 pt-4 border-t border-border-soft font-mono text-[10.5px] text-text-dim text-center tracking-[0.04em]">
					CARTUCHEIRA · RASTREADOR DE JOGOS
				</div>
			</div>
		</div>
	);
}
