"use client"

import {Tags} from "lucide-react";
import {LabelTable} from "@/app/(settings)/labels/label-table";
import {ManagementPageHeader} from "@/components/management-page-header";
import {LabelProvider} from "@/components/providers/label-provider";
import {useTranslations} from "use-intl";

export default function LabelManagementPage() {
  const t = useTranslations("Settings.LabelManagementPage")

  return (
    <LabelProvider>
      <div className="w-full h-full flex flex-col grow">
        <ManagementPageHeader
          icon={<Tags/>}
          title={t("header")}
          description={t("description")}
        />
        <div className={'w-full h-full flex flex-col gap-6 px-10 pt-4 grow'}>
          <LabelTable/>
        </div>
      </div>
    </LabelProvider>

  )
}
