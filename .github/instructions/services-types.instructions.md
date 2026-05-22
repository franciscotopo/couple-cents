---
applyTo: "**/services/**/types.ts"
---

# Types Files Instructions

TypeScript types inferred from Zod schemas.

## Key Conventions

- [ ] Use `type` not `interface`
- [ ] Infer types from Zod schemas using `z.infer`
- [ ] Use `ReturnType<typeof getSchema>` for getter schema functions
- [ ] Import schemas with `import type` where possible
- [ ] Don't manually define types that can be inferred

## ✅ DO

```typescript
import type { z } from "zod";

import type { getCreateUserSchema, getUserSchema, usersFilterSchema } from "./schemas";

// Infer types from Zod schemas
export type User = z.infer<ReturnType<typeof getUserSchema>>;
export type UsersFilter = z.infer<typeof usersFilterSchema>;
export type CreateUser = z.infer<ReturnType<typeof getCreateUserSchema>>;
```

## ❌ DON'T

```typescript
// ❌ Don't manually define types that can be inferred
export type User = {
  id: number;
  name: string;
  email: string;
};

// ❌ Don't use interface - use type
export interface User {
  id: number;
}

// ❌ Don't forget ReturnType for getter schemas
export type CreateUser = z.infer<typeof getCreateUserSchema>; // ❌ Wrong for getter functions
```
