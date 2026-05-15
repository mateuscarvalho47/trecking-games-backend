import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError, api } from "@/lib/api";
import type { User } from "@/types/api";

export function useMe() {
	return useQuery<User | null>({
		queryKey: ["me"],
		queryFn: async () => {
			try {
				return await api.get<User>("/auth/me");
			} catch (e) {
				if (e instanceof ApiError && e.status === 401) return null;
				throw e;
			}
		},
		staleTime: 1000 * 60 * 5,
		retry: false,
		retryOnMount: false,
		refetchOnWindowFocus: false,
	});
}

export function useLogin() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (data: { email: string; password: string }) =>
			api.post<User>("/auth/login", data),
		onSuccess: (user) => {
			qc.setQueryData(["me"], user);
			qc.invalidateQueries({ queryKey: ["library"] });
		},
	});
}

export function useRegister() {
	return useMutation({
		mutationFn: (data: { email: string; password: string }) =>
			api.post<{ message: string }>("/auth/register", data),
	});
}

export function useVerifyEmail() {
	return useMutation({
		mutationFn: (token: string) =>
			api.get<{ message: string }>(`/auth/verify-email?token=${token}`),
	});
}

export function useResendVerification() {
	return useMutation({
		mutationFn: (email: string) =>
			api.post<{ message: string }>("/auth/resend-verification", { email }),
	});
}

export function useLogout() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: () => api.post("/auth/logout"),
		onSuccess: () => {
			qc.setQueryData(["me"], null);
			qc.clear();
		},
	});
}
