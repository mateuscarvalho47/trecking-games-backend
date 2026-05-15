import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegister } from "../hooks/useAuth";

export function RegisterForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const register = useRegister();

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		await register.mutateAsync({ email, password });
	};

	if (register.isSuccess) {
		return (
			<div className="flex flex-col gap-4">
				<div>
					<span className="font-mono text-[10.5px] tracking-widest uppercase text-accent-bright block mb-2">
						Verifique seu email
					</span>
					<h1 className="text-2xl font-semibold tracking-tight m-0 mb-2 text-text-hi">
						Quase lá!
					</h1>
					<p className="text-[13px] text-text-md leading-[1.55] mt-0 mb-2 max-w-[36ch]">
						Enviamos um link de confirmação para{" "}
						<span className="text-text-hi font-medium">{email}</span>. Clique no
						link para ativar sua conta.
					</p>
					<p className="text-[12px] text-text-lo leading-normal">
						Não recebeu? Verifique a pasta de spam.
					</p>
				</div>
				<p className="text-center text-[12.5px] text-text-lo mt-2">
					<a
						href="/login"
						className="text-accent-bright font-semibold no-underline"
					>
						Voltar ao login
					</a>
				</p>
			</div>
		);
	}

	return (
		<form onSubmit={submit} className="flex flex-col gap-3.5">
			<div>
				<span className="font-mono text-[10.5px] tracking-widest uppercase text-accent-bright block mb-2">
					Crie sua conta
				</span>
				<h1 className="text-2xl font-semibold tracking-tight m-0 mb-2 text-text-hi">
					Começar a rastrear
				</h1>
				<p className="text-[13px] text-text-md leading-[1.55] mt-0 mb-6 max-w-[36ch]">
					Monte sua biblioteca de jogos pessoal.
				</p>
			</div>

			<div className="flex flex-col gap-1.5">
				<Label className="mono-label">E-mail</Label>
				<Input
					type="email"
					required
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="seu@email.com"
					className="bg-bg-2 border-border text-text-hi placeholder:text-text-lo h-9.5"
				/>
			</div>

			<div className="flex flex-col gap-1.5">
				<Label className="mono-label">Senha</Label>
				<Input
					type="password"
					required
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="mínimo 8 caracteres"
					className="bg-bg-2 border-border text-text-hi placeholder:text-text-lo h-9.5"
				/>
			</div>

			{register.error && (
				<p className="text-[11.5px] m-0 text-chart-5">
					{register.error.message}
				</p>
			)}

			<Button
				variant="accent"
				type="submit"
				disabled={register.isPending}
				className="w-full h-10 rounded-[8px] mt-1.5"
			>
				{register.isPending ? "Criando..." : "Criar conta"}
			</Button>

			<p className="text-center text-[12.5px] text-text-lo mt-1">
				Já tem conta?{" "}
				<a
					href="/login"
					className="text-accent-bright font-semibold no-underline"
				>
					Entrar
				</a>
			</p>
		</form>
	);
}
