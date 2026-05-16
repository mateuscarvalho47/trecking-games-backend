import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import type { User } from "@/types/api";
import {
	type LoginFormValues,
	loginSchema,
	type RegisterFormValues,
	registerSchema,
} from "../schema/authSchema";
import {
	fetchMe,
	login,
	logout,
	register,
	resendVerification,
	verifyEmail,
} from "../service/authService";

export function useMe(opts?: { enabled?: boolean }) {
	return useQuery<User | null>({
		queryKey: ["me"],
		queryFn: fetchMe,
		staleTime: 1000 * 60 * 5,
		retry: false,
		retryOnMount: false,
		refetchOnWindowFocus: false,
		enabled: opts?.enabled !== false,
	});
}

export function useLogin() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: login,
		onSuccess: (user) => {
			qc.setQueryData(["me"], user);
			qc.invalidateQueries({ queryKey: ["library"] });
		},
	});
}

export function useRegister() {
	return useMutation({ mutationFn: register });
}

export function useVerifyEmail(token: string, enabled: boolean) {
	return useQuery({
		queryKey: ["verify-email", token],
		queryFn: () => verifyEmail(token),
		enabled: !!token && enabled,
		retry: false,
		staleTime: Number.POSITIVE_INFINITY,
		gcTime: Number.POSITIVE_INFINITY,
	});
}

export function useResendVerification() {
	return useMutation({ mutationFn: resendVerification });
}

export function useLogout() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: logout,
		onSuccess: () => {
			qc.setQueryData(["me"], null);
			qc.clear();
		},
	});
}

export function useLoginForm(onSuccess: () => void) {
	const mutation = useLogin();

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: "", password: "" },
	});

	const onSubmit = form.handleSubmit(async (values) => {
		await mutation.mutateAsync(values);
		onSuccess();
	});

	return { form, onSubmit, mutation };
}

export function useRegisterForm() {
	const mutation = useRegister();

	const form = useForm<RegisterFormValues>({
		resolver: zodResolver(registerSchema),
		defaultValues: { email: "", password: "" },
	});

	const onSubmit = form.handleSubmit((values) => mutation.mutateAsync(values));

	return { form, onSubmit, mutation };
}
