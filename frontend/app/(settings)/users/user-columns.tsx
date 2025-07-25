import {Button} from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";
import {UserRole} from "@/lib/graph/generated/graphql"
import {ColumnDef} from "@tanstack/react-table";
import {MoreHorizontal, Shield, Trash,} from "lucide-react";
import React from "react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,} from "@/components/ui/tooltip";
import {useUser} from "@/components/providers/user-provider";
import {DataTableColumnHeader} from "@/components/table-utils/data-table-column-header";
import {TableUser, UserTableDialogState} from "@/app/(settings)/users/user-table";

interface UserColumnProps {
  setDialogState: React.Dispatch<React.SetStateAction<UserTableDialogState>>;
}

export function UserColumns(props: UserColumnProps): ColumnDef<TableUser>[] {
  const {user} = useUser();

  return [
    {
      id: "role",
      cell: ({row}) => (
        <>
          {row.original.role === UserRole.Admin && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Shield/>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Admin</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </>
      ),
    },
    {
      accessorKey: "lastname",
      // Alternatives: force save names with first letter capitalized
      sortingFn: (rowA, rowB) => {
        const a = (rowA.original.lastname).toLowerCase();
        const b = (rowB.original.lastname).toLowerCase();
        return a.localeCompare(b);
      },
      header: ({column}) => (
        <DataTableColumnHeader column={column} title="Nachname"/>
      ),
      cell: ({row}) => row.original.lastname,
    },
    {
      accessorKey: "firstname",
      sortingFn: (rowA, rowB) => {
        const a = (rowA.original.firstname).toLowerCase();
        const b = (rowB.original.firstname).toLowerCase();
        return a.localeCompare(b);
      },
      header: ({column}) => (
        <DataTableColumnHeader column={column} title="Vorname"/>
      ),
      cell: ({row}) => row.original.firstname,
    },
    {
      accessorKey: "mail",
      sortingFn: (rowA, rowB) => {
        const a = (rowA.original.mail).toLowerCase();
        const b = (rowB.original.mail).toLowerCase();
        return a.localeCompare(b);
      },
      header: ({column}) => (
        <DataTableColumnHeader column={column} title="E-Mail"/>
      ),
      cell: ({row}) => row.original.mail,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({row}) => {
        return (
          <>
            {/*Mail is a unique identifier.*/}
            {!(row.original.mail === user?.mail) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Menü öffnen</span>
                    <MoreHorizontal className="h-4 w-4"/>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {row.original.role === UserRole.Admin ? (
                    <DropdownMenuItem
                      onClick={() => props.setDialogState({
                        mode: "demote",
                        currentUser: row.original
                      })}
                    >
                      Admin entfernen
                    </DropdownMenuItem>
                  ) : (
                    <>
                      <DropdownMenuItem
                        onClick={() => props.setDialogState({
                          mode: "promote",
                          currentUser: row.original
                        })}
                      >
                        Admin machen
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => props.setDialogState({
                          mode: "delete",
                          currentUser: row.original
                        })}
                        className={'text-destructive'}
                      >
                        <Trash className={'stroke-destructive inline mr-2'}/>
                        Löschen
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </>
        );
      },
    },
  ];
}