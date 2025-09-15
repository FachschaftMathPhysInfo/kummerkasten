import {TicketState} from "@/lib/graph/generated/graphql";
import React from "react";
import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";
import {Select, SelectContent, SelectItem, SelectTrigger} from "@/components/ui/select";
import {calculateFontColor} from "@/lib/calculate-colors";
import {getTicketStateColor} from "@/lib/ticketstate-colour";

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
              ? "!bg-ticketstate-new hover:!bg-ticketstate-new/60"
              : state === TicketState.Open
                ? "!bg-ticketstate-open hover:!bg-ticketstate-open/60"
                : "!bg-ticketstate-closed hover:!bg-ticketstate-closed/60"
          )}
          style={{color: calculateFontColor(getTicketStateColor(state))}}
        >
          {state === TicketState.New
            ? "Neu"
            : state === TicketState.Open
              ? "Offen"
              : "Fertig"}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="NEW">
            <Badge
              className="w-full bg-ticketstate-new"
              style={{color: calculateFontColor(getTicketStateColor(TicketState.New))}}
            >
              Neu
            </Badge>
          </SelectItem>
          <SelectItem value="OPEN">
            <Badge
              className="w-full bg-ticketstate-open"
              style={{color: calculateFontColor(getTicketStateColor(TicketState.Open))}}
            >
              Offen
            </Badge>
          </SelectItem>
          <SelectItem value="CLOSED">
            <Badge
              className="w-full bg-ticketstate-closed"
              style={{color: calculateFontColor(getTicketStateColor(TicketState.Closed))}}
            >
              Fertig
            </Badge>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}