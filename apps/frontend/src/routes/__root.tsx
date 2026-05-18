import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	Outlet,
	useLocation,
	useNavigate,
} from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ConsentModal } from "@/features/auth/components/ConsentModal";
import { useMe } from "@/features/auth/hooks/useAuth";
import { useLibrary } from "@/features/library/hooks/useLibrary";
import { SearchModal } from "@/features/search/components/SearchModal";
import { BottomNav } from "@/shared/components/BottomNav";
import { Sidebar } from "@/shared/components/Sidebar";
import { useAppStore } from "@/store/useAppStore";

function useApplyTheme() {
	const theme = useAppStore((s) => s.theme);
	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
		if (theme === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [theme]);
}

const PUBLIC_ROUTES = [
	"/",
	"/login",
	"/register",
	"/verify-email",
	"/forgot-password",
	"/reset-password",
	"/privacy",
	"/terms",
];
const NO_SHELL_ROUTES = [
	"/login",
	"/register",
	"/verify-email",
	"/forgot-password",
	"/reset-password",
	"/privacy",
	"/terms",
];

interface RouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootLayout,
});

function RootLayout() {
	useApplyTheme();
	const { searchOpen, setSearchOpen, sidebarOpen, toggleSidebar } =
		useAppStore();
	const navigate = useNavigate();
	const location = useLocation();
	const isAuthRoute = ["/login", "/register"].includes(location.pathname);
	const { data: me, isLoading } = useMe({ enabled: !isAuthRoute });
	const { data: library = [] } = useLibrary({ enabled: !!me });

	useEffect(() => {
		if (!isLoading && !me && !PUBLIC_ROUTES.includes(location.pathname)) {
			navigate({ to: "/" });
		}
	}, [me, isLoading, location.pathname, navigate]);

	// Cmd/Ctrl+K global handler
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				setSearchOpen(true);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [setSearchOpen]);

	if (isLoading && !PUBLIC_ROUTES.includes(location.pathname)) {
		return (
			<div
				style={{
					minHeight: "100vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background: "var(--color-background)",
				}}
			>
				<span
					style={{
						color: "var(--color-text-lo)",
						fontFamily: "'Geist Mono', monospace",
						fontSize: 13,
					}}
				>
					carregando...
				</span>
			</div>
		);
	}

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "var(--color-background)",
				color: "var(--color-foreground)",
			}}
		>
			{me && !NO_SHELL_ROUTES.includes(location.pathname) ? (
				<div className="flex h-screen overflow-hidden">
					<div
						className="hidden lg:block shrink-0 overflow-hidden"
						style={{
							width: sidebarOpen ? 232 : 0,
							transition: "width 220ms ease",
						}}
					>
						<Sidebar me={me} libraryCount={library.length} />
					</div>
					<main className="flex-1 min-w-0 overflow-y-auto pb-20 lg:pb-0">
						<div
							className="hidden lg:flex items-center h-10 px-3 sticky top-0 z-30"
							style={{ background: "var(--color-background)" }}
						>
							<Button
								variant="ghost"
								size="icon-sm"
								onClick={toggleSidebar}
								aria-label={sidebarOpen ? "Fechar menu" : "Abrir menu"}
								className="text-text-lo hover:text-text-hi"
							>
								<Menu size={16} />
							</Button>
						</div>
						<Outlet />
					</main>
					<BottomNav libraryCount={library.length} />
				</div>
			) : (
				<Outlet />
			)}
			{me && !NO_SHELL_ROUTES.includes(location.pathname) && (
				<SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
			)}
			{me &&
				me.consentedAt === null &&
				!NO_SHELL_ROUTES.includes(location.pathname) && <ConsentModal />}
		</div>
	);
}
