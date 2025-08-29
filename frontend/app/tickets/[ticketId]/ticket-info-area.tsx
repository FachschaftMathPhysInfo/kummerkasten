import {TicketState} from "@/lib/graph/generated/graphql";
import {Badge} from "@/components/ui/badge";
import {format} from "date-fns";
import React from "react";
import {cn} from "@/lib/utils";

interface TicketInfoAreaProps {
  state: TicketState,
  createdAt: Date
  lastModified: Date
}

export default function TicketInfoArea({state, createdAt, lastModified}: TicketInfoAreaProps) {
  return (
    <div className="flex flex-col items-center w-full gap-1">
      <div className="w-full flex justify-between items-center">
        <span>Status:</span>
        <Badge
          className={cn(
            'text-white rounded',
            state === TicketState.New ? 'bg-ticketstate-new'
              : state === TicketState.Open ? 'bg-ticketstate-open'
              : 'bg-ticketstate-closed'
          )}
          data-cy="ticket-status-badge-detail"
        >
          {state.toLowerCase()}
        </Badge>
      </div>

      <div className="w-full flex justify-between items-center">
        <span>Erstellt:</span>
        <div>{format(createdAt, "dd.MM.yy")}</div>
      </div>

      <div className="w-full flex justify-between items-center gap-12">
        <span>Geändert:</span>
        <div>{format(lastModified, "dd.MM.yy")}</div>
      </div>
    </div>
  )
}