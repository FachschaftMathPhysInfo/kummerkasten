"use client"

import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {AllLabelsDocument, Label} from "@/lib/graph/generated/graphql";
import {getClient} from "@/lib/graph/client";

interface LabelContextType {
  labels: Label[];
  triggerLabelRefetch: () => void;
}

const LabelsContext = createContext<LabelContextType | null>(null);

export function LabelProvider({children}: { children: ReactNode }) {
  const [labels, setLabels] = useState<Label[]>([]);
  const [refetchKey, setRefetchKey] = useState(false);

  useEffect(() => {
    const fetchLabels = async () => {
      const client = getClient()
      const data = await client.request(AllLabelsDocument)
      setLabels(data.labels?.filter(label => !!label) ?? [])
    }

    void fetchLabels();
  }, [refetchKey]);

  function triggerLabelRefetch() {
    setRefetchKey(!refetchKey);
  }


  return (
    <LabelsContext.Provider value={{labels, triggerLabelRefetch}}>
      {children}
    </LabelsContext.Provider>
  );
}

export const useLabels = (): LabelContextType => {
  const context = useContext(LabelsContext);

  if (!context) {
    throw new Error("useTickets must be used within a LabelProvider");
  }

  return context;
}