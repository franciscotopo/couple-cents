import { useState } from "react";
import type { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/ui/icons";
import { useTranslation } from "@/i18n";
import type { User } from "@/services/users/types";
import { DeleteUserDialog } from "./delete-user-dialog";
import { UpdateUserDialog } from "./update-user-dialog";

type UserRowActionsProps = {
  row: Row<User>;
};

export const UserRowActions = ({ row }: UserRowActionsProps) => {
  const { t } = useTranslation();

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);

  return (
    <>
      <UpdateUserDialog
        isOpen={showUpdateDialog}
        onOpenChange={setShowUpdateDialog}
        user={row.original}
      />

      <DeleteUserDialog
        isOpen={showConfirmDelete}
        onOpenChange={setShowConfirmDelete}
        user={row.original}
      />

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <div className="flex justify-end">
            <Button className="size-8" variant="plainText">
              <span className="sr-only">{t("users.table.columns.actions.ariaLabel")}</span>

              <Icons.MoreHorizontal />
            </Button>
          </div>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content align="end">
          <DropdownMenu.Item
            onClick={() => {
              return navigator.clipboard.writeText(row.getValue("emailAddress"));
            }}
          >
            {t("users.table.columns.actions.copyUserEmail")}
          </DropdownMenu.Item>

          <DropdownMenu.Item
            onClick={() => {
              return setShowConfirmDelete(true);
            }}
          >
            {t("buttons.delete")}
          </DropdownMenu.Item>

          <DropdownMenu.Item
            onClick={() => {
              return setShowUpdateDialog(true);
            }}
          >
            {t("buttons.update")}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  );
};
