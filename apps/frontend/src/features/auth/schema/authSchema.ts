import { z } from "zod";

export const loginSchema = z.object({
	email: z.string().email("E-mail inválido"),
	password: z.string().min(1, "Senha obrigatória"),
});

export const registerSchema = z.object({
	email: z.string().email("E-mail inválido"),
	password: z.string().min(8, "Mínimo 8 caracteres"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
