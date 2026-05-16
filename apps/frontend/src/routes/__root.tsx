import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	Outlet,
	useLocation,
	useNavigate,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { useMe } from "@/features/auth/hooks/useAuth";
import { useLibrary } from "@/features/library/hooks/useLibrary";
import { SearchModal } from "@/features/search/components/SearchModal";
import { BottomNav } from "@/shared/components/BottomNav";
import { Sidebar } from "@/shared/components/Sidebar";
import { useAppStore } from "@/store/useAppStore";

const PUBLIC_ROUTES = ["/", "/login", "/register", "/verify-email"];
const NO_SHELL_ROUTES = ["/login", "/register", "/verify-email"];

interface RouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootLayout,
});

function RootLayout() {
	const { searchOpen, setSearchOpen } = useAppStore();
	const { data: me, isLoading } = useMe();
	const navigate = useNavigate();
	const location = useLocation();
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

	if (isLoading) {
		return (
			<div
				style={{
					minHeight: "100vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background: "oklch(0.13 0.006 28)",
				}}
			>
				<span
					style={{
						color: "oklch(0.54 0.014 75)",
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
				background: "oklch(0.13 0.006 28)",
				color: "oklch(0.96 0.006 75)",
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
		</div>
	);
}
