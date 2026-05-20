# Copilot Instructions for React Template

This document provides general guidelines and conventions for working with this React boilerplate repository. For specific file patterns, see the modular instruction files in `.github/instructions/`.

## Instruction Files Structure

The instruction files are organized by two categories:

### Structural Rules (enforce WHERE code goes)

These use specific paths because they enforce project structure:

| File | Pattern | Purpose |
|------|---------|---------|
| `services-api.instructions.md` | `**/services/**/api.ts` | API layer conventions |
| `services-actions.instructions.md` | `**/services/**/actions.ts` | React Query hooks |
| `services-factories.instructions.md` | `**/services/**/factories.ts` | Query key factories |
| `services-schemas.instructions.md` | `**/services/**/schemas.ts` | Zod schemas |
| `services-types.instructions.md` | `**/services/**/types.ts` | Type definitions |
| `routes.instructions.md` | `**/routes/**/*.tsx` | TanStack Router routes |
| `stores.instructions.md` | `**/stores/*.ts` | Zustand stores |
| `config.instructions.md` | `**/config/*.ts` | App configuration |

### Pattern Rules (enforce HOW code is written)

These use broader patterns because they apply regardless of file location:

| File | Pattern | Purpose |
|------|---------|---------|
| `components.instructions.md` | `**/components/**/*.tsx` | Component conventions |
| `hooks.instructions.md` | `**/use-*.ts,**/use*.ts` | Custom hooks (by naming) |
| `forms.instructions.md` | `**/*.tsx` | React Hook Form + Zod |
| `i18n.instructions.md` | `**/*.tsx,**/*.ts` | Internationalization |
| `storybook.instructions.md` | `**/*.stories.tsx` | Storybook stories |

---

## Tech Stack

### Core Libraries

| Library | Purpose |
|---------|---------|
| **React 19** | UI library |
| **TypeScript** | Type safety |
| **Vite** | Build tool and dev server |
| **TanStack Router** | File-based routing with type safety |
| **TanStack Query** | Server state management (data fetching, caching) |
| **TanStack Table** | Headless table utilities |
| **React Hook Form** | Form state management |
| **Zod** | Schema validation |
| **Zustand** | Client state management |
| **Axios** | HTTP client |
| **i18next** | Internationalization |
| **Sonner** | Toast notifications |

### UI & Styling

| Library | Purpose |
|---------|---------|
| **Tailwind CSS v4** | Utility-first CSS |
| **Radix UI** | Headless UI primitives |
| **Tailwind Variants** | Component variants with Tailwind |
| **Iconify** | Icon library |

### Developer Experience

| Tool | Purpose |
|------|---------|
| **ESLint** | Linting with strict rules |
| **Prettier** | Code formatting |
| **Husky** | Git hooks |
| **Storybook** | Component documentation |
| **Sentry** | Error monitoring |
| **PostHog** | Analytics |

---

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── ui/              # Base UI components (Button, Input, Dialog, etc.)
├── config/              # App configuration (API, router, query client, env)
├── constants/           # Application constants
├── hooks/               # Custom React hooks
├── i18n/                # Internationalization setup and locale files
├── routes/              # TanStack Router file-based routes
│   ├── __root.tsx       # Root layout
│   ├── _private/        # Authenticated routes
│   └── (public)/        # Public routes
├── services/            # API services (organized by domain)
├── stores/              # Zustand stores
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

---

## Services Pattern

**⚠️ MANDATORY: All API interactions MUST go through the services layer.**

When creating or modifying features that involve API calls:

1. **Create the service domain folder** if it doesn't exist (e.g., `services/users/`)
2. **Create all 6 required files** with proper structure
3. **Never make API calls directly** from components, routes, or hooks
4. **Always import from the specific service files** (e.g. `@/services/users/actions`, `@/services/users/schemas`, `@/services/users/types`) — no barrel files (`index.ts`).

Services are organized by domain (e.g., `auth`, `users`) with a consistent file structure:

