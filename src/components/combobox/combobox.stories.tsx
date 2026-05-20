import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Combobox } from "./combobox";

const meta: Meta<typeof Combobox> = {
  title: "Components/Combobox",
  component: Combobox,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Combobox>;

export default meta;

type Story = StoryObj<typeof Combobox>;

const options = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Blueberry", value: "blueberry" },
  { label: "Grapes", value: "grapes" },
  { label: "Pineapple", value: "pineapple" },
];

export const Basic: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>(undefined);

    return (
      <div className="w-64">
        <Combobox
          onChange={setValue}
          options={options}
          placeholder="Select a fruit"
          searchPlaceholder="Search fruits..."
          value={value}
        />
      </div>
    );
  },
};
