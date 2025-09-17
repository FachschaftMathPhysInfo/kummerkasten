"use client"

import {Button} from "@/components/ui/button";
import {Clipboard, Edit2, Trash} from "lucide-react";
import React from "react";
import {Ticket, UserRole} from "@/lib/graph/generated/graphql";
import {TicketDialogState} from "@/app/tickets/page";
import {useUser} from "@/components/providers/user-provider";

interface TicketActionsBarProps {
  copyCurrentUrl: () => Promise<void>;
  ticket: Ticket;
  setDialogStateAction: React.Dispatch<React.SetStateAction<TicketDialogState>>;
}

export default function TicketActionsBar(props: TicketActionsBarProps) {
  const {user} = useUser()

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
      {user?.role === UserRole.Admin && (
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
      )}
    </div>
  )
}