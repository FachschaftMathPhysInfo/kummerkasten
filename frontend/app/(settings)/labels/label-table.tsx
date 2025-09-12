import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import React, {useState} from "react";
import {Input} from "@/components/ui/input";
import {getClient} from "@/lib/graph/client";
import ConfirmationDialog from "@/components/dialogs/confirmation-dialog";
import {toast} from "sonner";
import {DeleteLabelsDocument, DeleteLabelsMutation, Label} from "@/lib/graph/generated/graphql";
import {Button} from "@/components/ui/button";
import {PlusCircle} from "lucide-react";
import {LabelColumns} from "@/app/(settings)/labels/label-columns";
import LabelDialog from "@/app/(settings)/labels/label-dialog";
import {DataTablePagination} from "@/components/table-utils/data-table-pagination";
import {useLabels} from "@/components/providers/label-provider";

export type LabelTableDialogState = {
  mode: "update" | "delete" | "add" | null;
  currentLabel: Label | null
}

export function LabelTable() {
  const {labels, triggerLabelRefetch} = useLabels();

  const [dialogState, setDialogState] = useState<LabelTableDialogState>({mode: null, currentLabel: null});
  const columns = LabelColumns({setDialogState});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [sorting, setSorting] = React.useState([{id: "name", desc: false}]);
  const data = labels;
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      columnFilters,
      columnVisibility,
      sorting,
    },
  });

  const searchKey = "name"
  const client = getClient();

  const resetDialogState = () => {
    setDialogState({mode: null, currentLabel: null});
  }

  async function handleDelete() {
    if (!dialogState.currentLabel) {
      toast.error("Ein Fehler beim Löschen des Labels ist aufgetreten")
      return
    }

    try {
      await client.request<DeleteLabelsMutation>(DeleteLabelsDocument, {ids: [dialogState.currentLabel.id]})
      toast.success("Label wurde erfolgreich gelöscht")
      resetDialogState()
      triggerLabelRefetch()
    } catch {
      toast.error("Ein Fehler beim Löschen des Labels ist aufgetreten")
    }
  }

  return (
    <div className="space-y-2" data-cy={'label-table'}>
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <Button
          data-cy={'create-label-button'}
          variant={"default"}
          onClick={() => {
            setDialogState({mode: "add", currentLabel: null});
          }}
        >
          <PlusCircle/>
          Label erstellen
        </Button>

        <Input
          data-cy={'label-searchbar'}
          placeholder="Namen filtern..."
          value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(searchKey)?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className={"text-left"} key={header.id}>
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
              table.getRowModel().rows.map((row) => (
                <TableRow
                  data-cy={'label-row'}
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={'px-5 last:text-right'}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  data-cy={'no-results-message'}
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Keine Ergebnisse.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} disableElementsPerPage/>

      <LabelDialog
        open={dialogState.mode === "update" || dialogState.mode === "add"}
        createMode={dialogState.mode === "add"}
        label={dialogState.currentLabel}
        closeDialog={resetDialogState}
        refreshData={triggerLabelRefetch}
      />

      <ConfirmationDialog
        mode="confirmation"
        description={`Dies wird das Label ${dialogState.currentLabel?.name} unwiderruflich löschen`}
        onConfirm={handleDelete}
        isOpen={dialogState.mode === "delete"}
        closeDialog={resetDialogState}
      />
    </div>
  );
}