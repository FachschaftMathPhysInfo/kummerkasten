"use client"

import {Tags} from "lucide-react";
import {LabelTable} from "@/app/(settings)/labels/label-table";
import {ManagementPageHeader} from "@/components/management-page-header";
import {LabelProvider} from "@/components/providers/label-provider";

export default function LabelManagementPage() {
  return (
    <LabelProvider>
      <div className="w-full h-full flex flex-col grow">
        <ManagementPageHeader
          icon={<Tags/>}
          title="Label Verwaltung"
          description="Erstelle, lösche und update Labels hier."
        />
        <div className={'w-full h-full flex flex-col gap-6 px-10 pt-4 grow'}>
          <LabelTable/>
        </div>
      </div>
    </LabelProvider>

  )
}
