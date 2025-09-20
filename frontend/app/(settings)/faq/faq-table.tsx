"use client";

import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type Row as TanStackRow,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

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
  QuestionAnswerPair, UpdateQuestionAnswerPairDocument,
} from "@/lib/graph/generated/graphql";
import {toast} from "sonner";

import {DndProvider, useDrag, useDrop} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import QAPColumns from "@/app/(settings)/faq/faq-columns";
import {useQAPs} from "@/components/providers/qap-provider";

export interface QAPTableDialogState {
  mode: "create" | "update" | "delete" | null;
  currentQAP: QuestionAnswerPair | null;
}

type QAPColumnDef<TData> = ColumnDef<TData> & {
  className?: string;
};

interface DragItem {
  id: string;
  index: number;
}

const DndTableRow = ({
                       row,
                       moveRow,
                       savePosition,
                     }: {
  row: TanStackRow<QuestionAnswerPair>;
  moveRow: (draggedId: string, toIndex: number) => void;
  savePosition: (draggedId: string, newIndex: number) => void;
}) => {
  const {original} = row;
  const dropRef = useRef<HTMLTableRowElement | null>(null);
  const dragHandleRef = useRef<HTMLDivElement | null>(null);

  const [{handlerId, isOver}, drop] = useDrop<DragItem, void, { handlerId: string | symbol | null; isOver: boolean }>({
    accept: "row",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
        isOver: monitor.isOver(),
      };
    },
    hover(item: DragItem) {
      const dragIndex = item.index;
      const hoverIndex = row.index;
      if (dragIndex === hoverIndex) return;

      moveRow(item.id, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{isDragging}, drag, preview] = useDrag({
    type: "row",
    item: () => ({id: original.id, index: row.index}),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      if (!monitor.didDrop()) return;
      savePosition(item.id, item.index);
    },
  });

  drop(dropRef);
  preview(dropRef);
  drag(dragHandleRef);

  const handlerIdAttr = (handlerId ?? undefined);

  return (
    <TableRow
      ref={dropRef}
      style={{opacity: isDragging ? 0 : 1}}
      className={`${isDragging ? "shadow-lg bg-background cursor-grabbing" : ""} ${isOver ? "bg-accent/20 border-t-2 border-b-2 border-primary" : ""}`}
      data-handler-id={handlerIdAttr}
      data-cy="qap-row"
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell
          key={cell.id}
          className={`whitespace-normal break-words px-4 py-3 ${((cell.column.columnDef as QAPColumnDef<QuestionAnswerPair>).className) ?? ""}`}
        >
          {cell.column.id === "drag-handle" ? (
            <div ref={dragHandleRef} className="cursor-grab">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </div>
          ) : (
            flexRender(cell.column.columnDef.cell, cell.getContext())
          )}
        </TableCell>
      ))}
    </TableRow>
  );
};

export function QAPTable() {
  const [dialogState, setDialogState] = useState<QAPTableDialogState>({mode: null, currentQAP: null});
  const [searchTerm, setSearchTerm] = useState("");
  const {qaps, triggerQAPRefetch} = useQAPs()

  const [localData, setLocalData] = useState<QuestionAnswerPair[]>(() => [...qaps].sort((a, b) => a.position - b.position));
  useEffect(() => setLocalData([...qaps].sort((a, b) => a.position - b.position)), [qaps]);

  const filteredData = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return localData.filter((qap) => qap.question.toLowerCase().includes(term) || qap.answer.toLowerCase().includes(term));
  }, [localData, searchTerm]);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const columns = QAPColumns({setDialogState})

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {columnVisibility},
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode: "onChange",
  });

  const client = getClient();

  const resetDialogState = () => setDialogState({mode: null, currentQAP: null});

  const deleteQAP = async (id: string) => {
    try {
      await client.request<DeleteQuestionAnswerPairMutation>(DeleteQuestionAnswerPairDocument, {ids: [id]});
      resetDialogState();
      triggerQAPRefetch();
    } catch {
      toast.error("Fehler beim Löschen der Frage.");
    }
  };

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

  const savePosition = useCallback(async (draggedId: string, newPosition: number) => {
    try {
      await client.request(UpdateQuestionAnswerPairDocument, {id: draggedId, questionAnswerPair: {position: newPosition}});
    } catch {
      toast.error("Fehler beim Sortieren der FAQ aufgetreten.");
    }

    triggerQAPRefetch()
  }, [client, triggerQAPRefetch]);

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
                  <DndTableRow key={row.id} row={row} moveRow={moveRow} savePosition={savePosition}/>
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
          onConfirm={() => deleteQAP(dialogState.currentQAP!.id)}
          isOpen={dialogState.mode === "delete"}
          closeDialog={resetDialogState}
        />
      </div>
    </DndProvider>
  );
}