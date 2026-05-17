import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	Outlet,
	useLocation,
	useNavigate,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
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
	}, [theme]);
}

const PUBLIC_ROUTES = [
	"/",
	"/login",
	"/register",
	"/verify-email",
	"/privacy",
	"/terms",
];
const NO_SHELL_ROUTES = [
	"/login",
	"/register",
	"/verify-email",
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
	const { searchOpen, setSearchOpen } = useAppStore();
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
						fontSize: 12,
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
				<div className="flex min-h-screen">
					<div className="hidden lg:block shrink-0" style={{ width: 232 }}>
						<Sidebar me={me} libraryCount={library.length} />
					</div>
					<main className="flex-1 min-w-0 pb-20 lg:pb-15">
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
			<Toaster position="bottom-right" richColors />
		</div>
	);
}
