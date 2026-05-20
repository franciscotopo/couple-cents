import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Meta, StoryObj } from "@storybook/react-vite";
import z from "zod";

import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/error-message";
import { FileDropzone } from "@/components/ui/file-dropzone";
import { useTranslation } from "@/i18n";
import i18n from "@/i18n";

const meta: Meta<typeof FileDropzone.Root> = {
  component: FileDropzone.Root,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "Components/UI/FileDropzone",
} satisfies Meta<typeof FileDropzone.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const { t } = useTranslation();

    return (
      <FileDropzone.Root>
        <FileDropzone.DropArea>
          <p>{t("form.dropzone.instructions")}</p>
        </FileDropzone.DropArea>
        <FileDropzone.List />
      </FileDropzone.Root>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    const { t } = useTranslation();

    return (
      <FileDropzone.Root disabled>
        <FileDropzone.DropArea>
          <p>{t("form.dropzone.instructions")}</p>
        </FileDropzone.DropArea>
        <FileDropzone.List />
      </FileDropzone.Root>
    );
  },
};

export const Limit: Story = {
  render: () => {
    const { t } = useTranslation();
    const MAX_FILES = 5;

    return (
      <FileDropzone.Root maxFiles={MAX_FILES}>
        <FileDropzone.DropArea className="text-center">
          <p>{t("form.dropzone.instructions")}</p>
          <p className="text-sm">{t("form.errors.maximumFiles", { max: MAX_FILES })}</p>
        </FileDropzone.DropArea>
        <FileDropzone.List />
      </FileDropzone.Root>
    );
  },
};

export const SizeAndFormatRestriction: Story = {
  render: () => {
    const { t } = useTranslation();

    const MAX_SIZE = "1MB";
    const ALLOWED_FORMATS = [".pdf"];

    return (
      <FileDropzone.Root accept={{ "application/pdf": [".pdf"] }} maxFiles={3} maxSize={1e6}>
        <FileDropzone.DropArea className="text-center">
          <p>{t("form.dropzone.instructions")}</p>
          <p className="text-sm">
            {t("form.errors.fileAndSizeRestriction", {
              allowed: ALLOWED_FORMATS,
              maxSize: MAX_SIZE,
            })}
          </p>
        </FileDropzone.DropArea>
        <FileDropzone.List />
      </FileDropzone.Root>
    );
  },
};

const getFormSchema = () => {
  return z.object({
    files: z
      .array(z.instanceof(File))
      .min(1, i18n.t("form.errors.required", { field: i18n.t("form.files") })),
  });
};

type FormType = z.infer<ReturnType<typeof getFormSchema>>;

export const AsFormControl: Story = {
  render: () => {
    const { t } = useTranslation();

    const {
      control,
      formState: { errors },
      handleSubmit,
    } = useForm<FormType>({
      resolver: zodResolver(getFormSchema()),
      defaultValues: { files: [] },
    });

    const onSubmit: SubmitHandler<FormType> = (data) => {
      return data;
    };

    return (
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="files"
          render={({ field }) => {
            return (
              <FileDropzone.Root
                maxFiles={5}
                onFilesChange={(acceptedFiles) => {
                  return field.onChange(acceptedFiles);
                }}
              >
                <FileDropzone.DropArea className="text-center">
                  <p>{t("form.dropzone.instructions")}</p>
                </FileDropzone.DropArea>
                <FileDropzone.List />
              </FileDropzone.Root>
            );
          }}
        />
        <Button type="submit">{t("form.submit")}</Button>
        <ErrorMessage errorMessage={errors.files?.message} />
      </form>
    );
  },
};
