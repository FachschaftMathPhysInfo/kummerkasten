"use client"

import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {
  AllLabelsDocument,
  CreateLabelDocument, DeleteLabelsDocument,
  Label,
  NewLabel,
  UpdateLabel,
  UpdateLabelDocument
} from "@/lib/graph/generated/graphql";
import {getClient} from "@/lib/graph/client";

interface LabelContextType {
  labels: Label[];
  createLabel: (label: NewLabel) => Promise<string | null>;
  updateLabel: (id: string, label: UpdateLabel) => Promise<string | null>;
  deleteLabel: (ids: string[]) => Promise<string | null>;
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

  async function createLabel(label: NewLabel) {
    const client = getClient();

    try {
      await client.request(CreateLabelDocument, {label})
      return null
    } catch (err) {
      return String(err)
    } finally {
      triggerLabelRefetch()
    }
  }

  async function updateLabel(id: string, label: UpdateLabel) {
    const client = getClient()

    try {
      await client.request(UpdateLabelDocument, {id, label})
      return null
    } catch (err) {
      return String(err)
    } finally {
      triggerLabelRefetch()
    }
  }

  async function deleteLabel(ids: string[]) {
    const client = getClient()

    try {
      await client.request(DeleteLabelsDocument, {ids})
      return null
    } catch (err) {
      return String(err)
    } finally {
      triggerLabelRefetch()
    }
  }


  return (
    <LabelsContext.Provider value={{labels, createLabel, deleteLabel, updateLabel, triggerLabelRefetch}}>
      {children}
    </LabelsContext.Provider>
  );
}

export const useLabels = (): LabelContextType => {
  const context = useContext(LabelsContext);

  if (!context) {
    throw new Error("useLabels must be used within a LabelProvider");
  }

  return context;
}