---
applyTo: "**/routes/**/*.tsx"
---

# Routes Instructions

TanStack Router file-based routing with type safety.

## File Naming Conventions

- `__root.tsx` - Root layout (wraps all routes)
- `layout.tsx` - Layout for route group
- `page.tsx` - Page component for the route
- `dashboard.page.tsx` - Named page (becomes /dashboard)
- `_private/` - Layout route prefix (requires auth guard)
- `(public)/` - Route group (no URL segment)
- `_guest/` - Guest-only layout

## Key Conventions

- [ ] Use `createFileRoute` from `@tanstack/react-router`
- [ ] Implement route guards in layout files using `beforeLoad`
- [ ] Use `redirect` from TanStack Router for navigation guards
- [ ] Access auth state using `getAuthStoreState()` (not hooks) in `beforeLoad`
- [ ] Validate search params with Zod schemas using `validateSearch`
- [ ] Pass redirect URL in search params when redirecting to login

## Route Guards

```typescript
// routes/_private/layout.tsx
import { createFileRoute, redirect } from "@tanstack/react-router";

import { getAuthStoreState } from "@/stores";

export const Route = createFileRoute("/_private")({
  beforeLoad: ({ location }) => {
    const { token } = getAuthStoreState();

    if (!token) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
  component: PrivateLayout,
});
```

## Search Params Validation

```typescript
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const searchParamsSchema = z.object({
  page: z.number().default(1),
  searchText: z.string().optional(),
});

export const Route = createFileRoute("/_private/users")({
  validateSearch: searchParamsSchema,
  component: UsersPage,
});

// In component - params are typed and validated
const UsersPage = () => {
  const { page, searchText } = Route.useSearch();
};
```

## ❌ DON'T

```typescript
// ❌ Don't use hooks in beforeLoad - it's not a React component
export const Route = createFileRoute("/_private")({
  beforeLoad: () => {
    const token = useAuthStoreToken(); // ❌ Can't use hooks here
  },
});

// ❌ Don't use navigate instead of redirect in beforeLoad
export const Route = createFileRoute("/_private")({
  beforeLoad: () => {
    const { token } = getAuthStoreState();
    if (!token) {
      navigate({ to: "/login" }); // ❌ Use throw redirect() instead
    }
  },
});

// ❌ Don't forget to pass redirect URL in search params
export const Route = createFileRoute("/_private")({
  beforeLoad: ({ location }) => {
    const { token } = getAuthStoreState();
    if (!token) {
      throw redirect({ to: "/login" }); // ❌ Missing search: { redirect: location.href }
    }
  },
});

// ❌ Don't access search params without validation
const UsersPage = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const page = searchParams.get("page"); // ❌ Untyped, unvalidated
};

// ❌ Don't forget default values for required params
const searchParamsSchema = z.object({
  page: z.number(), // ❌ Missing .default(1)
});
```
