import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { MultiSelect } from "./multi-select";

const meta: Meta<typeof MultiSelect> = {
  title: "Components/MultiSelect",
  component: MultiSelect,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof MultiSelect>;

export default meta;

type Story = StoryObj<typeof MultiSelect>;

const options = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Blueberry", value: "blueberry" },
  { label: "Grapes", value: "grapes" },
  { label: "Pineapple", value: "pineapple" },
];

export const Basic: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([]);

    return (
      <div className="w-64">
        <MultiSelect
          onChange={setValue}
          options={options}
          placeholder="Select fruits..."
          searchPlaceholder="Search fruits..."
          value={value}
        />
      </div>
    );
  },
};

export const Loading: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([]);

    return (
      <div className="w-64">
        <MultiSelect
          onChange={setValue}
          options={[]}
          placeholder="Select fruits..."
          searchPlaceholder="Search fruits..."
          value={value}
          isLoading
        />
      </div>
    );
  },
};
