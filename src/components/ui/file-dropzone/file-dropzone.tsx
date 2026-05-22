import { type ComponentProps, createContext, useContext } from "react";
import {
  type Accept,
  type DropzoneState,
  ErrorCode,
  type FileRejection,
  useDropzone,
} from "react-dropzone";
import { tv } from "tailwind-variants";

import { useTranslation } from "@/i18n";

const fileDropzoneVariants = tv({
  slots: {
    root: "flex flex-col gap-4",
    dropzone:
      "cursor-pointer rounded-sm border border-dashed border-gray-300 p-12 hover:bg-gray-100 focus-visible:ring-4 focus-visible:ring-background-brand-default/25 focus-visible:outline-none data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50 hover:data-[disabled=true]:bg-transparent",
    list: "flex flex-col gap-1",
    file: "text-sm",
  },
  variants: {
    invalid: {
      true: {
        file: "text-red-500",
        dropzone: "bg-red-100",
      },
    },
  },
});

const { dropzone, file, list, root } = fileDropzoneVariants();

type FileDropzoneContext = DropzoneState & {
  disabled: boolean;
  errorMessages: Partial<Record<ErrorCode, string>>;
  isSingleFileError: (code: ErrorCode) => boolean;
  isGlobalFilesError: (code: ErrorCode) => boolean;
};

const FileDropzoneContext = createContext<FileDropzoneContext | null>(null);

const useFileDropzoneContext = () => {
  const fileDropzoneContext = useContext(FileDropzoneContext);
  if (!fileDropzoneContext) {
    throw Error("useFileDropzoneContext can only be used inside a FileDropzoneContext.Provider");
  }

  return fileDropzoneContext;
};

type RootProps = {
  maxFiles?: number;
  maxSize?: number;
  accept?: Accept;
  disabled?: boolean;
  onFilesChange?: (acceptedFiles: File[], rejectedFiles: FileRejection[]) => void;
} & ComponentProps<"div">;

const Root = ({
  accept,
  children,
  className,
  disabled = false,
  maxFiles = 0,
  maxSize,
  onFilesChange,
}: RootProps) => {
  const { t } = useTranslation();

  const GLOBAL_FILE_ERROR_MESSAGES: Record<ErrorCode.TooManyFiles, string> = {
    [ErrorCode.TooManyFiles]: t("form.errors.tooManyFiles"),
  };

  const SINGLE_FILE_ERROR_MESSAGES: Record<Exclude<ErrorCode, ErrorCode.TooManyFiles>, string> = {
    [ErrorCode.FileInvalidType]: t("form.errors.invalidFileType"),
    [ErrorCode.FileTooLarge]: t("form.errors.fileTooLarge"),
    [ErrorCode.FileTooSmall]: t("form.errors.fileTooSmall"),
  };

  const DEFAULT_ERROR_CODE_TO_MESSAGE_MAP: Record<ErrorCode, string> = {
    ...GLOBAL_FILE_ERROR_MESSAGES,
    ...SINGLE_FILE_ERROR_MESSAGES,
  };

  const isSingleFileError = (code: ErrorCode) => {
    return Object.keys(SINGLE_FILE_ERROR_MESSAGES).includes(code);
  };
  const isGlobalFilesError = (code: ErrorCode) => {
    return Object.keys(GLOBAL_FILE_ERROR_MESSAGES).includes(code);
  };

  const onDrop = <T extends File>(acceptedFiles: T[], rejectedFiles: FileRejection[]) => {
    onFilesChange?.(acceptedFiles, rejectedFiles);
  };

  const dropzoneState = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
    accept,
    multiple: maxFiles !== 1,
    disabled,
  });

  return (
    <FileDropzoneContext.Provider
      value={{
        ...dropzoneState,
        disabled,
        errorMessages: DEFAULT_ERROR_CODE_TO_MESSAGE_MAP,
        isSingleFileError,
        isGlobalFilesError,
      }}
    >
      <div className={root({ className })}>{children}</div>
    </FileDropzoneContext.Provider>
  );
};

const DropArea = ({ children, className }: ComponentProps<"button">) => {
  const { disabled, getInputProps, getRootProps, isDragReject } = useFileDropzoneContext();

  return (
    <button
      {...getRootProps({
        className: dropzone({ className, invalid: isDragReject }),
        type: "button",
        "aria-disabled": disabled,
        "data-disabled": disabled,
      })}
    >
      <input {...getInputProps()} />
      {children}
    </button>
  );
};

const List = ({ className }: ComponentProps<"ul">) => {
  const { acceptedFiles, errorMessages, fileRejections, isGlobalFilesError, isSingleFileError } =
    useFileDropzoneContext();

  const hasAnyFiles = acceptedFiles.length > 0 || fileRejections.length > 0;

  if (!hasAnyFiles) {
    return null;
  }

  const firstRejection = fileRejections[0];
  const globalErrorCode = firstRejection?.errors[0]?.code as ErrorCode | undefined;
  const hasGlobalError = globalErrorCode && isGlobalFilesError(globalErrorCode);

  return (
    <ul className={list({ className })}>
      {fileRejections.map((rejection) => {
        const errorCode = rejection.errors[0]?.code as ErrorCode;
        const shouldShowFileError = isSingleFileError(errorCode);

        return (
          <li className={file({ invalid: true })} key={rejection.file.path}>
            {rejection.file.name}
            {shouldShowFileError ? ` - ${errorMessages[errorCode]}` : null}
          </li>
        );
      })}

      {hasGlobalError ? (
        <li className={file({ invalid: true })} key="global-error">
          {errorMessages[globalErrorCode]}
        </li>
      ) : null}

      {acceptedFiles.map((acceptedFile) => {
        return (
          <li className={file()} key={acceptedFile.path}>
            {acceptedFile.name}
          </li>
        );
      })}
    </ul>
  );
};

export const FileDropzone = {
  Root,
  DropArea,
  List,
};
