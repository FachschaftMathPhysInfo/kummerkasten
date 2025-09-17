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
  QuestionAnswerPair,
  UpdateQuestionAnswerPairOrderDocument,
  UpdateQuestionAnswerPairOrderMutation,
} from "@/lib/graph/generated/graphql";
import {toast} from "sonner";

import {DndProvider, useDrag, useDrop} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import QAPColumns from "@/app/(settings)/faq/faq-columns";

export interface QAPTableDialogState {
  mode: "create" | "update" | "delete" | null;
  currentQAP: QuestionAnswerPair | null;
}

interface QAPTableProps {
  data: QuestionAnswerPair[];
  refreshData: () => void;
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
                       saveOrder,
                     }: {
  row: TanStackRow<QuestionAnswerPair>;
  moveRow: (draggedId: string, toIndex: number) => void;
  saveOrder: (draggedId: string, newIndex: number) => void;
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
      saveOrder(item.id, item.index);
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

export function QAPTable({data, refreshData}: QAPTableProps) {
  const [dialogState, setDialogState] = useState<QAPTableDialogState>({mode: null, currentQAP: null});
  const [searchTerm, setSearchTerm] = useState("");

  const [localData, setLocalData] = useState<QuestionAnswerPair[]>(() => [...data].sort((a, b) => a.order - b.order));
  useEffect(() => setLocalData([...data].sort((a, b) => a.order - b.order)), [data]);

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
      refreshData();
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

  const saveOrder = useCallback(async (draggedId: string, newOrder: number) => {
    try {
      await client.request<UpdateQuestionAnswerPairOrderMutation>(UpdateQuestionAnswerPairOrderDocument, {
        qaps: [{id: draggedId, order: newOrder}],
      });
      refreshData();
    } catch {
      toast.error("Fehler beim Sortieren der FAQ aufgetreten.");
      refreshData();
    }
  }, [client, refreshData]);

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
                  <DndTableRow key={row.id} row={row} moveRow={moveRow} saveOrder={saveOrder}/>
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

        {(dialogState.mode === "create" || dialogState.mode === "update") && (
          <QAPDialog
            open={true}
            createMode={dialogState.mode === "create"}
            qap={dialogState.currentQAP}
            closeDialog={resetDialogState}
            refreshData={refreshData}
            maxOrder={localData.length > 0 ? Math.max(...localData.map(q => q.order)) : -1}
            uniqueQuestion={localData.map((q) => q.question)}
          />
        )}

        {dialogState.mode === "delete" && dialogState.currentQAP && (
          <ConfirmationDialog
            mode="confirmation"
            description={`Dies wird die Frage "${dialogState.currentQAP.question}" unwiderruflich löschen.`}
            onConfirm={() => deleteQAP(dialogState.currentQAP!.id)}
            isOpen={true}
            closeDialog={resetDialogState}
          />
        )}
      </div>
    </DndProvider>
  );
}