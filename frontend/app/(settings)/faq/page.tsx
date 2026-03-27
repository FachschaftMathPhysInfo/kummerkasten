"use client";

import {MessageCircleQuestionMark} from "lucide-react";
import {QAPTable} from "@/app/(settings)/faq/faq-table";
import {ManagementPageHeader} from "@/components/management-page-header";
import AboutSectionForm from "@/app/(settings)/faq/about-section-form";
import {QAPProvider} from "@/components/providers/qap-provider";
import {useTranslations} from "use-intl";

export default function QAPManagementPage() {
  const t = useTranslations("Settings.QAPManagement.Page")

  return (
      <div className="w-full h-full flex flex-col grow">
        <ManagementPageHeader
          icon={<MessageCircleQuestionMark />}
          title={t("header")}
          description={t("description")}
        />
        <div className="w-full h-full flex flex-col gap-6 px-10 pt-4 grow">
          <AboutSectionForm />
          <QAPProvider>
            <QAPTable />
          </QAPProvider>
        </div>
      </div>

  );
}
