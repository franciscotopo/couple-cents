import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { REGEXP_ONLY_CHARS, REGEXP_ONLY_DIGITS } from "input-otp";

import { InputOtp } from "./input-otp";

const meta = {
  component: InputOtp.Root,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "Components/UI/InputOTP",
} satisfies Meta<typeof InputOtp.Root>;

export default meta;

type Story = StoryObj<ComponentProps<typeof InputOtp.Root>>;

export const Default: Story = {
  render: () => {
    return (
      <InputOtp.Root maxLength={4}>
        <InputOtp.Group>
          <InputOtp.Slot index={0} />
          <InputOtp.Slot index={1} />
          <InputOtp.Slot index={2} />
          <InputOtp.Slot index={3} />
        </InputOtp.Group>
      </InputOtp.Root>
    );
  },
};

export const WithSeparator: Story = {
  render: () => {
    return (
      <InputOtp.Root maxLength={6}>
        <InputOtp.Group>
          <InputOtp.Slot index={0} />
          <InputOtp.Slot index={1} />
          <InputOtp.Slot index={2} />
        </InputOtp.Group>
        <InputOtp.Separator />
        <InputOtp.Group>
          <InputOtp.Slot index={3} />
          <InputOtp.Slot index={4} />
          <InputOtp.Slot index={5} />
        </InputOtp.Group>
      </InputOtp.Root>
    );
  },
};

export const OnlyNumbers: Story = {
  render: () => {
    return (
      <InputOtp.Root maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
        <InputOtp.Group>
          <InputOtp.Slot index={0} />
          <InputOtp.Slot index={1} />
          <InputOtp.Slot index={2} />
        </InputOtp.Group>
        <InputOtp.Separator />
        <InputOtp.Group>
          <InputOtp.Slot index={3} />
          <InputOtp.Slot index={4} />
          <InputOtp.Slot index={5} />
        </InputOtp.Group>
      </InputOtp.Root>
    );
  },
};

export const OnlyCharacters: Story = {
  render: () => {
    return (
      <InputOtp.Root maxLength={6} pattern={REGEXP_ONLY_CHARS}>
        <InputOtp.Group>
          <InputOtp.Slot index={0} />
          <InputOtp.Slot index={1} />
          <InputOtp.Slot index={2} />
        </InputOtp.Group>
        <InputOtp.Separator />
        <InputOtp.Group>
          <InputOtp.Slot index={3} />
          <InputOtp.Slot index={4} />
          <InputOtp.Slot index={5} />
        </InputOtp.Group>
      </InputOtp.Root>
    );
  },
};
