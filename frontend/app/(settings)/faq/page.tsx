"use client";

import { MessageCircleQuestionMark } from "lucide-react";
import { ManagementPageHeader } from "@/components/management-page-header";
import { QAPTable } from "@/app/(settings)/faq/faq-table";

export default function QAPManagementPage() {
  return (
    <div className="w-full h-full flex flex-col grow">
      <ManagementPageHeader
        icon={<MessageCircleQuestionMark />}
        title="FAQ-Verwaltung"
        description="Sortiere, erstelle, lösche die Frequently Asked Questions."
      />
      <div className="w-full h-full flex flex-col gap-6 px-10 pt-4 grow">
        <QAPTable />
      </div>
    </div>
  );
}
