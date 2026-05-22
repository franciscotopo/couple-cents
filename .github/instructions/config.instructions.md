---
applyTo: "**/config/*.ts"
---

# Config Instructions

App configuration files (API, router, query client, env).

## Environment Variables

- [ ] All env vars are validated using `@t3-oss/env-core`
- [ ] Client-side vars must have `VITE_` prefix
- [ ] Access via `env.VITE_*` not `import.meta.env`
- [ ] Empty strings are treated as undefined

```typescript
// config/env.ts
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_APP_NAME: z.string().min(1),
    VITE_APP_ENV: z.enum(["local", "development", "staging", "production"]),
    VITE_API_URL: z.string().min(1),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
});
```

## API Configuration

- [ ] Create separate `publicApi` and `privateApi` axios instances
- [ ] Use `getAuthStoreState()` in interceptors (not hooks)
- [ ] Handle 401 responses by clearing auth token
- [ ] Set `Authorization` header in request interceptor

```typescript
// config/api.ts
import axios, { HttpStatusCode } from "axios";
import { getAuthStoreState, setAuthStoreToken } from "@/stores";
import { env } from "./env";

// Public API (no auth required)
export const publicApi = axios.create({
  baseURL: env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

// Private API (with auth token)
export const privateApi = axios.create({
  baseURL: env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

privateApi.interceptors.request.use((config) => {
  const { token } = getAuthStoreState();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

privateApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === HttpStatusCode.Unauthorized) {
      setAuthStoreToken(null);
    }
    return Promise.reject(error);
  },
);
```

## ❌ DON'T

```typescript
// ❌ Don't access env vars directly
const apiUrl = import.meta.env.VITE_API_URL; // ❌ Not validated

// ❌ Don't use process.env in client code
const apiUrl = process.env.VITE_API_URL; // ❌ Doesn't work in Vite

// ❌ Don't use hooks in interceptors
privateApi.interceptors.request.use((config) => {
  const token = useAuthStoreToken(); // ❌ Can't use hooks outside React
  return config;
});

// ❌ Don't create a single api instance for both public and private
export const api = axios.create({ baseURL: env.VITE_API_URL });

// ❌ Don't forget to handle 401 errors
privateApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error), // ❌ 401 not handled
);

// ❌ Don't hardcode the base URL
export const api = axios.create({
  baseURL: "https://api.example.com", // ❌ Use env.VITE_API_URL
});
```
