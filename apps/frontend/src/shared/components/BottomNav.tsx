import { useNavigate, useRouterState } from "@tanstack/react-router";
import {
	BarChart3,
	BookMarked,
	Home,
	LogOut,
	Moon,
	Search,
	Sun,
} from "lucide-react";
import { useLogout } from "@/features/auth/hooks/useAuth";
import { useAppStore } from "@/store/useAppStore";

const NAV_ITEMS = [
	{ to: "/", label: "Home", icon: Home },
	{ to: "/library", label: "Biblioteca", icon: BookMarked },
	{ to: "/stats", label: "Estatísticas", icon: BarChart3 },
] as const;

export function BottomNav({
	libraryCount: _libraryCount,
}: {
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

	return (
		<nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 h-14 flex items-center justify-around border-t border-border-soft bg-bg-1">
			{NAV_ITEMS.map(({ to, label, icon: Icon }) => {
				const active = isActive(to);
				return (
					<button
						type="button"
						key={to}
						onClick={() => navigate({ to })}
						className="flex flex-col items-center gap-1 flex-1 py-2 border-0 bg-transparent cursor-pointer"
						style={{
							color: active
								? "var(--color-accent-bright)"
								: "var(--color-text-lo)",
						}}
					>
						<Icon className="size-5" />
						<span style={{ fontSize: "var(--font-size-overline)" }}>
							{label}
						</span>
					</button>
				);
			})}
			<button
				type="button"
				onClick={() => setSearchOpen(true)}
				className="flex flex-col items-center gap-1 flex-1 py-2 border-0 bg-transparent cursor-pointer"
				style={{ color: "var(--color-text-lo)" }}
			>
				<Search className="size-5" />
				<span style={{ fontSize: "var(--font-size-overline)" }}>Buscar</span>
			</button>
			<button
				type="button"
				onClick={toggleTheme}
				className="flex flex-col items-center gap-1 flex-1 py-2 border-0 bg-transparent cursor-pointer"
				style={{ color: "var(--color-text-lo)" }}
			>
				{theme === "dark" ? (
					<Sun className="size-5" />
				) : (
					<Moon className="size-5" />
				)}
				<span style={{ fontSize: "var(--font-size-overline)" }}>Tema</span>
			</button>
			<button
				type="button"
				onClick={() => logout.mutate()}
				className="flex flex-col items-center gap-1 flex-1 py-2 border-0 bg-transparent cursor-pointer"
				style={{ color: "var(--color-text-lo)" }}
			>
				<LogOut className="size-5" />
				<span style={{ fontSize: "var(--font-size-overline)" }}>Sair</span>
			</button>
		</nav>
	);
}
