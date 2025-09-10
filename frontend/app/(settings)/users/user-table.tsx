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
import {
  DeleteUsersDocument,
  DeleteUsersMutation,
  DemoteDocument,
  DemoteMutation,
  PromoteDocument,
  PromoteMutation,
  UserRole
} from "@/lib/graph/generated/graphql";
import {UserColumns} from "@/app/(settings)/users/user-columns";
import {Button} from "@/components/ui/button";
import {PlusCircle} from "lucide-react";
import UserDialog from "@/app/(settings)/users/user-dialog";
import {ResetPasswordDialog} from "@/app/(settings)/users/reset-password-dialog";

interface DataTableProps {
  data: TableUser[];
  refreshData: () => void;
}

export type TableUser = {
  id: string;
  firstname: string;
  lastname: string;
  mail: string;
  role: UserRole;
}

export type UserTableDialogState = {
  mode: "promote" | "demote" | "delete" | "add" | "resetPassword" | null;
  currentUser: TableUser | null
}

export function UserTable(props: DataTableProps) {
  const [dialogState, setDialogState] = useState<UserTableDialogState>({mode: null, currentUser: null});
  const columns = UserColumns({setDialogState});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [sorting, setSorting] = React.useState([{id: "lastname", desc: false}]);
  const data = props.data;
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnFilters,
      columnVisibility,
      sorting,
    },
  });
  const searchKey = "lastname"

  const client = getClient();

  const resetDiallogState = () => {
    setDialogState({mode: null, currentUser: null});
  }

  async function handlePromote() {
    if (!dialogState.currentUser) {
      toast.error("Ein Fehler beim Ändern der Rolle ist aufgetreten")
      console.error("failed to promote user: user not provided")
      return
    }

    try {
      await client.request<PromoteMutation>(PromoteDocument, {id: dialogState.currentUser.id})
      toast.success("User wurde erfolgreich zum Admin gemacht")
      resetDiallogState()
      props.refreshData()
    } catch (error) {
      toast.error("Ein Fehler beim Ändern der Rolle ist aufgetreten")
      console.error(error)
    }
  }

  async function handleDemote() {
    if (!dialogState.currentUser) {
      toast.error("Ein Fehler beim Ändern der Rolle ist aufgetreten")
      console.error("failed to demote user: user not provided")
      return
    }

    try {
      await client.request<DemoteMutation>(DemoteDocument, {id: dialogState.currentUser.id})
      toast.success("User wurde erfolgreich zu User gemacht")
      setDialogState({mode: null, currentUser: null})
      props.refreshData()
    } catch (error) {
      toast.error("Ein Fehler beim Ändern der Rolle ist aufgetreten")
      console.error(error)
    }
  }

  async function handleDelete() {
    if (!dialogState.currentUser) {
      toast.error("Ein Fehler beim Löschen des Users ist aufgetreten")
      console.error("failed to delete user: user not provided")
      return
    }

    try {
      await client.request<DeleteUsersMutation>(DeleteUsersDocument, {ids: [dialogState.currentUser.id]})
      toast.success("User wurde erfolgreich gelöscht")
      resetDiallogState()
      props.refreshData()
    } catch (error) {
      toast.error("Ein Fehler beim Löschen des Users ist aufgetreten")
      console.error(error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Button
          data-cy={'create-user-button'}
          variant={"default"}
          onClick={() => {
            setDialogState({mode: "add", currentUser: null});
          }}
        >
          <PlusCircle/>
          User erstellen
        </Button>

        <Input
          data-cy={'user-searchbar'}
          placeholder="Nachnamen filtern..."
          value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(searchKey)?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border overflow-hidden">
        <Table data-cy={'user-table'}>
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
                  data-cy={'user-row'}
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
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

      <UserDialog
        open={dialogState.mode === "add"}
        closeDialog={resetDiallogState}
        refreshData={props.refreshData}
      />

      <ResetPasswordDialog
        user={dialogState.currentUser}
        closeDialog={resetDiallogState}
        isOpen={dialogState.mode === "resetPassword"}
      />

      <ConfirmationDialog
        mode="confirmation"
        description={`Dies wird ${dialogState.currentUser?.firstname} ${dialogState.currentUser?.lastname} zum Admin machen`}
        onConfirm={handlePromote}
        isOpen={dialogState.mode === "promote"}
        closeDialog={resetDiallogState}
      />

      <ConfirmationDialog
        mode="confirmation"
        description={`Dies wird ${dialogState.currentUser?.firstname} ${dialogState.currentUser?.lastname} zum normalen User machen`}
        onConfirm={handleDemote}
        isOpen={dialogState.mode === "demote"}
        closeDialog={resetDiallogState}
      />

      <ConfirmationDialog
        mode="confirmation"
        description={`Dies wird ${dialogState.currentUser?.firstname} ${dialogState.currentUser?.lastname} unwiderruflich löschen`}
        onConfirm={handleDelete}
        isOpen={dialogState.mode === "delete"}
        closeDialog={resetDiallogState}
      />
    </div>
  );
}