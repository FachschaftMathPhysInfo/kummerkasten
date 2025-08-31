"use client"

import {Button} from "@/components/ui/button";
import {Clipboard, Edit2, Trash2} from "lucide-react";
import React from "react";
import {Ticket} from "@/lib/graph/generated/graphql";
import {TicketDialogState} from "@/app/tickets/page";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

interface TicketActionsBarProps {
  copyCurrentUrl: () => Promise<void>;
  ticket: Ticket;
  setDialogStateAction: React.Dispatch<React.SetStateAction<TicketDialogState>>;
}

export default function TicketActionsBar(props: TicketActionsBarProps) {
  return (
    <div className="flex justify-between items-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            onClick={() => props.setDialogStateAction({
              mode: "update",
              currentTicket: props.ticket
            })}
            data-cy="edit-ticket"
          >
            <Edit2/>
          </Button>
        </TooltipTrigger>
        <TooltipContent className={'mb-2'}>Bearbeite das Ticket</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            onClick={props.copyCurrentUrl}
            data-cy="copy-link-statusbar"
          >
            <Clipboard/>
          </Button>
        </TooltipTrigger>
        <TooltipContent className={'mb-2'}>
          Kopiere Link des Tickets
        </TooltipContent>
      </Tooltip>


      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="destructive"
            onClick={() => props.setDialogStateAction({
              mode: "delete",
              currentTicket: props.ticket
            })}
            data-cy="delete-ticket-statusbar"
          >
            <Trash2/>
          </Button>
        </TooltipTrigger>
        <TooltipContent className={'bg-destructive mb-2'}>
          Lösche Ticket
        </TooltipContent>
      </Tooltip>
    </div>
  )
}