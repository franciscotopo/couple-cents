---
applyTo: "**/use*.ts,**/use*.tsx"
---

# Hooks Instructions

Custom React hooks.

## Key Conventions

- [ ] Prefix hook names with `use`
- [ ] Return objects with `actions` property for state modifiers
- [ ] Use route path parameter for route-specific hooks
- [ ] Debounce user input with `useDebounce`
- [ ] Use arrow functions

## ✅ DO

```typescript
// use-pagination.ts
export const usePagination = (routePath: string) => {
  const navigate = useNavigate();
  const { page } = useSearch({ from: routePath });

  const changePage = (newPage: number) => {
    navigate({ search: (prev) => ({ ...prev, page: newPage }) });
  };

  const resetPage = () => {
    navigate({ search: (prev) => ({ ...prev, page: 1 }) });
  };

  return {
    page,
    pageIndex: page - 1,
    actions: {
      changePage,
      resetPage,
    },
  };
};

// use-search-text.ts
export const useSearchText = (routePath: string) => {
  const navigate = useNavigate();
  const { searchText } = useSearch({ from: routePath });

  const setSearchText = (value: string) => {
    navigate({ search: (prev) => ({ ...prev, searchText: value }) });
  };

  const setPaginatedSearchText = (value: string) => {
    navigate({ search: (prev) => ({ ...prev, searchText: value, page: 1 }) });
  };

  return {
    searchText,
    actions: {
      setSearchText,
      setPaginatedSearchText,
    },
  };
};

// use-debounce.ts
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};
```

## Usage Examples

```typescript
// In component
const { page, pageIndex, actions: { changePage, resetPage } } = usePagination("/_private/users");

const { searchText, actions: { setPaginatedSearchText } } = useSearchText("/_private/users");

const debouncedSearch = useDebounce(searchText, 500);
```

## ❌ DON'T

```typescript
// ❌ Don't forget use prefix
export const pagination = () => { ... };

// ❌ Don't return flat objects without actions grouping
export const usePagination = () => {
  return {
    page,
    changePage, // ❌ Should be in actions
    resetPage,  // ❌ Should be in actions
  };
};

// ❌ Don't use function declarations
function usePagination() { ... }
```
