import {Button} from "@/components/ui/button";
import {Label, UserRole} from "@/lib/graph/generated/graphql"
import {ColumnDef} from "@tanstack/react-table";
import {MousePointerClick, Edit2, Trash,} from "lucide-react";
import React from "react";
import {DataTableColumnHeader} from "@/components/table-utils/data-table-column-header";
import {LabelTableDialogState} from "@/app/(settings)/labels/label-table";
import {Badge} from "@/components/ui/badge";
import {calculateFontColor} from "@/lib/calculate-colors";
import {compareRowsInLowercase} from "@/lib/utils";
import {useUser} from "@/components/providers/user-provider";

interface UserColumnProps {
  setDialogState: React.Dispatch<React.SetStateAction<LabelTableDialogState>>;
  formLabelFilter: boolean | null;
}

export function LabelColumns(props: UserColumnProps): ColumnDef<Label>[] {
  const {user} = useUser()

  return [
     {
      id: "formLabel",
      size: 70,
      accessorFn: (row) => row.formLabel ? 1 : 0,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Öffentlich" className="flex items-center justify-center h-full" data-cy={'sort-by-formlabel-button'}/>
      ),
      enableSorting: props.formLabelFilter === null,
      sortingFn: (rowA, rowB, columnId) => {
        const a = rowA.getValue(columnId) as number;
        const b = rowB.getValue(columnId) as number;

        if (a != b) {
          return a < b ? -1 : 1; 
        }
        const nameSortResult = compareRowsInLowercase(rowA, rowB, "name");
        return nameSortResult === 0 ? 0 : nameSortResult > 0 ? -1 : 1;
      },
      cell: ({row}) => (
        <div className="flex items-center justify-center h-full">
          {row.original.formLabel === true && (
            <MousePointerClick data-cy={'formLabel-icon'}/>
          )}
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: ({column}) => (
        <DataTableColumnHeader column={column} title="Name" data-cy={'sort-by-name-button'}/>
      ),
      sortingFn: compareRowsInLowercase,
      cell: ({row}) =>
        <Badge
          data-cy={'label-name-cell'}
          style={{backgroundColor: row.original.color, color: calculateFontColor(row.original.color)}}
        >
          {row.original.name}
        </Badge>
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({row}) => {
        return (
          <div className={'flex gap-2 w-full justify-end'}>
            <Button
              variant={"ghost"}
              type={"button"}
              onClick={() => props.setDialogState({
                mode: "update",
                currentLabel: row.original
              })}
              data-cy={'label-edit-button'}
            >
              <Edit2/>
            </Button>
            {user?.role === UserRole.Admin && (
              <Button
                variant={'ghost'}
                type={"button"}
                onClick={() => props.setDialogState({
                  mode: "delete",
                  currentLabel: row.original
                })}
                className={'text-destructive'}
                data-cy={'label-delete-button'}
              >
                <Trash className={'stroke-destructive'}/>
              </Button>
            )}
          </div>
        );
      },
    },
  ];
}