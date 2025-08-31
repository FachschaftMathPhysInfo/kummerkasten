"use client";

import { ColumnDef } from "@tanstack/react-table";
import { QuestionAnswerPair } from "@/lib/graph/generated/graphql";
import { Grip, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QAPTableDialogState } from "@/app/(settings)/faq/faq-table";

interface ActionColumnProps {
  setDialogState: React.Dispatch<React.SetStateAction<QAPTableDialogState>>;
}

export const QAPColumns = ({
  setDialogState,
}: ActionColumnProps): ColumnDef<QuestionAnswerPair>[] => [
  {
    id: "drag-handle",
    header: () => null,
    cell: ({ row }) => (
      <div
        className="p-2 -ml-2 text-foreground hover:text-gray-600 transition-colors"
        data-cy={`drag-handle-${row.original.id}`}
      >
        <Grip className="w-5 h-5 cursor-grab" />
      </div>
    ),

    size: 20,
    maxSize: 20,
    enableHiding: false,
    enableResizing: false,
  },
  {
    accessorKey: "question",
    header: "Frage",
    minSize: 100,
    size: 1,
    cell: ({ getValue }) => (
      <div className="whitespace-normal break-words">
        {String(getValue() ?? "")}
      </div>
    ),
  },
  {
    accessorKey: "answer",
    header: "Antwort",
    minSize: 150,
    size: 2,
    cell: ({ getValue }) => (
      <div className="whitespace-normal break-words">
        {String(getValue() ?? "")}
      </div>
    ),
  },
  {
    id: "actions",
    size: 80,
    maxSize: 80,
    cell: ({ row }) => (
      <div className="flex justify-end gap-x-2">
        <Button
          data-cy={`edit-button-${row.original.id}`}
          onClick={() =>
            setDialogState({ mode: "update", currentQAP: row.original })
          }
          variant={"ghost"}
          size={"icon"}
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          data-cy={`delete-button-${row.original.id}`}
          onClick={() =>
            setDialogState({ mode: "delete", currentQAP: row.original })
          }
          variant={"ghost"}
          size={"icon"}
          className="text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    ),
  },
];
