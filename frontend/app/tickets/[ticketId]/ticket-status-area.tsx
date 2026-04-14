import {TicketState} from "@/lib/graph/generated/graphql";
import React from "react";
import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";
import {Select, SelectContent, SelectItem, SelectTrigger} from "@/components/ui/select";
import {calculateFontColor} from "@/lib/calculate-colors";
import {getTicketStateColor} from "@/lib/ticket-operations";
import { useTranslations } from "next-intl";

interface TicketStatusAreaProps {
  state: TicketState;
  setStatusAction: (state: TicketState) => void;
}


export default function TicketStatusArea({state, setStatusAction}: TicketStatusAreaProps) {
  const tc = useTranslations("Commons")

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
          data-cy={'ticket-status-area'}
        >
          {state === TicketState.New
            ? tc("ticketStates.new")
            : state === TicketState.Open
              ? tc("ticketStates.open")
              : tc("ticketStates.done")}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="NEW">
            <Badge
              className="w-full bg-ticketstate-new"
              style={{color: calculateFontColor(getTicketStateColor(TicketState.New))}}
              data-cy={'ticket-status-new'}
            >
              {tc("ticketStates.new")}
            </Badge>
          </SelectItem>
          <SelectItem value="OPEN">
            <Badge
              className="w-full bg-ticketstate-open"
              style={{color: calculateFontColor(getTicketStateColor(TicketState.Open))}}
              data-cy={'ticket-status-open'}
            >
              {tc("ticketStates.open")}
            </Badge>
          </SelectItem>
          <SelectItem value="CLOSED">
            <Badge
              className="w-full bg-ticketstate-closed"
              style={{color: calculateFontColor(getTicketStateColor(TicketState.Closed))}}
              data-cy={'ticket-status-closed'}
            >
              {tc("ticketStates.done")}
            </Badge>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}