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
        <div className="flex justify-evenly items-center">
          <Button
            variant="outline"
            onClick={copyCurrentUrl}
            data-cy="copy-link-statusbar"
          >
            <Share2/>
          </Button>

          <Button
            variant="outline"
            onClick={() => setDialogStateAction({
              mode: "update",
              currentTicket: ticket
            })}
            data-cy="edit-ticket"
          >
            <Edit2/>
          </Button>

          <Button
            variant="destructive"
            onClick={() => setDialogStateAction({
              mode: "delete",
              currentTicket: ticket
            })}
            data-cy="delete-ticket-statusbar"
          >
            <Trash2/>
          </Button>
        </div>

        <div className="flex flex-col items-center w-full gap-1">
          <div className="w-full flex justify-between items-center">
            <span>Status:</span>
            <Badge
              className="text-white rounded"
              style={{
                backgroundColor: ticket.state === "NEW" ? "#839176" :
                  ticket.state === "OPEN" ? "#192B51" :
                    ticket.state === "CLOSED" ? "#DF517F" : "gray"
              }}
              data-cy="ticket-status-badge-detail"
            >
              {ticket.state.toLowerCase()}
            </Badge>
          </div>

          <div className="w-full flex justify-between items-center">
            <span>Erstellt:</span>
            <div>{format(new Date(ticket.createdAt), "dd.MM.yy")}</div>
          </div>

          <div className="w-full flex justify-between items-center gap-12">
            <span>Geändert:</span>
            <div>{format(new Date(ticket.lastModified), "dd.MM.yy")}</div>
          </div>
        </div>

        <div
          className="flex flex-col gap-2 overflow-y-scroll grow">
          {ticketLabels?.map((label) => (
            <Badge
              key={label.id}
              className="text-white max-w-full px-1"
              style={{backgroundColor: label.color}}
              data-cy={`ticket-label-${label.id}`}
            >
              <span className="truncate max-w-full px-1">{label.name}</span>
            </Badge>
          ))}
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
