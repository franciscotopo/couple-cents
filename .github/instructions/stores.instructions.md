---
applyTo: "**/stores/*.ts"
---

# Stores Instructions

Zustand stores for client state management.

## Key Conventions

- [ ] Use `type` for state definition, not `interface`
- [ ] Use `persist` middleware for data that needs to survive page refresh
- [ ] Export granular selector hooks (e.g., `useAuthStoreToken`)
- [ ] Export actions as separate functions outside the hook
- [ ] Export `getState()` wrapper for non-React usage
- [ ] Don't put actions inside the store

## ✅ DO

```typescript
// stores/use-auth-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthStoreState = {
  token: string | null;
  user: User | null;
};

const useAuthStore = create<AuthStoreState>()(
  persist(
    (_) => ({
      token: null,
      user: null,
    }),
    { name: "auth" },
  ),
);

// Selector hooks (prefer granular selectors)
export const useAuthStoreToken = () => useAuthStore((s) => s.token);
export const useAuthStoreUser = () => useAuthStore((s) => s.user);

// Actions (outside of hook for use anywhere)
export const setAuthStoreToken = (token: string | null) => {
  useAuthStore.setState({ token });
};

export const setAuthStoreUser = (user: User | null) => {
  useAuthStore.setState({ user });
};

// For use outside React (e.g., in axios interceptors, beforeLoad)
export const getAuthStoreState = () => useAuthStore.getState();
```

## ❌ DON'T

```typescript
// ❌ Don't use interface
interface AuthStoreState {
  token: string | null;
}

// ❌ Don't put actions inside the store
const useAuthStore = create<AuthStoreState>()((set) => ({
  token: null,
  setToken: (token) => set({ token }), // ❌ Actions inside store
}));

// ❌ Don't export the entire store hook directly
export const useAuthStore = create<AuthStoreState>()(...);
// ❌ Consumers do: const { token, user } = useAuthStore() - causes re-renders

// ❌ Don't forget getState wrapper for non-React usage
// In axios interceptor:
const token = useAuthStore().token; // ❌ Can't use hooks outside React

// ❌ Don't select entire state
export const useAuth = () => useAuthStore((s) => s); // ❌ Re-renders on any change
```
