import { api } from "@/lib/api";
import type { User } from "@/types/api";

export function fetchMe() {
	return api.get<User>("/auth/me");
}

export function login(data: { email: string; password: string }) {
	return api.post<User>("/auth/login", data);
}

export function register(data: { email: string; password: string }) {
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
