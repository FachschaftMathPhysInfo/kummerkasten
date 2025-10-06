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
import React, {useMemo, useState} from "react";
import {Input} from "@/components/ui/input";
import ConfirmationDialog from "@/components/dialogs/confirmation-dialog";
import {toast} from "sonner";
import {Label} from "@/lib/graph/generated/graphql";
import {Button} from "@/components/ui/button";
import {MousePointerClick, PlusCircle} from "lucide-react";
import {LabelColumns} from "@/app/(settings)/labels/label-columns";
import LabelDialog from "@/app/(settings)/labels/label-dialog";
import {DataTablePagination} from "@/components/table-utils/data-table-pagination";
import {useLabels} from "@/components/providers/label-provider";
import {cn} from "@/lib/utils";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,} from "@/components/ui/tooltip";

export type LabelTableDialogState = {
  mode: "update" | "delete" | "add" | null;
  currentLabel: Label | null
}

type FormLabelFilter = boolean | null;

export function LabelTable() {
  const {labels, deleteLabel} = useLabels();
  const [dialogState, setDialogState] = useState<LabelTableDialogState>({mode: null, currentLabel: null});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [sorting, setSorting] = React.useState([{id: "name", desc: false}]);
  const [formLabelFilter, setFormLabelFilter] = useState<FormLabelFilter>(null);
  const filteredLabels = useMemo(() => {
    if (formLabelFilter === null) {
      return labels;
    }
    return labels.filter(label => label.formLabel === formLabelFilter);
  }, [labels, formLabelFilter]);

  const columns = LabelColumns({setDialogState, formLabelFilter});
  const data = filteredLabels;
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

  const resetDialogState = () => {
    setDialogState({mode: null, currentLabel: null});
  }

  async function handleDelete() {
    if (!dialogState.currentLabel) {
      toast.error("Ein Fehler beim Löschen des Labels ist aufgetreten")
      return
    }

    const error = await deleteLabel([dialogState.currentLabel.id])

    if (!error) {
      toast.success("Label wurde erfolgreich gelöscht")
      resetDialogState()
    } else {
      toast.error("Ein Fehler beim Löschen des Labels ist aufgetreten")
    }
  }

  const handleFormLabelFilterClick = () => {
    if (formLabelFilter === true) {
      setFormLabelFilter(false);
      table.resetSorting();
    } else if (formLabelFilter === false) {
      setFormLabelFilter(null);
      table.resetSorting();
    } else {
      setFormLabelFilter(true);
    }
  };

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

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  data-cy={"filter-formlabel-button"}
                  variant={"default"}
                  onClick={handleFormLabelFilterClick}
                  className={cn(
                    "border-1  border-border bg-primary-foreground text-foreground hover:bg-muted",
                    {
                      "border-2 !border-accent": formLabelFilter === true,
                      "text-destructive": formLabelFilter === false,
                    }
                  )}
                >
                  <MousePointerClick/>

                  <TooltipContent side="top" sideOffset={5}>
                    {formLabelFilter === null ? (
                      <p>Öffentliche Labels anzeigen</p>
                    ) : formLabelFilter ? (
                      <p>Nicht-öffentliche Labels anzeigen</p>
                    ) : (
                      <p>Alle Labels anzeigen</p>
                    )}
                  </TooltipContent>
                </Button>
              </TooltipTrigger>
            </Tooltip>
          </TooltipProvider>

          <Input
            data-cy={"label-searchbar"}
            placeholder="Namen filtern..."
            value={
              (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
      </div>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className={"text-left"}
                      key={header.id}
                      style={{width: header.id == "formLabel" ? 90 : undefined}}>
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
