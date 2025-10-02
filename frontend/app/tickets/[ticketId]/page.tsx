"use client";

import React, {useCallback, useEffect, useState} from "react";
import {useParams} from "next/navigation";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";
import {getClient} from "@/lib/graph/client";
import {Label, Ticket, TicketsByIdsDocument, TicketsByIdsQuery} from "@/lib/graph/generated/graphql";
import TicketSidebar from "@/app/tickets/[ticketId]/ticket-sidebar";
import TicketDetailView from "@/app/tickets/[ticketId]/ticket-detail-view";
import {TicketDialogState} from "@/app/tickets/page";
import TicketDialog from "@/app/tickets/[ticketId]/ticket-dialog";
import ConfirmationDialog from "@/components/dialogs/confirmation-dialog";
import {toast} from "sonner";
import {useTickets} from "@/components/providers/ticket-provider";
import {useSidebar} from "@/components/ui/sidebar";
import {cn} from "@/lib/utils";

const client = getClient();

export default function TicketPage() {
  const {ticketId} = useParams();
  const {deleteTickets} = useTickets()
  const {isMobile} = useSidebar()
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [ticketLabels, setTicketLabels] = useState<Label[]>([]);
  const {state} = useSidebar()

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

    const error = await deleteTickets([dialogState.currentTicket.id])

    if (!error) {
      toast.success("Ticket wurde erfolgreich gelöscht")
      resetDialogState()
      await fetchTicketDetail();
    } else {
      toast.error("Ein Fehler beim Löschen des Tickets ist aufgetreten")
    }
  }

  useEffect(() => {
    void fetchTicketDetail();
  }, [fetchTicketDetail, ticketId]);

  return (
    <div
      className={cn(
        "flex flex-col py-5 grow",
        isMobile ? "max-w-screen" : (state === "expanded" ? "max-w-[calc(100vw-10rem)]" : "max-w-[calc(100vw-3rem)]")
      )}
    >
      <ResizablePanelGroup direction="horizontal" className="flex md:flex-grow">
        <ResizablePanel
          defaultSize={30}
          minSize={20}
          maxSize={30}
          className="flex-col hidden md:flex"
        >
          <TicketSidebar
            selectedTicketId={String(ticketId)}
          />
        </ResizablePanel>
        <ResizableHandle/>
        <ResizablePanel defaultSize={50}>
          <TicketDetailView
            ticket={ticket}
            ticketLabels={ticketLabels}
            setDialogStateAction={setDialogState}
          />
        </ResizablePanel>
      </ResizablePanelGroup>

      <TicketDialog
        open={dialogState.mode === "update"}
        ticket={dialogState.currentTicket}
        closeDialog={() => setDialogState({mode: null, currentTicket: null})}
        refreshData={async () => await fetchTicketDetail()}
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
