import { useEffect, useRef, useState } from "react";
import { tv } from "tailwind-variants";

import { Badge } from "@/components/ui/badge";
import { Command } from "@/components/ui/command";
import { Icons } from "@/components/ui/icons";
import { Popover } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import type { Option } from "@/types";

const multiSelectVariants = tv({
  slots: {
    root: "w-full",
    trigger: [
      "flex w-full cursor-pointer items-center justify-between rounded-md border border-border-default-default bg-background-default-default text-sm transition-all",
      "focus-visible:ring-4 focus-visible:ring-background-brand-default/25 focus-visible:outline-none",
      "disabled:cursor-not-allowed disabled:opacity-50",
    ],
    chevronWrapper: [
      "mx-1.5 h-full rounded-lg p-1 outline-none",
      "focus-visible:ring-4 focus-visible:ring-background-brand-default/25 focus-visible:outline-none",
    ],
    checkIcon: "size-4",
  },
});

type MultiSelectProps = {
  options: Option<string>[];
  value: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
  isLoading?: boolean;
  disabled?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
};

export const MultiSelect = ({
  className,
  disabled = false,
  emptyMessage = "No items found.",
  isLoading = false,
  onChange,
  options,
  placeholder = "Select items...",
  searchPlaceholder = "Search...",
  value,
}: MultiSelectProps) => {
  const [open, setOpen] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const [contentWidth, setContentWidth] = useState<string | undefined>(undefined);

  const { checkIcon, chevronWrapper, root, trigger } = multiSelectVariants();

  useEffect(() => {
    if (open && triggerRef.current) {
      setContentWidth(`${triggerRef.current.offsetWidth}px`);
    }
  }, [open]);

  const handleUnselect = (item: string) => {
    onChange(
      value.filter((i) => {
        return i !== item;
      }),
    );
  };

  const handleSelect = (item: string) => {
    if (value.includes(item)) {
      handleUnselect(item);
    } else {
      onChange([...value, item]);
    }
  };

  return (
    <div className={root({ className })}>
      <Popover.Root onOpenChange={setOpen} open={open}>
        <Popover.Trigger
          aria-expanded={open}
          className={trigger()}
          disabled={disabled}
          ref={triggerRef}
        >
          <div className="flex flex-1 justify-between overflow-hidden">
            <div
              className="flex flex-1 gap-1 overflow-x-auto px-3 py-2.5"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "hsl(var(--border)) transparent",
              }}
            >
              {value.length === 0 ? (
                <span className="truncate text-text-disabled-default">{placeholder}</span>
              ) : (
                value.map((item) => {
                  const option = options?.find((opt) => {
                    return opt.value === item;
                  });

                  return (
                    <Badge
                      key={item}
                      onClick={(e) => {
                        e.stopPropagation();

                        return handleUnselect(item);
                      }}
                      size="xs"
                      variant="outline"
                    >
                      {option?.label}

                      <Icons.X />
                    </Badge>
                  );
                })
              )}
            </div>

            <span
              className={chevronWrapper()}
              onClick={(e) => {
                e.stopPropagation();
                setOpen((prev) => {
                  return !prev;
                });
              }}
              onKeyDown={(e) => {
                e.stopPropagation();
                setOpen((prev) => {
                  return !prev;
                });
              }}
              role="button"
              tabIndex={0}
            >
              <Icons.ChevronDown className="size-4 shrink-0 text-text-disabled-default opacity-50" />
            </span>
          </div>
        </Popover.Trigger>

        <Popover.Content style={{ width: contentWidth }}>
          <Command.Root className="w-full">
            <Command.Input placeholder={searchPlaceholder} />

            <Command.List>
              <Command.Empty>
                {isLoading ? (
                  <div className="space-y-1">
                    {Array.from({ length: 4 }, (_, index) => {
                      return index;
                    }).map((value) => {
                      return <Skeleton className="h-7 w-full" key={`skeleton-${value}`} />;
                    })}
                  </div>
                ) : (
                  <div className="py-2 text-center text-sm text-text-disabled-default">
                    {emptyMessage}
                  </div>
                )}
              </Command.Empty>
              <Command.Group>
                {options.map((option) => {
                  const isSelected = value.includes(option.value);

                  return (
                    <Command.Item
                      className={isSelected ? "font-medium" : "font-normal"}
                      key={option.value}
                      onSelect={() => {
                        return handleSelect(option.value);
                      }}
                      // cmdk uses this label for its internal value tracking & searching - we are handling state internally with the onSelect above
                      value={option.label}
                    >
                      <Icons.Check
                        className={checkIcon({
                          className: isSelected ? "opacity-100" : "opacity-0",
                        })}
                      />
                      {option.label}
                    </Command.Item>
                  );
                })}
              </Command.Group>
            </Command.List>
          </Command.Root>
        </Popover.Content>
      </Popover.Root>
    </div>
  );
};
