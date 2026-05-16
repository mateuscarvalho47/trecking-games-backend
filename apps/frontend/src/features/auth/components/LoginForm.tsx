import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api";
import { useLoginForm, useResendVerification } from "../hooks/useAuth";

export function LoginForm() {
	const navigate = useNavigate();
	const {
		form,
		onSubmit,
		mutation: login,
	} = useLoginForm(() => navigate({ to: "/" }));
	const resend = useResendVerification();
	const [showPassword, setShowPassword] = useState(false);

	const {
		register,
		watch,
		formState: { errors },
	} = form;
	const email = watch("email");

	const emailNotVerified =
		login.error instanceof ApiError && login.error.status === 403;

	return (
		<form onSubmit={onSubmit} className="flex flex-col gap-3.5">
			<div>
				<span className="font-mono text-[10.5px] tracking-widest uppercase text-accent-bright block mb-2">
					Bem-vindo de volta
				</span>
				<h1 className="text-2xl font-semibold tracking-tight m-0 mb-2 text-text-hi">
					Entrar na conta
				</h1>
				<p className="text-[13px] text-text-md leading-[1.55] mt-0 mb-6 max-w-[36ch]">
					Acesse sua biblioteca de jogos.
				</p>
			</div>

			<div className="flex flex-col gap-1.5">
				<Label className="mono-label">E-mail</Label>
				<Input
					type="email"
					{...register("email")}
					placeholder="seu@email.com"
					className="bg-bg-2 border-border text-text-hi placeholder:text-text-lo h-9.5"
				/>
				{errors.email && (
					<p className="text-[11.5px] m-0 text-chart-5">
						{errors.email.message}
					</p>
				)}
			</div>

			<div className="flex flex-col gap-1.5">
				<Label className="mono-label">Senha</Label>
				<div className="relative">
					<Input
						type={showPassword ? "text" : "password"}
						{...register("password")}
						placeholder="••••••••"
						className="bg-bg-2 border-border text-text-hi placeholder:text-text-lo h-9.5 pr-9"
					/>
					<button
						type="button"
						onClick={() => setShowPassword((v) => !v)}
						className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-lo hover:text-text-md transition-colors"
						tabIndex={-1}
					>
						{showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
					</button>
				</div>
				{errors.password && (
					<p className="text-[11.5px] m-0 text-chart-5">
						{errors.password.message}
					</p>
				)}
			</div>

			{login.error && !emailNotVerified && (
				<p className="text-[11.5px] m-0 text-chart-5">{login.error.message}</p>
			)}

			{emailNotVerified && (
				<div className="flex flex-col gap-1.5">
					<Button
						type="button"
						variant="outline"
						disabled={resend.isPending || resend.isSuccess}
						onClick={() => resend.mutate(email)}
						className="w-full h-10 rounded-[8px]"
					>
						{resend.isPending ? "Enviando..." : "Reenviar email de verificação"}
					</Button>
					{resend.isSuccess && (
						<p className="text-[11.5px] m-0 text-text-md text-center">
							Novo link enviado para {email}.
						</p>
					)}
					{resend.error && (
						<p className="text-[11.5px] m-0 text-chart-5 text-center">
							{resend.error.message}
						</p>
					)}
				</div>
			)}

			<Button
				variant="accent"
				type="submit"
				disabled={login.isPending}
				className="w-full h-10 rounded-[8px] mt-1.5"
			>
				{login.isPending ? "Entrando..." : "Entrar"}
			</Button>

			<p className="text-center text-[12.5px] text-text-lo mt-1">
				Não tem conta?{" "}
				<a
					href="/register"
					className="text-accent-bright font-semibold no-underline"
				>
					Criar conta
				</a>
			</p>
		</form>
	);
}
