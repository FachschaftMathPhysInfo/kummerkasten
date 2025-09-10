"use client"

import {Button} from "@/components/ui/button";
import {Clipboard, Edit2, Trash} from "lucide-react";
import React from "react";
import {Ticket} from "@/lib/graph/generated/graphql";
import {TicketDialogState} from "@/app/tickets/page";

interface TicketActionsBarProps {
  copyCurrentUrl: () => Promise<void>;
  ticket: Ticket;
  setDialogStateAction: React.Dispatch<React.SetStateAction<TicketDialogState>>;
}

export default function TicketActionsBar(props: TicketActionsBarProps) {
  return (
    <div className="flex justify-between items-center">
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
      <Button
        variant="outline"
        onClick={props.copyCurrentUrl}
        data-cy="copy-link-statusbar"
      >
        <Clipboard/>
      </Button>
      <Button
        variant="destructive"
        onClick={() => props.setDialogStateAction({
          mode: "delete",
          currentTicket: props.ticket
        })}
        data-cy="delete-ticket-statusbar"
      >
        <Trash/>
      </Button>
    </div>
  )
}