import {Button} from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";
import {UserRole} from "@/lib/graph/generated/graphql"
import {ColumnDef} from "@tanstack/react-table";
import {MoreHorizontal, RotateCcw, Shield, Trash, UserCheck, UserMinus,} from "lucide-react";
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
        <div className="flex items-center justify-center h-full">
          {row.original.role === UserRole.Admin && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Shield data-cy={'admin-icon'}/>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Admin</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
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
        <span data-cy={'lastname-header'}>
          <DataTableColumnHeader column={column} title="Nachname"/>
        </span>
      ),
      cell: ({row}) => <span data-cy={'lastname-cell'}>{row.original.lastname}</span>,
    },
    {
      accessorKey: "firstname",
      sortingFn: (rowA, rowB) => {
        const a = (rowA.original.firstname).toLowerCase();
        const b = (rowB.original.firstname).toLowerCase();
        return a.localeCompare(b);
      },
      header: ({column}) => (
        <span data-cy={'firstname-header'}>
          <DataTableColumnHeader column={column} title="Vorname"/>
        </span>
      ),
      cell: ({row}) => <span data-cy={'firstname-cell'}>{row.original.firstname}</span>,
    },
    {
      accessorKey: "mail",
      sortingFn: (rowA, rowB) => {
        const a = (rowA.original.mail).toLowerCase();
        const b = (rowB.original.mail).toLowerCase();
        return a.localeCompare(b);
      },
      header: ({column}) => (
        <span data-cy={'mail-header'}>
          <DataTableColumnHeader column={column} title="E-Mail"/>
        </span>
      ),
      cell: ({row}) => <span data-cy={'mail-cell'}>{row.original.mail}</span>,
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
                  <span data-cy={'action-dropdown'}>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Menü öffnen</span>
                      <MoreHorizontal className="h-4 w-4"/>
                    </Button>
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {row.original.role === UserRole.Admin ? (
                    <>
                      <DropdownMenuItem
                        onClick={() => props.setDialogState({
                          mode: "demote",
                          currentUser: row.original
                        })}
                        data-cy={'demote-button'}
                      >
                        <UserMinus className={'inline mr-2'}/>
                        Admin entfernen
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => props.setDialogState({
                          mode: "resetPassword",
                          currentUser: row.original
                        })}
                        data-cy={'reset-password-button'}
                      >
                        <RotateCcw className={'inline mr-2'}/>
                        Password zurücksetzen
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem
                        onClick={() => props.setDialogState({
                          mode: "promote",
                          currentUser: row.original
                        })}
                        data-cy={'promote-button'}
                      >
                        <UserCheck className={'inline mr-2'}/>
                        Admin machen
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => props.setDialogState({
                          mode: "resetPassword",
                          currentUser: row.original
                        })}
                        data-cy={'reset-password-button'}
                      >
                        <RotateCcw className={'inline mr-2'}/>
                        Password zurücksetzen
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => props.setDialogState({
                          mode: "delete",
                          currentUser: row.original
                        })}
                        className={'text-destructive'}
                        data-cy={'delete-button'}
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