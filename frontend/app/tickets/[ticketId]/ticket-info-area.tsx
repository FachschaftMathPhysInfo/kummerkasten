import {TicketState} from "@/lib/graph/generated/graphql";
import {format} from "date-fns";
import React from "react";

interface TicketInfoAreaProps {
  state: TicketState,
  createdAt: Date
  lastModified: Date
}

export default function TicketInfoArea({createdAt, lastModified}: TicketInfoAreaProps) {
  return (
    <div className="flex flex-col items-center w-full gap-1 border-b border-b-accent/50 text-muted-foreground py-5">
      <div className="w-full flex justify-between items-center px-10">
        <span>Erstellt:</span>
        <div>{format(createdAt, "dd.MM.yy")}</div>
      </div>

      <div className="w-full flex justify-between items-center gap-12 px-10">
        <span>Geändert:</span>
        <div>{format(lastModified, "dd.MM.yy")}</div>
      </div>
    </div>
  )
}