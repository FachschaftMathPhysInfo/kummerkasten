"use client";

import React, {useCallback, useEffect, useState} from "react";
import {useParams} from "next/navigation";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";
import {getClient} from "@/lib/graph/client";
import {
  DeleteTicketDocument,
  DeleteTicketMutation,
  Label,
  Ticket,
  TicketsByIdsDocument,
  TicketsByIdsQuery
} from "@/lib/graph/generated/graphql";
import TicketSidebar from "@/app/tickets/[ticketId]/ticket-sidebar";
import TicketDetailView from "@/app/tickets/[ticketId]/ticket-detail-view";
import {TicketInfoPane} from "@/app/tickets/[ticketId]/ticket-info-pane";
import {TicketDialogState} from "@/app/tickets/page";
import TicketDialog from "@/app/tickets/[ticketId]/ticket-dialog";
import ConfirmationDialog from "@/components/dialogs/confirmation-dialog";
import {toast} from "sonner";
import {useSidebar} from "@/components/ui/sidebar";
import {useTickets} from "@/components/providers/ticket-provider";

const client = getClient();

export default function TicketPage() {
  const {ticketId} = useParams();
  const {triggerTicketRefetch} = useTickets()
  const [searchTerm, setSearchTerm] = useState("");
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [ticketLabels, setTicketLabels] = useState<Label[]>([]);
  const {isMobile} = useSidebar()

  const [dialogState, setDialogState] = useState<TicketDialogState>({
    mode: null,
    currentTicket: null
  });

  const fetchTicketDetail = useCallback(async () => {
    if (!ticketId) return;
    const data = await client.request<TicketsByIdsQuery>(TicketsByIdsDocument, {id: ticketId});
    const ticketData = data?.tickets?.[0];
    setTicket(ticketData ?? null);
    setTicketLabels(ticketData?.labels ?? []);
  }, [ticketId]);

  const resetDialogState = () => {
    setDialogState({mode: null, currentTicket: null})
  }

  async function handleDelete() {
    if (!dialogState.currentTicket) {
      toast.error("Ein Fehler beim Löschen des Tickets ist aufgetreten")
      return
    }

    try {
      await client.request<DeleteTicketMutation>(DeleteTicketDocument, {ids: [dialogState.currentTicket.id]})
      toast.success("Ticket wurde erfolgreich gelöscht")
      resetDialogState()
      triggerTicketRefetch()
      await fetchTicketDetail();
    } catch {
      toast.error("Ein Fehler beim Löschen des Tickets ist aufgetreten")
    }
  }


  useEffect(() => {
    void fetchTicketDetail();
  }, [fetchTicketDetail, ticketId]);

  return (
    <div className="w-full h-full flex flex-col pt-5 grow">
      <ResizablePanelGroup direction="horizontal" className="flex md:flex-grow">
        <ResizablePanel
          defaultSize={30}
          minSize={20}
          maxSize={30}
          className="flex-col hidden md:flex"
        >
          <TicketSidebar
            searchTerm={searchTerm}
            setSearchTermAction={setSearchTerm}
            selectedTicketId={String(ticketId)}
          />
        </ResizablePanel>
        <ResizableHandle/>
        <ResizablePanel defaultSize={50} className="flex justfiy-between">
          <TicketDetailView
            ticket={ticket}
            ticketLabels={ticketLabels}
            setDialogStateAction={setDialogState}
            refreshTicketAction={fetchTicketDetail}
          />
          {!isMobile && (
            <TicketInfoPane ticket={ticket} initialTicketLabels={ticketLabels} setDialogStateAction={setDialogState}/>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>

      <TicketDialog
        open={dialogState.mode === "update"}
        ticket={dialogState.currentTicket}
        closeDialog={() => setDialogState({mode: null, currentTicket: null})}
        refreshData={async () => {
          triggerTicketRefetch()
          await fetchTicketDetail();
        }}
      />
      <ConfirmationDialog
        mode="confirmation"
        description={`Dies wird das Ticket ${dialogState.currentTicket?.title} unwiderruflich löschen`}
        onConfirm={handleDelete}
        isOpen={dialogState.mode === "delete"}
        closeDialog={resetDialogState}
      />
    </div>
  );
}
