import {TicketState} from "@/lib/graph/generated/graphql";
import {Badge} from "@/components/ui/badge";
import {format} from "date-fns";
import React from "react";

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
          className="text-white rounded"
          style={{
            backgroundColor: state === TicketState.New ? "#839176" :
              state === TicketState.Open ? "#192B51" : "CLOSED"
          }}
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