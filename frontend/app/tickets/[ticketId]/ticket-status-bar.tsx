"use client";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Edit2, MoreVertical, Share2, Trash2} from "lucide-react";
import {Label, Ticket} from "@/lib/graph/generated/graphql";
import React from "react";
import {TicketDialogState} from "@/app/tickets/page";
import {toast} from "sonner";
import {Sheet, SheetClose, SheetContent, SheetFooter, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {format} from "date-fns";
import {VisuallyHidden} from "@radix-ui/react-visually-hidden";
import {useSidebar} from "@/components/ui/sidebar";
import LabelArea from "@/app/tickets/[ticketId]/label-area";
import TicketInfoArea from "@/app/tickets/[ticketId]/ticket-info-area";
import TicketActionsBar from "@/app/tickets/[ticketId]/ticket-actions-bar";

interface TicketStatusBarProps {
  ticket: Ticket | null;
  ticketLabels: Label[];
  setDialogStateAction: React.Dispatch<React.SetStateAction<TicketDialogState>>;
}

export default function TicketStatusBar({ticket, ticketLabels, setDialogStateAction}: TicketStatusBarProps) {
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

  return (
    <Sheet>
      <SheetTrigger asChild>
        {isMobile ? <Button variant="outline" data-cy="mobile-filter-button">
            <MoreVertical/>
          </Button> :
          <Button variant="outline" data-cy="mobile-filter-button">
            Details
          </Button>}
      </SheetTrigger>
      <SheetContent side="right" className="w-[85%] sm:w-[300px] overflow-y-auto px-10 pt-15 gap-10">
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
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
