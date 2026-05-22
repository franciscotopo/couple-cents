import { forwardRef, useId, useState } from "react";
import { cn } from "tailwind-variants";

import type { Option, Styled } from "@/types";
import { Command } from "../ui/command";
import { Icons } from "../ui/icons";
import { Popover } from "../ui/popover";

type ComboboxProps = {
  options: Option<string>[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
} & Styled;

export const Combobox = forwardRef<HTMLButtonElement, ComboboxProps>(
  (
    {
      className,
      emptyMessage = "No results found.",
      onChange,
      options,
      placeholder = "Select option...",
      searchPlaceholder = "Search...",
      value,
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const listboxId = useId();

    const selectedOption = options.find((option) => {
      return option.value === value;
    });

    return (
      <Popover.Root onOpenChange={setOpen} open={open}>
        <Popover.Trigger asChild>
          <button
            aria-controls={listboxId}
            aria-expanded={open}
            className={cn(
              "flex min-w-full items-center justify-between gap-2 px-3 py-2.5",
              "rounded-md border border-border-default-default text-sm",
              "cursor-pointer transition-[color,box-shadow] outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50",
              className,
            )}
            ref={ref}
            role="combobox"
            type="button"
          >
            <span
              className={cn(
                "line-clamp-1 text-left",
                !selectedOption && "text-text-disabled-default",
              )}
            >
              {selectedOption?.label || placeholder}
            </span>
            <Icons.ChevronDown className="size-4 shrink-0 text-text-disabled-default" />
          </button>
        </Popover.Trigger>

        <Popover.Content align="start" className="w-(--radix-popover-trigger-width) p-0">
          <Command.Root id={listboxId}>
            <Command.Input placeholder={searchPlaceholder} />
            <Command.List>
              <Command.Empty>{emptyMessage}</Command.Empty>
              <Command.Group>
                {options.map((option) => {
                  return (
                    <Command.Item
                      className={value === option.value ? "font-medium" : "font-normal"}
                      key={option.value}
                      onSelect={() => {
                        onChange?.(option.value);
                        setOpen(false);
                      }}
                      value={option.label}
                    >
                      <Icons.Check
                        className={cn(
                          "size-4",
                          value === option.value ? "opacity-100" : "opacity-0",
                        )}
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
    );
  },
);

Combobox.displayName = "Combobox";