```
services/
└── users/
    ├── api.ts           # API calls (axios requests)
    ├── actions.ts       # React Query hooks (useQuery, useMutation)
    ├── factories.ts     # Query key factories using @lukemorales/query-key-factory
    ├── schemas.ts       # Zod validation schemas
    └── types.ts         # TypeScript types (inferred from Zod schemas)
```

### Key Conventions

- [ ] Each service domain has its own folder under `services/`
- [ ] All 5 files (`api.ts`, `actions.ts`, `factories.ts`, `schemas.ts`, `types.ts`) must exist
- [ ] Do not add barrel files (`index.ts`); import directly from the file you need
- [ ] Types are inferred from Zod schemas, not manually defined
- [ ] Schemas with i18n use getter functions (e.g., `getUserSchema()`)

### ❌ DON'T

```typescript
// ❌ Don't make API calls directly in components
const UserList = () => {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    axios.get("/users").then((res) => setUsers(res.data)); // ❌ Direct API call
  }, []);
};

// ❌ Don't use useQuery/useMutation outside of services/actions.ts
const UserList = () => {
  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: () => axios.get("/users"), // ❌ Should be in services
  });
};

// ❌ Don't define types outside of services/types.ts
type User = { id: number; name: string }; // ❌ Should be in services/users/types.ts
```

### ✅ DO

```typescript
// ✅ Use the services layer — import from specific service files (no barrel files)
import { useUsers } from "@/services/users/actions";
import type { User } from "@/services/users/types";

const UserList = () => {
  const { data: users } = useUsers({ page: 1 });
  
  return <ul>{users?.map((user) => <li key={user.id}>{user.name}</li>)}</ul>;
};
```

> See specific instruction files for detailed rules on each service file.

---

## Code Style Guidelines

### ESLint Rules

| Rule | Description |
|------|-------------|
| Arrow functions | Preferred over function declarations |
| Curly braces | Required for all control statements |
| No console.log | Warning in development |
| Sorted imports | React first, then external, then internal |
| Sorted props | Alphabetically in JSX |
| Kebab-case | For file names |
| No unused vars | Error on unused imports/variables |
| i18next/no-literal-string | Warn on hardcoded strings |

### TypeScript Conventions

- [ ] Use `type` over `interface` for type definitions
- [ ] Use consistent type imports: `import type { X } from "y"`
- [ ] Infer types from Zod schemas when possible
- [ ] Use `ComponentProps<"element">` for HTML element props
- [ ] Use `ComponentProps<typeof Component>` for component props

✅ **DO:**

```typescript
// Use type
type User = {
  id: number;
  name: string;
};

// Use type imports
import type { User } from "./types";
import type { ComponentProps } from "react";

// Infer from Zod
type CreateUser = z.infer<ReturnType<typeof getCreateUserSchema>>;

// Component props
type ButtonProps = ComponentProps<"button"> & VariantProps<typeof buttonVariants>;
```

❌ **DON'T:**

```typescript
// ❌ Don't use interface
interface User {
  id: number;
  name: string;
}

// ❌ Don't mix type and value imports
import { User, createUser } from "./types"; // ❌ User should be type import

// ❌ Don't manually define types that can be inferred
type User = { id: number; name: string }; // ❌ When you have userSchema

// ❌ Don't use React.FC
const Button: React.FC<ButtonProps> = (props) => { ... }; // ❌ Use regular function
```

### Component Conventions

- [ ] Use `ComponentProps<"element">` or `ComponentProps<typeof Component>` for props
- [ ] Spread remaining props to allow customization
- [ ] Use `data-slot` attribute for compound component parts
- [ ] Use arrow functions for components
- [ ] Export named exports, not default exports

---

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Fix ESLint errors |
| `pnpm format` | Format with Prettier |
| `pnpm type-check` | Run TypeScript compiler |
| `pnpm fixer` | Run all linting, formatting, and type checking |
| `pnpm storybook` | Start Storybook |
| `pnpm test` | Run tests |
