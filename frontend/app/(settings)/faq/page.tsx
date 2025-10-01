"use client";

import {MessageCircleQuestionMark} from "lucide-react";
import {QAPTable} from "@/app/(settings)/faq/faq-table";
import {ManagementPageHeader} from "@/components/management-page-header";
import AboutSectionForm from "@/app/(settings)/faq/about-section-form";
import {QAPProvider} from "@/components/providers/qap-provider";

export default function QAPManagementPage() {

  return (
      <div className="w-full h-full flex flex-col grow">
        <ManagementPageHeader
          icon={<MessageCircleQuestionMark />}
          title="FAQs"
          description="Verwalte die Informationen zum Kummerkasten-Formular"
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
