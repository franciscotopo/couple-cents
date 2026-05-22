import { useTranslation } from "@/i18n";
import { HamburgerMenu } from "./hamburger-menu";

export const Header = () => {
  const { t } = useTranslation();

  return (
    <header className="flex items-center justify-between gap-4 bg-background-brand-default p-4 text-text-brand-on-brand">
      <span className="text-lg font-bold">Couple Cents</span>

      <span>{t("greetings.rootLayout")}</span>

      <HamburgerMenu />
    </header>
  );
};
