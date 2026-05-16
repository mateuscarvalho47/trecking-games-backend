# CLAUDE.md — Frontend

## Commands

```bash
pnpm dev          # Vite dev server
pnpm build        # tsc + vite build
pnpm lint         # Biome check
pnpm lint:fix     # Biome auto-fix
pnpm test         # Vitest (run once)
pnpm test:watch   # Vitest watch
```

## Architecture

React 19 + Vite + TanStack Router (file-based). Path alias `@` maps to `src/`.

**State**: TanStack Query for server state, Zustand (`src/store/`) for UI state.

**API layer**: `src/lib/api.ts` — thin `fetch` wrapper, throws `ApiError` on non-2xx.

**Shared types**: `src/types/api.ts` — types shared across features (`LibraryEntry`, `GameSearchResult`, `User`, etc.). Keep types here only when consumed by more than one feature.

## Feature folder structure

Every feature that has queries or mutations **must** follow this layout:

```
features/<name>/
├── components/   # UI only — import from ../hooks/, never from service/ or lib/api directly
├── hooks/        # React Query hooks + RHF form hooks
├── service/      # Raw API calls (plain async functions, no React)
└── schema/       # Zod schemas for RHF forms (only when form is feature-specific)
```

Features with no queries or mutations (`landing`, `dashboard` sub-components) do not need `service/` or `hooks/`.

### service/

Pure functions that call `api.*`. No React, no business logic beyond shaping the request/response.

```ts
// features/library/service/libraryService.ts
export function fetchLibrary() {
  return api.get<LibraryEntry[]>("/library");
}
export function addToLibrary(data: { igdbId: number; status: string; userPlatform?: string }) {
  return api.post<LibraryEntry>("/library", data);
}
```

### hooks/

Two responsibilities:

1. **Query/mutation hooks** — wrap `useQuery`/`useMutation` around service calls.
2. **RHF form hooks** (`useXxxForm`) — bundle `useForm` + `zodResolver` + the mutation, return `{ form, onSubmit, mutation }`.

```ts
// query hook
export function useLibrary(opts?: { enabled?: boolean }) {
  return useQuery<LibraryEntry[]>({
    queryKey: ["library"],
    queryFn: fetchLibrary,
    enabled: opts?.enabled,
  });
}

// RHF form hook
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
```

### schema/

Feature-specific Zod schemas used only by RHF in that feature. If a schema is truly shared, keep it in `src/types/api.ts` instead.

```ts
// features/auth/schema/authSchema.ts
export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha obrigatória"),
});
export type LoginFormValues = z.infer<typeof loginSchema>;
```

### components/

- Import hooks from `../hooks/`, never from `../service/` or `@/lib/api`.
- No inline `useForm` setup — all form state lives in a `useXxxForm` hook.
- Use `register()`/`Controller` for controlled inputs.

```tsx
export function LoginForm() {
  const navigate = useNavigate();
  const { form, onSubmit, mutation } = useLoginForm(() => navigate({ to: "/" }));
  const { register, formState: { errors } } = form;

  return (
    <form onSubmit={onSubmit}>
      <Input {...register("email")} />
      {errors.email && <p>{errors.email.message}</p>}
      <Button type="submit" disabled={mutation.isPending}>Entrar</Button>
    </form>
  );
}
```

## Form patterns

### Standard submit form (auth, add-to-library)

`useForm` + `zodResolver` + mutation inside a `useXxxForm` hook. Component calls `form.handleSubmit` via `onSubmit` returned by the hook.

### Auto-save form (detail screen)

`useForm` + `zodResolver` + `watch()` + per-field `useDebounce` + `useMutation`. All logic lives in `useDetailForm`. Component uses `Controller`/`register` with no local state for form fields.

## Query key conventions

| Key | Data |
|-----|------|
| `["me"]` | Authenticated user |
| `["library"]` | Full library list |
| `["library", igdbId]` | Single library entry |
| `["search", query]` | Game search results |
| `["stats"]` | Library statistics |

## Current features

| Feature | service/ | hooks/ | schema/ | Notes |
|---------|----------|--------|---------|-------|
| `auth` | `authService.ts` | `useAuth.ts` | `authSchema.ts` | `useLoginForm`, `useRegisterForm` |
| `library` | `libraryService.ts` | `useLibrary.ts` | — | `useLibrary`, `useAddToLibrary` |
| `search` | `searchService.ts` | `useGameSearch.ts`, `useAddToLibraryForm.ts` | `addToLibrarySchema.ts` | Search + add-to-library modal |
| `detail` | `detailService.ts` | `useLibraryEntry.ts`, `useDetailForm.ts` | `detailSchema.ts` | Auto-save with debounce |
| `stats` | `statsService.ts` | `useStats.ts` | — | Read-only stats query |
| `dashboard` | — | — | — | Uses `useLibrary()` from library feature |
| `landing` | — | — | — | No queries or mutations |
