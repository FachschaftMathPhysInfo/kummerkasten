"use client"

import React, {useEffect, useState} from "react";
import {Card, CardTitle} from "@/components/ui/card";
import {Label, Ticket, TicketState, UserRole} from "@/lib/graph/generated/graphql";
import {Link, MoreHorizontal, MoreVertical, Trash2} from "lucide-react";
import {Badge} from "@/components/ui/badge"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";
import {TicketDialogState} from "@/app/tickets/page";
import {toast} from "sonner";
import {format} from "date-fns";
import {calculateFontColor} from "@/lib/calculate-colors";
import {cn} from "@/lib/utils";
import {useUser} from "@/components/providers/user-provider";
import {getTicketStateColor} from "@/lib/ticket-operations";
import LabelBadge from "@/components/label-badge";
import {useSidebar} from "@/components/ui/sidebar";
import {useTickets} from "@/components/providers/ticket-provider";


type TicketCardProps = {
  ticketID: string
  setDialogStateAction: React.Dispatch<React.SetStateAction<TicketDialogState>>;
}


export function TicketCard({ticketID, setDialogStateAction}: TicketCardProps) {
  const {isMobile} = useSidebar()
  const {user} = useUser();
  const {tickets} = useTickets();
  const [ticket, setTicket] = useState<Ticket>();
  const [ticketLabels, setTicketLabels] = useState<Label[]>([]);


  useEffect(() => {
    const currentTicket = tickets.find(t => t.id === ticketID);
    setTicket(currentTicket);
    setTicketLabels(currentTicket?.labels ?? [])
  }, [ticketID, tickets]);

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
      <CardTitle className="flex items-center justify-between gap-12 max-w-full">
        <div className={'flex items-center gap-4'}>
          <Badge
            className={cn(
              "min-w-[50px]",
              ticket.state === TicketState.New && "bg-ticketstate-new",
              ticket.state === TicketState.Open && "bg-ticketstate-open",
              ticket.state === TicketState.Closed && "bg-ticketstate-closed"
            )}
            style={{color: calculateFontColor(getTicketStateColor(ticket.state))}}
          >
            {ticket.state === TicketState.New
              ? "Neu"
              : ticket.state === TicketState.Open
                ? "Offen"
                : "Fertig"}
          </Badge>
          <p className="leading-normal" title={ticket.title}>
            {ticket.title}
          </p>
        </div>

        <div className="flex items-center min-w-[20px] gap-4 grow justify-end">
          {!isMobile && (
            <>
              <div className="flex overflow-x-auto gap-1">
                {ticketLabels.length <= 2 ? (
                  ticketLabels?.map((label) => (
                    label?.id && <LabelBadge key={label.id} label={label}/>
                  ))
                ) : (
                  <div className={'flex gap-1 items-center'}>
                    <LabelBadge label={ticketLabels[0]}/>
                    <LabelBadge label={ticketLabels[1]}/>
                    <p
                      className={'text-muted-foreground text-xs px-2 py-1 border border-muted-foreground rounded-md'}
                    >
                      + {ticketLabels.length - 2}
                    </p>
                  </div>
                )}
              </div>
              <div
                className="hidden shrink-0 md:flex flex-col text-xs items-center justify-center text-muted-foreground">
                Geändert: {format(new Date(ticket.lastModified), "dd.MM.yy")}
              </div>
            </>
          )}

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
              {user?.role === UserRole.Admin && (
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
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardTitle>
    </Card>

  )
}