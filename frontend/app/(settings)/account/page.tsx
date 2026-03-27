import {ManagementPageHeader} from "@/components/management-page-header";
import {SettingsIcon} from "lucide-react";
import AccountDataForm from "@/app/(settings)/account/profile-data-form";
import PasswordDataForm from "@/app/(settings)/account/password-form";
import {useTranslations} from "use-intl";

export default function Page() {
  const t = useTranslations("Settings.AccountPage")

  return (
    <div className="w-full h-full">
      <ManagementPageHeader
        icon={<SettingsIcon/>}
        title={t("header")}
        description={t("description")}
      />
      <AccountDataForm/>
      <PasswordDataForm/>
    </div>
  );
}
