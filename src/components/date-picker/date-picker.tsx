import type { ComponentProps } from "react";
import { format } from "date-fns";
import { tv } from "tailwind-variants";

import { dateLocale, useTranslation } from "@/i18n";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Icons } from "../ui/icons";
import { Popover } from "../ui/popover";

const datePickerVariants = tv({
  slots: {
    trigger: [
      "flex w-full justify-between rounded-md border border-border-default-default shadow-none",
      "px-3 py-2.5 text-base font-normal text-text-default-default transition-colors md:text-sm",
      "focus-visible:outline-border-brand-default data-[empty=true]:text-text-default-tertiary",
      "disabled:cursor-not-allowed disabled:bg-background-disabled-default disabled:text-text-disabled-on-disabled",
    ],
  },
});

const { trigger } = datePickerVariants();

type DatePickerProps = {
  onChange: (date: Date | undefined) => void;
  value: Date | undefined;
  align?: ComponentProps<typeof Popover.Content>["align"];
} & Omit<ComponentProps<typeof Calendar>, "mode" | "onSelect" | "selected">;

export const DatePicker = ({ align = "end", onChange, value, ...props }: DatePickerProps) => {
  const { t } = useTranslation();

  return (
    <Popover.Root data-slot="date-picker">
      <Popover.Trigger asChild>
        <Button
          className={trigger()}
          data-empty={!value}
          data-slot="date-picker-trigger"
          size="lg"
          variant="outlined"
        >
          {value ? (
            format(value, "PPP", { locale: dateLocale })
          ) : (
            <span>{t("form.datePicker.placeholder")}</span>
          )}

          <Icons.ChevronDown />
        </Button>
      </Popover.Trigger>

      <Popover.Content align={align}>
        <Calendar
          defaultMonth={value}
          mode="single"
          onSelect={onChange}
          selected={value}
          {...props}
        />
      </Popover.Content>
    </Popover.Root>
  );
};
