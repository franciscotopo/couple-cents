import { Logo } from "@/assets/images";
import { useTranslation } from "@/i18n";
import { HamburgerMenu } from "./hamburger-menu";

export const Header = () => {
  const { t } = useTranslation();

  return (
    <header className="flex items-center justify-between gap-4 bg-background-brand-default p-4 text-text-brand-on-brand">
      <img alt="Logo" className="h-10" src={Logo} />

      <span>{t("greetings.rootLayout")}</span>

      <HamburgerMenu />
    </header>
  );
};
