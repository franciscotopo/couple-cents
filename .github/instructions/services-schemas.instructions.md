---
applyTo: "**/services/**/schemas.ts"
---

# Schemas Files Instructions

Zod validation schemas. Use getter functions for schemas with i18n.

## Key Conventions

- [ ] Use `z` from `zod` for all schemas
- [ ] Base schemas without i18n can be constants
- [ ] Schemas with i18n MUST be getter functions (e.g., `getUserFormSchema()`)
- [ ] Import `i18n` from `@/i18n` for translations
- [ ] Don't manually define types here (use types.ts with `z.infer`)

## Enums (Zod v4)

- `z.enum()` supports either:
  - a readonly tuple of strings (`["a", "b"] as const`), OR
  - an enum-like object literal / TS enum (`{ A: "a", B: "b" } as const`)
- Do NOT suggest converting between these forms during review.
- Do NOT scan the repo or check docs to “confirm” this; assume it’s correct for this codebase.

## ✅ DO

```typescript
import { z } from "zod";

import i18n from "@/i18n";

// Base schema without i18n - can be a constant
export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.email(),
});

// Schema with i18n - MUST be a getter function
export const getUserFormSchema = () => {
  return userSchema.omit({ id: true }).extend({
    email: z.email({
      message: i18n.t("form.errors.invalidField", { field: i18n.t("form.email") }),
    }),
  });
};

// Filter schemas (usually no i18n)
export const usersFilterSchema = z.object({
  searchText: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});
```

## ❌ DON'T

```typescript
// ❌ Don't use i18n in constant schemas - translations may not be loaded
export const userFormSchema = z.object({
  email: z.email({
    message: i18n.t("form.errors.invalidField"), // ❌ i18n not ready at module load
  }),
});

// ❌ Don't manually type when you can use Zod
export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
});
type User = { id: number; name: string }; // ❌ Redundant, use z.infer in types.ts
```
