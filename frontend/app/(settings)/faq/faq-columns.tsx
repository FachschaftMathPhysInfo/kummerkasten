"use client";

import {ColumnDef} from "@tanstack/react-table";
import {QuestionAnswerPair} from "@/lib/graph/generated/graphql";
import {Edit2, Grip, Trash} from "lucide-react";
import {Button} from "@/components/ui/button";
import {QAPTableDialogState} from "@/app/(settings)/faq/faq-table";
import React from "react";
import {useSidebar} from "@/components/ui/sidebar";

interface QAPColumnProps {
  setDialogState: React.Dispatch<React.SetStateAction<QAPTableDialogState>>;
}

export default function QAPColumns({
                             setDialogState
                           }: QAPColumnProps): ColumnDef<QuestionAnswerPair>[] {

  const {isMobile} = useSidebar()

  return [
    {
      id: "drag-handle",
      header: () => null,
      cell: ({row}) => {
        return !isMobile && (
          <div
            className="p-2 text-foreground hover:text-accent transition-colors flex items-center justify-center"
            data-cy={`drag-handle-${row.original.id}`}
          >
            <Grip className="w-5 h-5 cursor-grab"/>
          </div>
        )
      },
      size: 20,
      enableHiding: false,
      enableResizing: false,
    },
    {
      accessorKey: "question",
      header: "Frage",
      cell: ({getValue}) => (
        <div className="break-words">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "answer",
      header: "Antwort",
      cell: ({getValue}) => (
        <div className="break-words flex-2">
          {getValue() as string}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({row}) => (
        <div
          className="flex justify-end gap-x-2 shrink-0"
        >
          <Button
            data-cy={`edit-button-${row.original.id}`}
            onClick={() =>
              setDialogState({mode: "update", currentQAP: row.original})
            }
            variant="ghost"
            size="icon"
          >
            <Edit2/>
          </Button>
          <Button
            data-cy={`delete-button-${row.original.id}`}
            onClick={() =>
              setDialogState({mode: "delete", currentQAP: row.original})
            }
            variant="ghost"
            size="icon"
            className="text-destructive"
          >
            <Trash/>
          </Button>
        </div>
      ),
    },
  ]
}
