import { z } from "zod";

export const loginSchema = z.object({
	email: z.string().email("E-mail inválido"),
	password: z.string().min(1, "Senha obrigatória"),
});

export const registerSchema = z.object({
	email: z.string().email("E-mail inválido"),
	password: z.string().min(8, "Mínimo 8 caracteres"),
	consent: z.literal(true, {
		error: "Você precisa aceitar os termos para continuar",
	}),
});

export const updateAccountSchema = z
	.object({
		currentPassword: z.string().min(1, "Senha atual obrigatória"),
		email: z.string().email("E-mail inválido").optional().or(z.literal("")),
		newPassword: z
			.string()
			.min(8, "Mínimo 8 caracteres")
			.optional()
			.or(z.literal("")),
	})
	.refine(
		(d) =>
			(d.email && d.email !== "") || (d.newPassword && d.newPassword !== ""),
		{
			message: "Informe pelo menos um campo para atualizar",
			path: ["currentPassword"],
		},
	);

export const deleteAccountSchema = z.object({
	password: z.string().min(1, "Senha obrigatória para confirmar a exclusão"),
});

export const requestResetSchema = z.object({
	email: z.string().email("E-mail inválido"),
});

export const verifyResetSchema = z
	.object({
		email: z.string().email(),
		code: z.string().length(6, "O código deve ter 6 dígitos"),
		password: z.string().min(8, "Mínimo 8 caracteres"),
		confirmPassword: z.string().min(8, "Mínimo 8 caracteres"),
	})
	.refine((d) => d.password === d.confirmPassword, {
		message: "As senhas não coincidem",
		path: ["confirmPassword"],
	});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type UpdateAccountFormValues = z.infer<typeof updateAccountSchema>;
export type DeleteAccountFormValues = z.infer<typeof deleteAccountSchema>;
export type RequestResetFormValues = z.infer<typeof requestResetSchema>;
export type VerifyResetFormValues = z.infer<typeof verifyResetSchema>;
