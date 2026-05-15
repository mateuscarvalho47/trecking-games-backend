import { useNavigate, useRouterState } from "@tanstack/react-router";
import { BarChart3, BookMarked, Home, LogOut, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useLogout, useMe } from "@/features/auth/hooks/useAuth";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

const NAV_ITEMS = [
	{ to: "/", label: "Home", icon: Home },
	{ to: "/library", label: "Biblioteca", icon: BookMarked },
	{ to: "/stats", label: "Estatísticas", icon: BarChart3 },
] as const;

export function Sidebar({ libraryCount }: { libraryCount?: number }) {
	const navigate = useNavigate();
	const routerState = useRouterState();
	const currentPath = routerState.location.pathname;
	const setSearchOpen = useAppStore((s) => s.setSearchOpen);
	const { data: me } = useMe();
	const logout = useLogout();

	const isActive = (to: string) =>
		to === "/" ? currentPath === "/" : currentPath.startsWith(to);

	const initials = me?.email ? me.email.slice(0, 2).toUpperCase() : "??";

	return (
		<aside
			className="sticky top-0 self-start h-screen flex flex-col gap-3 p-[18px_14px]"
			style={{
				width: 232,
				background: "oklch(0.16 0.007 28)",
				borderRight: "1px solid oklch(0.22 0.009 28)",
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
				<span className="text-[17px] font-bold tracking-[-0.02em] text-text-hi">
					Cartucheira
				</span>
				<span className="ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded font-mono text-text-lo border border-border-soft">
					β
				</span>
			</div>

			{/* Search button */}
			<button
				type="button"
				onClick={() => setSearchOpen(true)}
				className="flex items-center gap-2 rounded-md px-2.5 py-2 text-[12.5px] transition-all cursor-pointer w-full bg-bg-2 border border-border-soft text-text-md"
				style={{ fontFamily: "inherit" }}
			>
				<Search size={13} />
				<span className="flex-1 text-left">Buscar jogos</span>
				<div className="flex gap-0.5">
					{["⌘", "K"].map((k) => (
						<kbd
							key={k}
							className="inline-flex items-center justify-center h-4 min-w-4 px-1 rounded text-[10px] font-medium font-mono text-text-md bg-bg-3 border border-border"
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
								"text-[13px] font-medium text-left w-full cursor-pointer transition-[background,color]",
								"border-0",
							)}
							style={{
								background: active
									? "oklch(0.40 0.08 145 / 0.18)"
									: "transparent",
								color: active ? "oklch(0.88 0.14 145)" : "oklch(0.72 0.012 75)",
								fontFamily: "inherit",
							}}
						>
							<span className="flex opacity-85">
								<Icon size={16} />
							</span>
							<span className="flex-1">{label}</span>
							{to === "/library" && libraryCount !== undefined && (
								<span
									className="text-[10.5px] px-1.5 py-px rounded font-mono"
									style={{
										color: active
											? "oklch(0.88 0.14 145)"
											: "oklch(0.54 0.014 75)",
										background: active
											? "oklch(0.4 0.08 145 / 0.3)"
											: "oklch(0.23 0.011 28)",
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
			<div className="mt-auto">
				<div className="flex items-center gap-2.5 p-2 rounded-md bg-bg-2 border border-border-soft">
					<div
						className="flex items-center justify-center shrink-0 text-white text-[11px] font-bold rounded-sm"
						style={{
							width: 28,
							height: 28,
							background:
								"linear-gradient(135deg, oklch(0.5 0.15 145), oklch(0.7 0.15 185))",
							letterSpacing: "0.02em",
						}}
					>
						{initials}
					</div>
					<div className="flex-1 min-w-0">
						<div className="text-[12px] font-semibold text-text-hi">
							Minha conta
						</div>
						<div className="text-[10.5px] truncate font-mono text-text-lo">
							{me?.email ?? "—"}
						</div>
					</div>
					<Button
						variant="ghost"
						size="icon-sm"
						onClick={() => logout.mutate()}
						title="Sair"
						className="shrink-0 text-text-md"
					>
						<LogOut size={14} />
					</Button>
				</div>
			</div>
		</aside>
	);
}
