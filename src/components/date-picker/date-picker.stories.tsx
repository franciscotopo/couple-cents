import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { isBefore, startOfDay } from "date-fns";

import { DatePicker } from "./date-picker";

const meta: Meta<typeof DatePicker> = {
  component: DatePicker,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Components/DatePicker",
} satisfies Meta<typeof DatePicker>;

export default meta;

type Story = StoryObj<typeof DatePicker>;

export const Basic: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(undefined);

    return (
      <div className="w-64">
        <DatePicker onChange={setDate} value={date} />
      </div>
    );
  },
};

export const WithDefaultValue: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
      <div className="w-64">
        <DatePicker onChange={setDate} value={date} />
      </div>
    );
  },
};

export const WithDisabledDates: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(undefined);

    return (
      <div className="w-64">
        <DatePicker
          disabled={(date) => {
            return isBefore(startOfDay(date), startOfDay(new Date()));
          }}
          onChange={setDate}
          value={date}
        />
      </div>
    );
  },
};
