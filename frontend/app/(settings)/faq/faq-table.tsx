"use client";

import React, {useCallback, useEffect, useMemo, useState} from "react";
import {flexRender, getCoreRowModel, getSortedRowModel, useReactTable,} from "@tanstack/react-table";

import QAPDialog from "@/app/(settings)/faq/faq-dialog";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import ConfirmationDialog from "@/components/dialogs/confirmation-dialog";

import {PlusCircle} from "lucide-react";
import {getClient} from "@/lib/graph/client";
import {
  DeleteQuestionAnswerPairDocument,
  DeleteQuestionAnswerPairMutation,
  QuestionAnswerPair,
  UpdateQuestionAnswerPairPositionsDocument,
} from "@/lib/graph/generated/graphql";
import {toast} from "sonner";

import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import QAPColumns from "@/app/(settings)/faq/faq-columns";
import {useQAPs} from "@/components/providers/qap-provider";
import {DndTableRow} from "@/app/(settings)/faq/qap-dnd-row";

export interface QAPTableDialogState {
  mode: "create" | "update" | "delete" | null;
  currentQAP: QuestionAnswerPair | null;
}

export function QAPTable() {
  const [dialogState, setDialogState] = useState<QAPTableDialogState>({mode: null, currentQAP: null});
  const [searchTerm, setSearchTerm] = useState("");
  const {qaps, triggerQAPRefetch} = useQAPs()
  const [localData, setLocalData] = useState<QuestionAnswerPair[]>(qaps);
  const filteredData = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return localData.filter((qap) => qap.question.toLowerCase().includes(term) || qap.answer.toLowerCase().includes(term));
  }, [localData, searchTerm]);
  const columns = QAPColumns({setDialogState})
  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode: "onChange",
  });
  const client = getClient();


  useEffect(() => setLocalData(qaps), [qaps]);

  const resetDialogState = () => setDialogState({mode: null, currentQAP: null});

  async function deleteQAP() {
    try {
      await client.request<DeleteQuestionAnswerPairMutation>(DeleteQuestionAnswerPairDocument, {ids: [dialogState.currentQAP?.id]});
      resetDialogState();
      triggerQAPRefetch();
      toast.success("QAP wurde erfolgreich gelöscht")
    } catch {
      toast.error("Fehler beim Löschen der Frage");
    }
  }

  const moveRow = useCallback((draggedId: string, newIndex: number) => {
    setLocalData((old) => {
      const newTableData = [...old];
      const oldIndex = newTableData.findIndex((r) => r.id === draggedId);
      if (oldIndex === -1) return old;
      const [moved] = newTableData.splice(oldIndex, 1);
      newTableData.splice(newIndex, 0, moved);
      return newTableData.map((r, idx) => ({...r, order: idx}));
    });
  }, []);

  const updatePosition = useCallback(async () => {
      const reordered = localData.map((qap, idx) => ({
        id: qap.id,
        position: idx,
      }));

      try {
        await client.request(UpdateQuestionAnswerPairPositionsDocument, {
          qaps: reordered,
        });
      } catch {
        toast.error("Fehler beim Aktualisieren der Positionen");
      }

      triggerQAPRefetch();
    },
    [client, localData, triggerQAPRefetch]
  );
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-2 mt-2" data-cy="qap-table">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <Button
            data-cy="qap-create-button"
            onClick={() => setDialogState({mode: "create", currentQAP: null})}
            className="flex gap-2"
          >
            <PlusCircle/>
            Frage erstellen
          </Button>

          <Input
            data-cy="qap-searchbar"
            placeholder="Frage oder Antwort durchsuchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="rounded-md border overflow-hidden mb-8">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <DndTableRow key={row.id} row={row} moveRow={moveRow} savePosition={updatePosition}/>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Keine FAQs gefunden.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <QAPDialog
          open={dialogState.mode === "create" || dialogState.mode === "update"}
          createMode={dialogState.mode === "create"}
          qap={dialogState.currentQAP}
          closeDialog={resetDialogState}
        />

        <ConfirmationDialog
          mode="confirmation"
          description={`Dies wird die Frage "${dialogState.currentQAP?.question}" unwiderruflich löschen.`}
          onConfirm={() => deleteQAP()}
          isOpen={dialogState.mode === "delete"}
          closeDialog={resetDialogState}
        />
      </div>
    </DndProvider>
  );
}