import { ApiError, api } from "@/lib/api";
import type { User } from "@/types/api";

export async function fetchMe(): Promise<User | null> {
	try {
		return await api.get<User>("/auth/me");
	} catch (e) {
		if (e instanceof ApiError && e.status === 401) return null;
		throw e;
	}
}

export function login(data: { email: string; password: string }) {
	return api.post<User>("/auth/login", data);
}

export function register(data: {
	email: string;
	password: string;
	consent: true;
}) {
	return api.post<{ message: string }>("/auth/register", data);
}

export function verifyEmail(token: string) {
	return api.get<{ message: string }>(`/auth/verify-email?token=${token}`);
}

export function resendVerification(email: string) {
	return api.post<{ message: string }>("/auth/resend-verification", { email });
}

export function logout() {
	return api.post("/auth/logout");
}

export function updateAccount(data: {
	currentPassword: string;
	email?: string;
	newPassword?: string;
}) {
	const payload: Record<string, string> = {
		currentPassword: data.currentPassword,
	};
	if (data.email) payload.email = data.email;
	if (data.newPassword) payload.newPassword = data.newPassword;
	return api.patch<{ id: string; email: string; emailVerified: boolean }>(
		"/auth/account",
		payload,
	);
}

export function deleteAccount(data: { password: string }) {
	return api.delete("/auth/account", data);
}

export function exportData() {
	return api.get<unknown>("/auth/export");
}
