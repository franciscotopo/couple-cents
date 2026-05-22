---
applyTo: "**/services/**/api.ts"
---

# API Files Instructions

Raw axios requests. No React Query logic here.

## Key Conventions

- [ ] Keep pure async functions only
- [ ] No side effects (toasts, state updates)
- [ ] No React Query hooks
- [ ] No type definitions (use types.ts)
- [ ] Import types from `./types`
- [ ] Use `publicApi` or `privateApi` from `@/config/api`

## ✅ DO

```typescript
import { publicApi } from "@/config/api";
import type { CreateUser, User } from "./types";

export const getUsersList = async ({ filter, page }: UserRequestParams) => {
  const response = await publicApi.get("users", { params: { page, filter } });
  return parsePaginatedResponse(z.array(userSchema), response.data);
};

export const createUser = async (data: CreateUser) => {
  return publicApi.post("users", deepSnakeKeys(data));
};
```

## ❌ DON'T

```typescript
// ❌ Don't use React Query hooks in api.ts
import { useQuery } from "@tanstack/react-query";

export const useGetUsers = () => {
  return useQuery({ queryKey: ["users"], queryFn: fetchUsers });
};

// ❌ Don't define types here - use types.ts
export type User = { id: number; name: string };

// ❌ Don't mix concerns - keep it pure async functions
export const getUsersList = async () => {
  const response = await publicApi.get("users");
  toast.success("Users loaded!"); // ❌ No side effects
  return response.data;
};
```
