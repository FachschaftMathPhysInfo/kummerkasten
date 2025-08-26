"use client"

import {useCallback, useEffect, useState} from "react";
import {AllLabelsDocument, AllLabelsQuery, Label} from "@/lib/graph/generated/graphql"
import {getClient} from "@/lib/graph/client";
import {toast} from "sonner";
import {Tags} from "lucide-react";
import {LabelTable} from "@/app/(settings)/labels/label-table";
import {ManagementPageHeader} from "@/components/management-page-header";

export default function LabelManagementPage() {
  const [labels, setLabels] = useState<Label[]>([])

  const fetchLabels = useCallback(async () => {
    const client = getClient();

    try {
      const data = await client.request<AllLabelsQuery>(AllLabelsDocument)

      if (!data.labels) {
        setLabels([])
        return
      }

      setLabels(data.labels.filter(label => !!label));
    } catch {
      toast.error("Fehler beim Laden der Label")
    }
  }, [])

  useEffect(() => void fetchLabels(), [fetchLabels])

  return (
    <div className="w-full h-full flex flex-col grow">
      <ManagementPageHeader
        icon={<Tags/>}
        title="Label Verwaltung"
        description="Erstelle, lösche und update Labels hier."
      />
      <div className={'w-full h-full flex flex-col gap-6 px-10 pt-4 grow'}>
        <LabelTable data={labels} refreshData={fetchLabels}/>
      </div>
    </div>
  )
}
