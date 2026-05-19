import { useNavigate, useRouterState } from "@tanstack/react-router";
import {
	BarChart3,
	BookMarked,
	Home,
	LogOut,
	Moon,
	Search,
	Settings,
	Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useLogout } from "@/features/auth/hooks/useAuth";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import type { User } from "@/types/api";

const NAV_ITEMS = [
	{ to: "/", label: "Home", icon: Home },
	{ to: "/library", label: "Biblioteca", icon: BookMarked },
	{ to: "/stats", label: "Estatísticas", icon: BarChart3 },
] as const;

export function Sidebar({
	me,
	libraryCount,
}: {
	me: User;
	libraryCount?: number;
}) {
	const navigate = useNavigate();
	const routerState = useRouterState();
	const currentPath = routerState.location.pathname;
	const setSearchOpen = useAppStore((s) => s.setSearchOpen);
	const { theme, toggleTheme } = useAppStore();
	const logout = useLogout();

	const isActive = (to: string) =>
		to === "/" ? currentPath === "/" : currentPath.startsWith(to);

	const initials = me?.email ? me.email.slice(0, 2).toUpperCase() : "??";

	return (
		<aside
			className="sticky top-0 self-start h-screen flex flex-col gap-3 p-[18px_14px] w-full"
			style={{
				background: "var(--color-bg-1)",
				borderRight: "1px solid var(--color-border-soft)",
			}}
		>
			{/* Brand */}
			<div className="flex items-center gap-2 px-1.5 pb-1">
				<img
					src="/logo.svg"
					alt=""
					width="22"
					height="22"
					className="rounded-md"
				/>
				<span className="text-[18px] font-bold tracking-[-0.02em] text-text-hi">
					Detonado
				</span>
			</div>

			{/* Search button */}
			<button
				type="button"
				onClick={() => setSearchOpen(true)}
				className="flex items-center gap-2 rounded-md px-2.5 py-2 text-[13.5px] transition-all cursor-pointer w-full bg-bg-2 border border-border-soft text-text-md"
			>
				<Search size={13} />
				<span className="flex-1 text-left">Buscar jogos</span>
				<div className="flex gap-0.5">
					{["Ctrl", "K"].map((k) => (
						<kbd
							key={k}
							className="inline-flex items-center justify-center h-4 min-w-4 px-1 rounded text-[11px] font-medium font-mono text-text-md bg-bg-3 border border-border"
							style={{ boxShadow: "0 1px 0 oklch(0 0 0 / 0.5)" }}
						>
							{k}
						</kbd>
					))}
				</div>
			</button>

			{/* Nav */}
			<nav className="flex flex-col gap-px pt-1">
				{NAV_ITEMS.map(({ to, label, icon: Icon }) => {
					const active = isActive(to);
					return (
						<button
							type="button"
							key={to}
							onClick={() => navigate({ to })}
							className={cn(
								"flex items-center gap-2.5 px-2.5 py-2 rounded-sm",
								"text-[14px] font-medium text-left w-full cursor-pointer transition-[background,color]",
								"border-0",
							)}
							style={{
								background: active ? "var(--color-accent-soft)" : "transparent",
								color: active
									? "var(--color-accent-bright)"
									: "var(--color-text-md)",
							}}
						>
							<span className="flex opacity-85">
								<Icon size={16} />
							</span>
							<span className="flex-1">{label}</span>
							{to === "/library" && libraryCount !== undefined && (
								<span
									className="text-[11.5px] px-1.5 py-px rounded font-mono"
									style={{
										color: active
											? "var(--color-accent-bright)"
											: "var(--color-text-lo)",
										background: active
											? "var(--color-accent-soft)"
											: "var(--color-bg-3)",
									}}
								>
									{libraryCount}
								</span>
							)}
						</button>
					);
				})}
			</nav>

			<Separator className="bg-border-soft" />

			{/* Footer user */}
			<div className="mt-auto flex flex-col gap-2">
				{/* Theme toggle */}
				<div className="flex items-center justify-between px-1">
					<span className="text-[12px] font-mono text-text-dim uppercase tracking-widest">
						Tema
					</span>
					<Button
						variant="ghost"
						size="icon-sm"
						onClick={toggleTheme}
						title={theme === "dark" ? "Mudar para claro" : "Mudar para escuro"}
						className="text-text-md"
					>
						{theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
					</Button>
				</div>

				<div className="flex flex-col gap-2.5 p-3 rounded-md bg-bg-2 border border-border-soft">
					<div className="flex items-center gap-2.5">
						<div
							className="flex items-center justify-center shrink-0 text-white text-[12px] font-bold rounded-sm"
							style={{
								width: 32,
								height: 32,
								background:
									"linear-gradient(135deg, oklch(0.5 0.2 17), oklch(0.55 0.18 350))",
								letterSpacing: "0.02em",
							}}
						>
							{initials}
						</div>
						<div className="flex-1 min-w-0">
							<div className="text-[13px] font-semibold text-text-hi leading-tight">
								Minha conta
							</div>
							<div className="text-[12px] truncate font-mono text-text-lo mt-0.5">
								{me?.email ?? "—"}
							</div>
						</div>
					</div>
					<div className="flex gap-1.5">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => navigate({ to: "/account" })}
							title="Configurações"
							className="flex-1 h-7 text-[12.5px] text-text-md gap-1.5 justify-start px-2"
						>
							<Settings size={13} />
							Configurações
						</Button>
						<Button
							variant="ghost"
							size="icon-sm"
							onClick={() => logout.mutate()}
							title="Sair"
							className="shrink-0 h-7 w-7 text-text-md"
						>
							<LogOut size={13} />
						</Button>
					</div>
				</div>
			</div>
		</aside>
	);
}
