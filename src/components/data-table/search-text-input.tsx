import { type ChangeEvent } from "react";

import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import type { AvailableRoutesId } from "@/config/router";
import { useSearchText } from "@/hooks/use-search";
import { useTranslation } from "@/i18n";
import { SIZE } from "@/types";

type SearchTextInputProps = {
  path: AvailableRoutesId;
  placeholder?: string;
};

export const SearchTextInput = ({ path, placeholder }: SearchTextInputProps) => {
  const { t } = useTranslation();
  const {
    actions: { setPaginatedSearchText },
    searchText,
  } = useSearchText(path);

  const localSearchValue = searchText ?? "";

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPaginatedSearchText(value);
  };

  return (
    <Input
      className="max-w-sm"
      left={<Icons.Search />}
      onChange={handleSearchChange}
      placeholder={placeholder ?? t("common.filter")}
      size={SIZE.SMALL}
      value={localSearchValue}
    />
  );
};
