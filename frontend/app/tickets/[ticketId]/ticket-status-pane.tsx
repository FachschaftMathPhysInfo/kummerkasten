"use client";

import {Button} from "@/components/ui/button";
import {MoreVertical} from "lucide-react";
import {Label, Ticket} from "@/lib/graph/generated/graphql";
import React from "react";
import {TicketDialogState} from "@/app/tickets/page";
import {toast} from "sonner";
import {Sheet, SheetClose, SheetContent, SheetFooter, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {VisuallyHidden} from "@radix-ui/react-visually-hidden";
import {useSidebar} from "@/components/ui/sidebar";
import LabelArea from "@/app/tickets/[ticketId]/label-area";
import TicketInfoArea from "@/app/tickets/[ticketId]/ticket-info-area";
import TicketActionsBar from "@/app/tickets/[ticketId]/ticket-actions-bar";

interface TicketStatusPaneProps {
  ticket: Ticket | null;
  ticketLabels: Label[];
  setDialogStateAction: React.Dispatch<React.SetStateAction<TicketDialogState>>;
}

export default function TicketStatusPane({ticket, ticketLabels, setDialogStateAction}: TicketStatusPaneProps) {
  const {isMobile} = useSidebar()

  const copyCurrentUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link kopiert!");
    } catch {
      toast.error("Kopieren fehlgeschlagen");
    }
  };

  if (!ticket) return null;

  return isMobile ?
    (
      <Sheet>
        <SheetTrigger asChild>
          {isMobile ? <Button variant="outline" data-cy="mobile-filter-button">
              <MoreVertical/>
            </Button> :
            <Button variant="outline" data-cy="mobile-filter-button">
              Details
            </Button>}
        </SheetTrigger>
        <SheetContent side="right" className="w-[85%] overflow-y-auto px-10 pt-15 gap-10">
          <VisuallyHidden>
            <SheetTitle>Ticket Detail Bereich</SheetTitle>
          </VisuallyHidden>

          <TicketActionsBar
            copyCurrentUrl={copyCurrentUrl}
            ticket={ticket}
            setDialogStateAction={setDialogStateAction}
          />

          <TicketInfoArea
            state={ticket.state}
            createdAt={new Date(ticket.createdAt)}
            lastModified={new Date(ticket.lastModified)}
          />

          {ticketLabels && <LabelArea labels={ticketLabels}/>}
          <SheetFooter>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    ) : (
      <div className={'flex flex-col w-[300px] overflow-y-auto px-10 pt-15 gap-10 mr-5'}>
        <TicketActionsBar
          copyCurrentUrl={copyCurrentUrl}
          ticket={ticket}
          setDialogStateAction={setDialogStateAction}
        />

        <TicketInfoArea
          state={ticket.state}
          createdAt={new Date(ticket.createdAt)}
          lastModified={new Date(ticket.lastModified)}
        />

        {ticketLabels && <LabelArea labels={ticketLabels}/>}
      </div>
    )
}
