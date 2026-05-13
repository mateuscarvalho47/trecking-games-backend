import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.url(),
  REDIS_URL: z.url(),
  SESSION_SECRET: z.string().min(32),
  COOKIE_SECRET: z.string().min(32),
  CORS_ORIGIN: z.url(),
});

export const env = envSchema.parse(process.env);
