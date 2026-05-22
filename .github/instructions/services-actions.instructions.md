---
applyTo: "**/services/**/actions.ts"
---

# Actions Files Instructions

React Query hooks (`useQuery`, `useMutation`) that consume factories.

## Key Conventions

- [ ] Import `queryClient` from `@/config/query-client` (not `useQueryClient` hook)
- [ ] Use factories from `./factories`
- [ ] Spread `props` to allow customization
- [ ] Invalidate queries on mutations
- [ ] Call `props?.onSuccess?.(...args)` after invalidation
- [ ] Use `UseQueryProps` and `UseMutationProps` types from `@/services/types`

## ✅ DO

```typescript
import { useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "@/config/query-client";
import type { RequestParams, UseMutationProps, UseQueryProps } from "@/services/types";
import { mutations, queries } from "./factories";
import type { User, UsersFilter } from "./types";

export const useUser = (id: User["id"], props?: UseQueryProps<typeof queries.detail>) => {
  return useQuery({ ...queries.detail(id), ...props });
};

export const useUsers = (
  params: RequestParams<UsersFilter>,
  props?: UseQueryProps<typeof queries.list>,
) => {
  return useQuery({ ...queries.list(params), ...props });
};

export const useCreateUser = (props?: UseMutationProps<typeof mutations.create>) => {
  return useMutation({
    mutationFn: mutations.create,
    ...props,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queries.list._def });
      props?.onSuccess?.(...args);
    },
  });
};
```

## ❌ DON'T

```typescript
// ❌ Don't define query keys inline
export const useUsers = () => {
  return useQuery({ queryKey: ["users"], queryFn: fetchUsers });
};

// ❌ Don't use useQueryClient hook - use singleton from @/config/query-client
export const useCreateUser = (props?: UseMutationProps<typeof mutations.create>) => {
  const queryClient = useQueryClient(); // ❌ Import queryClient instead
  return useMutation({ mutationFn: mutations.create });
};

// ❌ Don't forget to invalidate queries on mutations
export const useCreateUser = () => {
  return useMutation({ mutationFn: createUser });
};

// ❌ Don't forget to call props?.onSuccess after invalidation
export const useCreateUser = (props?: UseMutationProps<typeof mutations.create>) => {
  return useMutation({
    mutationFn: mutations.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.list._def });
      // ❌ Missing: props?.onSuccess?.(...args);
    },
  });
};

// ❌ Don't skip spreading props
export const useUsers = (params: RequestParams<UsersFilter>) => {
  return useQuery({ ...queries.list(params) }); // ❌ Missing props spread
};

// ❌ Don't force types when they can be inferred from factories
export const useUsers = (
  params: RequestParams<UsersFilter>,
  props?: UseQueryProps<typeof queries.list>,
): UseQueryResult<User[], Error> => {
  return useQuery<User[], Error>({ ...queries.list(params), ...props });
};
```
