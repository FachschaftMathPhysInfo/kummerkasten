import {Button} from "@/components/ui/button";
import {Label, UserRole} from "@/lib/graph/generated/graphql"
import {ColumnDef} from "@tanstack/react-table";
import {Edit2, Trash,} from "lucide-react";
import React from "react";
import {DataTableColumnHeader} from "@/components/table-utils/data-table-column-header";
import {LabelTableDialogState} from "@/app/(settings)/labels/label-table";
import {Badge} from "@/components/ui/badge";
import {calculateFontColor} from "@/lib/calculate-colors";
import {compareInLowercase} from "@/lib/utils";
import {useUser} from "@/components/providers/user-provider";

interface UserColumnProps {
  setDialogState: React.Dispatch<React.SetStateAction<LabelTableDialogState>>;
}

export function LabelColumns(props: UserColumnProps): ColumnDef<Label>[] {
  const {user} = useUser()

  return [
    {
      accessorKey: "name",
      header: ({column}) => (
        <DataTableColumnHeader column={column} title="Name"/>
      ),
      sortingFn: compareInLowercase,
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