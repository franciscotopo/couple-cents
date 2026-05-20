import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";

const skeletonVariants = tv({
  base: "animate-pulse rounded-md bg-background-disabled-default",
});

const Skeleton = ({ className, ...props }: ComponentProps<"div">) => {
  return <div className={skeletonVariants({ className })} data-slot="skeleton" {...props} />;
};

export { Skeleton };
