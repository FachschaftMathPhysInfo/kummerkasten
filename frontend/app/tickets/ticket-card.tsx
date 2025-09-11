"use client"

import React, {useCallback, useEffect, useState} from "react";
import {Card, CardTitle} from "@/components/ui/card";
import {Label, Ticket, TicketsByIdsDocument, TicketsByIdsQuery, TicketState} from "@/lib/graph/generated/graphql";
import {Link, MoreHorizontal, MoreVertical, Trash2} from "lucide-react";
import {Badge} from "@/components/ui/badge"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";
import {getClient} from "@/lib/graph/client";
import {TicketDialogState} from "@/app/tickets/page";
import {toast} from "sonner";
import {format} from "date-fns";
import {calculateFontColor} from "@/lib/calculate-colors";
import {cn} from "@/lib/utils";
import {getTicketStateColor} from "@/lib/ticketstate-colour";


type TicketProps = {
  ticketID: string
  setDialogStateAction: React.Dispatch<React.SetStateAction<TicketDialogState>>;
}

function useIsMobile(breakpoint = 380) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < breakpoint);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [breakpoint]);
  return isMobile;
}

const client = getClient();

export function TicketCard({ticketID, setDialogStateAction}: TicketProps) {
  const isMobile = useIsMobile();
  const [ticket, setTicket] = useState<Ticket>();
  const [ticketLabels, setTicketLabels] = useState<Label[]>([]);
  const [ticketStateColour, setTicketStateColour] = useState("#000");

  const fetchTicketData = useCallback(async () => {
    const data = await client.request<TicketsByIdsQuery>(TicketsByIdsDocument, {id: ticketID});
    const ticketData = data?.tickets?.[0];
    const labels = ticketData?.labels;
    if (ticketData) {
      setTicket(ticketData);
      setTicketLabels(labels ?? []);
      setTicketStateColour(getTicketStateColor(ticketData.state));
    }
  }, [ticketID]);

  useEffect(() => {
    void fetchTicketData();
  }, [fetchTicketData]);

  useEffect(() => {
    if (ticket?.state) {
      setTicketStateColour(getTicketStateColor(ticket.state));
    }
  }, [ticket?.state]);

  const copyTicketUrl = async () => {
    try {
      const url = `${window.location.origin}/tickets/${ticketID}`;
      await navigator.clipboard.writeText(url);
      toast.success("Link kopiert!");
    } catch {
      toast.error("Kopieren fehlgeschlagen");
    }
  };

  if (!ticket?.id) return null;


  return (
    <Card className="w-full p-3">
      <CardTitle className="flex flex-col ml-2 justify-between">
        <div className="flex justify-between items-center w-full">
          <Badge
            className={cn(
              "absolute left-11 md:relative md:left-0",
              ticket?.state === TicketState.New && "bg-ticketstate-new",
              ticket?.state === TicketState.Open && "bg-ticketstate-open",
              ticket?.state === TicketState.Closed && "bg-ticketstate-closed"
            )}
            style={{color: calculateFontColor(ticketStateColour)}}
          >
            {ticket?.state === TicketState.New
              ? "Neu"
              : ticket?.state === TicketState.Open
                ? "Offen"
                : "Fertig"}
          </Badge>
          <div className="flex-grow truncate pl-[60px] md:absolute md:pl-[70px] leading-normal"
               title={ticket?.title}>
            {ticket?.title}
          </div>
          <div className="flex flex-col items-end">
            <div className=" md:flex md:mr-1">
              <div className="flex md:max-w-[300px] overflow-x-auto whitespace-nowrap gap-1">
                {ticketLabels?.map((label) => (
                  label?.id &&
                  <Badge key={label.id} className="hidden md:flex md:mx-1  justify-center"
                         style={{
                           backgroundColor: label.color,
                           color: calculateFontColor(label.color)
                         }}>{label.name}</Badge>
                ))}
              </div>
              <div
                className="hidden mx-3 md:flex flex-col text-xs items-end justify-center text-muted-foreground">
                Geändert: {ticket?.lastModified ? format(new Date(ticket.lastModified), "dd.MM.yy") : ""}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="cursor-pointer flex items-center justify-center">
                    {isMobile ? (
                      <MoreHorizontal className="w-6 h-6"/>
                    ) : (
                      <MoreVertical className="w-6 h-6"/>
                    )}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      void copyTicketUrl();
                    }}
                  >
                    <Link/> Link kopieren
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      if (!ticket) return;
                      setDialogStateAction({mode: "delete", currentTicket: ticket});
                    }}
                    className="text-destructive"
                  >
                    <Trash2 className="text-destructive"/> Löschen
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardTitle>
    </Card>

  )
}