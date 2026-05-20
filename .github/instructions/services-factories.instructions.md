---
applyTo: "**/services/**/factories.ts"
---

# Factories Files Instructions

Query key factories using `@lukemorales/query-key-factory`.

## Key Conventions

- [ ] Use `createQueryKeys` from `@lukemorales/query-key-factory`
- [ ] Export `queries` for query definitions
- [ ] Export `mutations` object with mutation functions
- [ ] Import API functions from `./api`
- [ ] Import types from `./types`

## ✅ DO

```typescript
import { createQueryKeys } from "@lukemorales/query-key-factory";

import { createUser, deleteUser, getUser, getUsers, updateUser } from "./api";
import type { User } from "./types";

export const queries = createQueryKeys("users", {
  detail: (id: User["id"]) => ({
    queryKey: [id],
    queryFn: () => getUser(id),
  }),
  list: (params) => ({
    queryKey: [params],
    queryFn: () => getUsers(params),
  }),
});

export const mutations = {
  create: createUser,
  delete: deleteUser,
  update: updateUser,
};
```

## ❌ DON'T

```typescript
// ❌ Don't use string arrays directly
export const USERS_QUERY_KEY = ["users"];

// ❌ Don't define queryFn inline without the factory
export const getUsersQuery = {
  queryKey: ["users"],
  queryFn: async () => await fetch("/users"),
};

// ❌ Don't put hooks here
export const useUsers = () => useQuery({ queryKey: ["users"] });
```
