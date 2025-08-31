"use client";

import { QuestionAnswerPair } from "@/lib/graph/generated/graphql";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  PlusCircle,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { getClient } from "@/lib/graph/client";
import { toast } from "sonner";
import {
  DeleteQuestionAnswerPairDocument,
  DeleteQuestionAnswerPairMutation,
  UpdateQuestionAnswerPairOrderDocument,
  UpdateQuestionAnswerPairOrderMutation,
  AllQuestionAnswerPairDocument,
} from "@/lib/graph/generated/graphql";
import QAPDialog from "@/app/(settings)/faq/faq-dialog";
import { QAPColumns } from "@/app/(settings)/faq/faq-columns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTablePagination } from "@/components/table-utils/data-table-pagination";
import ConfirmationDialog from "@/components/dialogs/confirmation-dialog";


export interface QAPTableDialogState {
  mode: "create" | "update" | "delete" | null;
  currentQAP: QuestionAnswerPair | null;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const DndTableRow = ({
  row,
  moveRow,
  saveOrder
}: {
  row: any;
  moveRow: (draggedId: string, toIndex: number) => void;
  saveOrder: (draggedId: string, newIndex: number) => void;
}) => {
  const { original } = row;
  const dropRef = useRef<HTMLTableRowElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: string | symbol | null }
  >({
    accept: "row",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!dropRef.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = row.index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = dropRef.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset ? clientOffset.y : 0) - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveRow(item.id, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: "row",
    item: () => {
      return { id: original.id, index: row.index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      if (!monitor.didDrop()) {
        return;
      }
      saveOrder(item.id, item.index);
    },
  });

  const opacity = isDragging ? 0 : 1;

  drop(dropRef);
  preview(dropRef);
  drag(dragHandleRef);

  const handlerIdAttr =
    typeof handlerId === "symbol" ? undefined : (handlerId ?? undefined);

  return (
    <TableRow
      ref={dropRef}
      style={{ opacity }}
      data-handler-id={handlerIdAttr}
    >
      {row.getVisibleCells().map((cell: any) => (
        <TableCell
          key={cell.id}
          className={`whitespace-normal break-words px-4 py-3 ${cell.column.columnDef.className ?? ""}`}
          style={{
            maxWidth:
              cell.column.columnDef.maxSize && typeof cell.column.columnDef.maxSize === "number"
                ? `${cell.column.columnDef.maxSize}px`
                : undefined,
            overflowWrap: "break-word",
            wordBreak: "break-word",
          }}
        >
          {cell.column.id === 'drag-handle' ? (
            <div ref={dragHandleRef}>
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
  const [data, setData] = useState<QuestionAnswerPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogState, setDialogState] = useState<QAPTableDialogState>({
    mode: null,
    currentQAP: null,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const columns = React.useMemo(() => QAPColumns({ setDialogState }), []);
  const [globalFilter, setGlobalFilter] = useState('');
  const [maxOrder, setMaxOrder] = useState(0);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      globalFilter,
    },
    columnResizeMode: "onChange",
  });

  const moveRow = useCallback(
    (draggedId: string, newIndex: number) => {
      const draggedRow = data.find((row) => row.id === draggedId);
      if (!draggedRow) return;

      const newTableData = [...data];
      const oldIndex = newTableData.findIndex((row) => row.id === draggedId);
      newTableData.splice(oldIndex, 1);
      newTableData.splice(newIndex, 0, draggedRow);

      setData(newTableData);
    },
    [data]
  );

  const saveOrder = useCallback(async (draggedId: string, newOrder: number) => {
    try {
      const client = getClient();
      await client.request<UpdateQuestionAnswerPairOrderMutation>(
        UpdateQuestionAnswerPairOrderDocument,
        {
          QAPs: [{ id: draggedId, order: newOrder }],
        }
      );
      toast.success("FAQ-Reihenfolge erfolgreich aktualisiert.");
      await refreshData();
    } catch (error) {
      toast.error("Fehler beim Sortieren der FAQ aufgetreten.");
      console.error("Error updating FAQ order:", error);
      await refreshData();
    }
  }, []);

  async function refreshData() {
    setLoading(true);
    const client = getClient();
    try {
      const response = await client.request<{
        questionAnswerPairs: QuestionAnswerPair[];
      }>(AllQuestionAnswerPairDocument);
      const sortedData = [...response.questionAnswerPairs].sort(
        (a, b) => a.order - b.order
      );
      setData(sortedData);
      setMaxOrder(sortedData.length > 0 ? sortedData.length - 1 : 0);
    } catch (error) {
      toast.error("Fehler beim Laden der FAQ aufgetreten.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteQAP(id: string) {
    setLoading(true);
    const client = getClient();
    try {
      await client.request<DeleteQuestionAnswerPairMutation>(
        DeleteQuestionAnswerPairDocument,
        {
          ids: [id],
        }
      );
      toast.success("Frage erfolgreich gelöscht.");
      setDialogState({ mode: null, currentQAP: null });
      await refreshData();
    } catch (error) {
      toast.error("Fehler beim Löschen der Frage.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    const updatePageSize = () => {
      const footerAndHeaderApprox = 300;
      const approxRowHeight = 56;
      const availableHeight = window.innerHeight - footerAndHeaderApprox;
      const rowsPerPage = Math.floor(availableHeight / approxRowHeight);
    };

    updatePageSize();
    window.addEventListener("resize", updatePageSize);
    return () => window.removeEventListener("resize", updatePageSize);
  }, [table]);

  const ICONS_TOTAL_PX = 40 + 80;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <Button
          data-cy="qap-create-button"
          onClick={() => setDialogState({ mode: "create", currentQAP: null })}
          className="flex gap-2"
        >
          <PlusCircle />
          Frage erstellen
        </Button>
        <Input
          data-cy="qap-searchbar"
          placeholder="Frage oder Antwort filtern..."
          value={globalFilter ?? ""}
          onChange={(event) =>
            setGlobalFilter(event.target.value)
          }
          className="max-w-sm"
        />
      </div>

      <DndProvider backend={HTML5Backend}>
        <div className="rounded-md border grow flex flex-col w-full overflow-hidden">
          <Table className="w-full" style={{ tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: "50px" }} />
              <col style={{ width: `calc((100% - ${ICONS_TOTAL_PX}px) * 0.3333)` }} />
              <col style={{ width: `calc((100% - ${ICONS_TOTAL_PX}px) * 0.6667)` }} />
              <col style={{ width: "80px" }} />
            </colgroup>

            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className={"h-10"}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table
                  .getRowModel()
                  .rows.map((row) => (
                    <DndTableRow key={row.id} row={row} moveRow={moveRow} saveOrder={saveOrder} />
                  ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {loading ? (
                      <div className="flex justify-center items-center gap-2">
                        <Loader2 className="animate-spin" />
                        Lade FAQ...
                      </div>
                    ) : (
                      "Keine Ergebnisse gefunden."
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </DndProvider>

      <div className="w-full flex justify-center items-center px-2 py-4">
        <DataTablePagination table={table} disableElementsPerPage />
      </div>

      {dialogState.mode === "create" && (
        <QAPDialog
          open={true}
          createMode={true}
          qap={null}
          closeDialog={() => setDialogState({ mode: null, currentQAP: null })}
          refreshData={refreshData}
          maxOrder={maxOrder}
        />
      )}

      {dialogState.mode === "update" && dialogState.currentQAP && (
        <QAPDialog
          open={true}
          createMode={false}
          qap={dialogState.currentQAP}
          closeDialog={() => setDialogState({ mode: null, currentQAP: null })}
          refreshData={refreshData}
          maxOrder={maxOrder}
        />
      )}

      {dialogState.mode === "delete" && dialogState.currentQAP && (
        <ConfirmationDialog
          mode="confirmation"
          description={`Dies wird die Frage "${dialogState.currentQAP.question}" unwiderruflich löschen.`}
          onConfirm={() => deleteQAP(dialogState.currentQAP!.id)}
          isOpen={dialogState.mode === "delete"}
          closeDialog={() => setDialogState({ mode: null, currentQAP: null })}
        />
      )}
    </div>
  );
}
