---
applyTo: "**/*.stories.tsx"
---

# Storybook Instructions

Component documentation with Storybook.

## Key Conventions

- [ ] Colocate stories with components
- [ ] Use `Meta` and `StoryObj` types from `@storybook/react`
- [ ] Export `meta` as default
- [ ] Create stories for each variant/state
- [ ] Use meaningful story names

## ✅ DO

```typescript
import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outlined"],
    },
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: "Primary Button",
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary Button",
    variant: "secondary",
  },
};

export const Loading: Story = {
  args: {
    children: "Loading...",
    isLoading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
  },
};
```

## File Structure

```
components/ui/button/
├── button.tsx
├── button.stories.tsx
└── index.ts
```

## ❌ DON'T

```typescript
// ❌ Don't use CSF2 format
export default {
  title: "Button",
  component: Button,
};

export const Primary = () => <Button>Click me</Button>; // ❌ Use StoryObj

// ❌ Don't forget tags for autodocs
const meta: Meta<typeof Button> = {
  component: Button,
  // ❌ Missing tags: ["autodocs"]
};

// ❌ Don't use vague story names
export const Story1: Story = { ... }; // ❌ Use descriptive names
```
