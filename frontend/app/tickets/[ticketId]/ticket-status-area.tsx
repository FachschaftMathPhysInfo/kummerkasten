import {TicketState} from "@/lib/graph/generated/graphql";
import React from "react";
import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";
import {Select, SelectContent, SelectItem, SelectTrigger} from "@/components/ui/select";

interface TicketStatusAreaProps {
  state: TicketState;
  setStatusAction: (state: TicketState) => void;
}

export default function TicketStatusArea({state, setStatusAction}: TicketStatusAreaProps) {
  return (
    <div className={'w-full'}>
      <Select defaultValue={state} onValueChange={(val) => setStatusAction(val as TicketState)}>
        <SelectTrigger
          className={cn(
            "w-full justify-center [&>svg]:hidden !relative",
            state === TicketState.New
              ? "!bg-ticketstate-new"
              : state === TicketState.Open
                ? "!bg-ticketstate-open"
                : "!bg-ticketstate-closed"
          )}
        >
          {state === TicketState.New
            ? "Neu"
            : state === TicketState.Open
              ? "Offen"
              : "Fertig"}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="NEW">
            <Badge className="w-full bg-ticketstate-new">Neu</Badge>
          </SelectItem>
          <SelectItem value="OPEN">
            <Badge className="w-full bg-ticketstate-open">Offen</Badge>
          </SelectItem>
          <SelectItem value="CLOSED">
            <Badge className="w-full bg-ticketstate-closed">Fertig</Badge>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}