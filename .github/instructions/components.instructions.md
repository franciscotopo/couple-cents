---
applyTo: "**/components/**/*.tsx"
---

# Components Instructions

UI components follow the compound components pattern for flexibility and composition.

## Key Conventions

- [ ] Use arrow functions for components
- [ ] Export named exports, not default exports
- [ ] Use `ComponentProps<"element">` or `ComponentProps<typeof Component>` for props
- [ ] Spread remaining props to allow customization
- [ ] Use `data-slot` attribute for compound component parts
- [ ] Use `tailwind-variants` (`tv`) for styling
- [ ] Pass `className` to the variant function to allow overrides

## ✅ DO

```typescript
import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

export const buttonVariants = tv({
  base: "inline-flex items-center justify-center rounded-md font-medium",
  variants: {
    variant: {
      primary: "bg-background-brand-default text-text-brand-on-brand",
      secondary: "bg-background-brand-secondary text-text-brand-on-brand-secondary",
    },
    size: {
      sm: "px-2 py-1 text-sm",
      default: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "default",
  },
});

type ButtonProps = ComponentProps<"button"> & VariantProps<typeof buttonVariants>;

export const Button = ({ variant, size, className, ...props }: ButtonProps) => {
  return <button className={buttonVariants({ variant, size, className })} data-slot="button" {...props} />;
};
```

## Compound Components Pattern

```typescript
import type { ComponentProps } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { tv } from "tailwind-variants";

const dialogVariants = tv({
  slots: {
    overlay: "fixed inset-0 z-50 bg-black/80",
    content: "fixed z-50 w-full max-w-lg rounded-lg bg-white p-6",
    title: "text-lg font-semibold",
  },
});

const { content, overlay, title } = dialogVariants();

const Root = ({ ...props }: ComponentProps<typeof DialogPrimitive.Root>) => {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
};

const Content = ({ children, className, ...props }: ComponentProps<typeof DialogPrimitive.Content>) => {
  return (
    <DialogPrimitive.Content className={content({ className })} data-slot="dialog-content" {...props}>
      {children}
    </DialogPrimitive.Content>
  );
};

// Export as namespace object
export const Dialog = { Root, Content, Title, Trigger };
```

## ❌ DON'T

```typescript
// ❌ Don't use function declarations
function Button(props: ButtonProps) {
  return <button {...props} />;
}

// ❌ Don't use default exports
export default Button;

// ❌ Don't forget to spread props
export const Button = ({ variant, className }: ButtonProps) => {
  return <button className={className} />; // ❌ Missing ...props
};

// ❌ Don't forget data-slot on compound components
const Content = (props: ContentProps) => {
  return <div {...props} />; // ❌ Missing data-slot
};

// ❌ Don't use raw className strings
export const Button = ({ className, ...props }) => {
  return <button className="inline-flex items-center px-4 py-2" {...props} />;
};

// ❌ Don't forget defaultVariants
export const buttonVariants = tv({
  base: "inline-flex",
  variants: {
    variant: { primary: "bg-blue-500" },
  },
  // ❌ Missing defaultVariants
});

// ❌ Don't forget to pass className to the variant function
export const Button = ({ variant, size, className, ...props }: ButtonProps) => {
  return <button className={buttonVariants({ variant, size })} {...props} />; // ❌ className not passed
};

// ❌ Don't use React.FC
const Button: React.FC<ButtonProps> = (props) => { ... };

// ❌ Don't export individual components for compound patterns
export const DialogRoot = Root;
export const DialogContent = Content;
```
