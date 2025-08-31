"use client";

import {Label, Ticket} from "@/lib/graph/generated/graphql";
import {PageLoader} from "@/components/page-loader";
import {useSidebar} from "@/components/ui/sidebar";
import React, {Dispatch} from "react";
import {TicketDialogState} from "@/app/tickets/page";
import TicketStatusPane from "@/app/tickets/[ticketId]/ticket-status-pane";

interface TicketDetailViewProps {
  ticket: Ticket | null;
  ticketLabels: Label[];
  setDialogStateAction: Dispatch<React.SetStateAction<TicketDialogState>>;
}

export default function TicketDetailView({ticket, ticketLabels, setDialogStateAction}: TicketDetailViewProps) {
  const { isMobile } = useSidebar()

  if (!ticket) {
    return (
      <div className="flex flex-grow items-center justify-end">
        <PageLoader message="Bitte wählen Sie ein Ticket aus der Übersicht." loading={false}/>
      </div>
    )
  }

  return (
      <div className="flex flex-col mx-6 grow p-2 pb-4 overflow-y-scroll">
        <span className={'w-full justify-between flex items-center gap-2 mb-4'}>
          <h1
            className="text-2xl font-semibold max-w-[300px] md:max-w-[900px] text-wrap whitespace-nowrap"
            title={"Original Titel: " + ticket.originalTitle}>
            {ticket.title}
          </h1>
          {isMobile && (
            <TicketStatusPane ticket={ticket} initialTicketLabels={ticketLabels} setDialogStateAction={setDialogStateAction} />
          )}
        </span>
        <div className="flex flex-col grow">
          {ticket.text}
        </div>
      </div>
  );
}
