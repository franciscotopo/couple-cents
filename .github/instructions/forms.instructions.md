---
applyTo: "**/*.tsx"
---

# Forms Instructions

Forms with React Hook Form + Zod.

## Key Conventions

- [ ] Use `zodResolver` from `@hookform/resolvers/zod`
- [ ] Call getter schema functions inside components (e.g., `getUserSchema()`)
- [ ] Provide `defaultValues` for all form fields
- [ ] Use `form.handleSubmit` for form submission
- [ ] Access errors via `form.formState.errors`
- [ ] Destructure mutation hooks and rename `mutate` to a descriptive action name
- [ ] Pass callbacks (`onSuccess`, `onError`) to `.mutate()`, not to the hook
- [ ] Use `useTranslation` from `@/i18n` for all user-facing strings

## ✅ DO

```typescript
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useTranslation } from "@/i18n";
import { useCreateUser } from "@/services/users/actions";
import { getCreateUserSchema } from "@/services/users/schemas";
import type { CreateUser } from "@/services/users/types";
import { handleAxiosFieldErrors } from "@/utils";

const UserForm = () => {
  const { t } = useTranslation();

  // Destructure and rename mutate to a descriptive action name
  const { isPending, mutate: createUser } = useCreateUser();

  const form = useForm<CreateUser>({
    resolver: zodResolver(getCreateUserSchema()), // Call getter inside component
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const onSubmit: SubmitHandler<CreateUser> = (data) => {
    // Pass callbacks to mutate(), not to the hook
    createUser(data, {
      onSuccess: () => {
        toast.success(t("users.created"));
        form.reset();
      },
      onError: (error) => {
        handleAxiosFieldErrors(error, form.setError, t("users.error"));
      },
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Input {...form.register("name")} />
      <ErrorMessage>{form.formState.errors.name?.message}</ErrorMessage>

      <Button isLoading={isPending} type="submit">
        {t("buttons.submit")}
      </Button>
    </form>
  );
};
```

## ❌ DON'T

```typescript
// ❌ Don't use the mutation hook without destructuring
const createUserMutation = useCreateUserMutation();
createUserMutation.mutate(data); // ❌ Verbose

// ❌ Don't forget to rename mutate to a descriptive name
const { mutate } = useCreateUserMutation();
mutate(data); // ❌ Not descriptive

// ❌ Don't call getter schema at module level
const schema = getUserSchema(); // ❌ i18n may not be loaded

const UserForm = () => {
  const form = useForm({
    resolver: zodResolver(schema),
  });
};

// ❌ Don't forget defaultValues
const form = useForm({
  resolver: zodResolver(schema),
  // ❌ Missing defaultValues - can cause issues with controlled inputs
});

// ❌ Don't handle submit manually without handleSubmit
const UserForm = () => {
  const form = useForm();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const data = form.getValues(); // ❌ Bypasses validation
    mutation.mutate(data);
  };
};

// ❌ Don't use inline validation - use Zod schemas
const form = useForm({
  defaultValues: { email: "" },
  rules: {
    email: { required: true, pattern: /email/ }, // ❌ Don't use inline rules
  },
});

// ❌ Don't use hardcoded strings
toast.success("User created!"); // ❌ Use t("users.created")
```
