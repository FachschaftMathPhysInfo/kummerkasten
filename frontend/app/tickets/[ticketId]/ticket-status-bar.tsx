"use client";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {AlignLeftIcon, Edit2, Link, MoreVertical, Trash2} from "lucide-react";
import {Label, Ticket, TicketState} from "@/lib/graph/generated/graphql";
import React, {useEffect, useState} from "react";
import {TicketDialogState} from "@/app/tickets/page";
import {useRouter} from "next/navigation";
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
import {cn} from "@/lib/utils";
import LabelBadge from "@/components/label-badge";

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
  const router = useRouter();
  const isMobile = useIsMobile();

  const copyCurrentUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link kopiert!");
    } catch {
      toast.error("Kopieren fehlgeschlagen");
    }
  };

  console.log('Ticket State: ', ticket?.state)

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
          <div className="flex flex-col flex-grow justify-between">
            <SheetHeader className="pt-0">
              <SheetTitle>Aktionen</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col justify-center items-center h-full w-full">
              <div className="flex flex-col gap-2">
                <div className="flex flex-row justify-between items-center">
                  <div>Ticket-Übersicht:</div>
                  <Button variant="outline" onClick={() => router.push("/tickets")}
                          data-cy="exit-ticket"><AlignLeftIcon/></Button>
                </div>
                <div className="flex flex-row items-center justify-between">
                  <div className="flex justify-start">Link kopieren:</div>
                  <Button className="flex justify-end" variant="outline" onClick={copyCurrentUrl}
                          data-cy="copy-link-statusbar"><Link/></Button>
                </div>
                <div className="flex flex-row justify-between items-center gap-8">
                  <div>Ticket bearbeiten:</div>
                  <Button variant="outline" onClick={() => setDialogStateAction({
                    mode: "update",
                    currentTicket: ticket
                  })} data-cy="edit-ticket"><Edit2/></Button>
                </div>
                <div className="flex flex-row justify-between items-center">
                  <div className="text-destructive">Ticket löschen:</div>
                  <Button variant="destructive" onClick={() => setDialogStateAction({
                    mode: "delete",
                    currentTicket: ticket
                  })} data-cy="delete-ticket-statusbar"><Trash2/></Button>
                </div>
              </div>
            </div>
            <SheetHeader className="pt-2"><SheetTitle>Details</SheetTitle></SheetHeader>
            <div className="flex flex-col justify-center items-center h-full w-full">
              <div
                className="flex flex-col justify-center gap-4">
                <div className="flex flex-row justify-between items-center">
                  <div>Status:</div>
                  <Badge
                    className={cn(
                      "rounded text-white",
                      ticket?.state === TicketState.New && "bg-ticketstate-new",
                      ticket?.state === TicketState.Open && "bg-ticketstate-open",
                      ticket?.state === TicketState.Closed && "bg-ticketstate-closed"
                    )}
                    data-cy="ticket-status-badge-detail"
                  >
                      {ticket.state === TicketState.New ? "Neu"
                        : ticket.state === TicketState.Open
                          ? "Offen"
                          : "Fertig"
                      }
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
                  label?.id && <LabelBadge key={label.id} label={label}/>
                ))}
              </div>
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
