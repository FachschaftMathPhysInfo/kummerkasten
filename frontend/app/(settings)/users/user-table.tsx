import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel, getPaginationRowModel,
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
import {
  DeleteUsersDocument,
  DeleteUsersMutation,
  DemoteDocument,
  DemoteMutation,
  PromoteDocument,
  PromoteMutation,
  User
} from "@/lib/graph/generated/graphql";
import {UserColumns} from "@/app/(settings)/users/user-columns";

interface DataTableProps {
  data: User[];
  refreshData: () => void;
}

export type UserTableDialogState = {
  mode: "promote" | "demote" | "delete" | null;
  currentUserID?: string;
}

export function UserTable(props: DataTableProps) {
  const [dialogState, setDialogState] = useState<UserTableDialogState>({mode: null});
  const columns = UserColumns({setDialogState});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const data = props.data;
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnFilters,
      columnVisibility,
    },
  });
  const client = getClient();
  const searchKey = "lastname"

  async function handlePromote() {
    try {
      await client.request<PromoteMutation>(PromoteDocument, {id: dialogState.currentUserID})
      toast.success("User wurde erfolgreich zum Admin gemacht")
      setDialogState({mode: null})
      props.refreshData()
    } catch (error) {
      toast.error("Ein Fehler beim Ändern der Rolle ist aufgetreten")
      console.error(error)
    }
  }

  async function handleDemote() {
    try {
      await client.request<DemoteMutation>(DemoteDocument, {id: dialogState.currentUserID})
      toast.success("User wurde erfolgreich zu User gemacht")
      setDialogState({mode: null})
      props.refreshData()
    } catch (error) {
      toast.error("Ein Fehler beim Ändern der Rolle ist aufgetreten")
      console.error(error)
    }
  }

  async function handleDelete() {
    try {
      await client.request<DeleteUsersMutation>(DeleteUsersDocument, {ids: [dialogState.currentUserID]})
      toast.success("User wurde erfolgreich gelöscht")
      setDialogState({mode: null})
      props.refreshData()
    } catch (error) {
      toast.error("Ein Fehler beim Löschen des Users ist aufgetreten")
      console.error(error)
    }
  }

  function closeDialog() {
    setDialogState({ mode: null });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Input
          placeholder="Nachnamen filtern..."
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
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      className={"[&:not(:first-child)]:ml-8"}
                      key={cell.id}
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

      <ConfirmationDialog
        mode="confirmation"
        description={`Dies wird den ausgewählten User zum Admin machen`}
        onConfirm={handlePromote}
        isOpen={dialogState.mode === "promote"}
        closeDialog={closeDialog}
      />

      <ConfirmationDialog
        mode="confirmation"
        description={`Dies wird den ausgewählten Admin zum normalen User machen`}
        onConfirm={handleDemote}
        isOpen={dialogState.mode === "demote"}
        closeDialog={closeDialog}
      />

      <ConfirmationDialog
        mode="confirmation"
        description={`Dies wird den ausgewählten User unwiederruflich löschen`}
        onConfirm={handleDelete}
        isOpen={dialogState.mode === "delete"}
        closeDialog={closeDialog}
      />
    </div>
  );
}