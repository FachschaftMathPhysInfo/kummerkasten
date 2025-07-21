import {Button} from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";
import {Label} from "@/lib/graph/generated/graphql"
import {ColumnDef} from "@tanstack/react-table";
import {Edit2, MoreHorizontal, Trash,} from "lucide-react";
import React from "react";
import {DataTableColumnHeader} from "@/components/table-utils/data-table-column-header";
import {LabelTableDialogState} from "@/app/(settings)/labels/label-table";

interface UserColumnProps {
  setDialogState: React.Dispatch<React.SetStateAction<LabelTableDialogState>>;
}

export function LabelColumns(props: UserColumnProps): ColumnDef<Label>[] {

  return [
    {
      accessorKey: "name",
      // Alternatives: force save names with first letter capitalized
      sortingFn: (rowA, rowB) => {
        const a = (rowA.original.name).toLowerCase();
        const b = (rowB.original.name).toLowerCase();
        return a.localeCompare(b);
      },
      header: ({column}) => (
        <DataTableColumnHeader column={column} title="Name"/>
      ),
      cell: ({row}) => row.original.name,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({row}) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Menü öffnen</span>
                <MoreHorizontal className="h-4 w-4"/>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => props.setDialogState({
                  mode: "update",
                  currentLabel: row.original
                })}
              >
                <Edit2/>
                Bearbeiten
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => props.setDialogState({
                  mode: "delete",
                  currentLabel: row.original
                })}
                className={'text-destructive'}
              >
                <Trash className={'stroke-destructive'}/>
                Löschen
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}