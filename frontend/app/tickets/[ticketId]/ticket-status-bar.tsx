"use client";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Edit2, MoreVertical, Share2, Trash2} from "lucide-react";
import {Label, Ticket} from "@/lib/graph/generated/graphql";
import React, {useEffect, useState} from "react";
import {TicketDialogState} from "@/app/tickets/page";
import {toast} from "sonner";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import {format} from "date-fns";

interface TicketStatusBarProps {
  ticket: Ticket | null;
  ticketLabels: Label[];
  setDialogStateAction: React.Dispatch<React.SetStateAction<TicketDialogState>>;
}

function useIsMobile(breakpoint = 480) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < breakpoint);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [breakpoint]);
  return isMobile;
}

export default function TicketStatusBar({ticket, ticketLabels, setDialogStateAction}: TicketStatusBarProps) {
  const isMobile = useIsMobile();

  const copyCurrentUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link kopiert!");
    } catch {
      toast.error("Kopieren fehlgeschlagen");
    }
  };


  if (!ticket) return <div/>;

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
      <SheetContent side="right" className="w-[85%] sm:w-[300px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Ticket-Details</SheetTitle>
          <SheetDescription>Bearbeite und sehe Details zum ausgewählten Ticket ein.</SheetDescription>
        </SheetHeader>
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

        <SheetHeader className="pt-2"><SheetTitle>Details</SheetTitle></SheetHeader>
        <div className="flex flex-col justify-center items-center h-full w-full">
          <div
            className="flex flex-col justify-center gap-4">
            <div className="flex flex-row justify-between items-center">
              <div>Status:</div>
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
            <div className="flex flex-row justify-between items-center">
              <div>Erstellt:</div>
              <div>{format(new Date(ticket.createdAt), "dd.MM.yy")}</div>
            </div>
            <div className="flex flex-row justify-between items-center gap-12">
              <div className="pr-6">Geändert:</div>
              <div>{format(new Date(ticket.lastModified), "dd.MM.yy")}</div>
            </div>
          </div>
        </div>
        <SheetHeader><SheetTitle>Labels</SheetTitle></SheetHeader>
        <div className="flex flex-col justify-center items-center h-full w-full py-0">
          <div
            className="flex flex-col gap-2 overflow-x-auto max-w-full py-0 items-center overflow-y-auto max-h-[100px] md:max-h-[170px]">
            {ticketLabels?.map((label) => (
              label?.id &&
              <Badge
                key={label.id}
                className="flex-shrink-0 text-white justify-center px-3 py-1 md:w-full"
                style={{backgroundColor: label.color ?? "#000000"}}
                data-cy={`ticket-label-${label.id}`}
              >
                {label.name}
              </Badge>
            ))}
          </div>
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
