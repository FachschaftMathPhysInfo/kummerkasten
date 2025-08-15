"use client"
import {ManagementPageHeader} from "@/components/management-page-header";
import {TicketIcon} from "lucide-react";
import {TicketCard} from "@/app/tickets/ticket-card";
import {getClient} from "@/lib/graph/client";
import React, {useCallback, useEffect, useState} from "react";
import {
    AllTicketsDocument,
    AllTicketsQuery,
    DeleteTicketDocument,
    DeleteTicketMutation,
    Ticket
} from "@/lib/graph/generated/graphql";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import {toast} from "sonner";
import ConfirmationDialog from "@/components/dialogs/confirmation-dialog";
import TicketDialog from "@/app/tickets/[ticketId]/ticket-dialog";

const client = getClient();

export type TicketDialogState = {
    mode: "update" | "delete" | null;
    currentTicket: Ticket | null
}


export default function TicketPage() {
    const [tickets, setTickets] = useState<(Ticket | null)[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [dialogState, setDialogState] = useState<TicketDialogState>({mode: null, currentTicket: null});

    const resetDialogState = ()=>{
        setDialogState({mode: null, currentTicket: null})
    }

    const fetchTickets = useCallback(async () => {
        const data = await client.request<AllTicketsQuery>(AllTicketsDocument);
        if (data.tickets) {
            setTickets(data.tickets);
        }
    }, []);

    useEffect(() => {
        void fetchTickets();
    }, [fetchTickets]);

    const filteredTickets = tickets.filter(ticket =>
        ticket?.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    async function handleDelete() {
        if (!dialogState.currentTicket) {
            toast.error("Ein Fehler beim Löschen des Tickets ist aufgetreten")
            return
        }

        try {
            await client.request<DeleteTicketMutation>(DeleteTicketDocument, {ids: [dialogState.currentTicket.id]})
            toast.success("Ticket wurde erfolgreich gelöscht")
            setTickets((prev) =>
                prev.filter((t) => t?.id !== dialogState.currentTicket?.id)
            );
            resetDialogState()
        } catch {
            toast.error("Ein Fehler beim Löschen des Tickets ist aufgetreten")
        }
    }

    return (
        <div className="space-y-6 grow max-w-screen">
            <ManagementPageHeader title="Tickets" description="Bearbeite alle verfügbaren Tickets"
                                  icon={<TicketIcon/>}/>
            <div className="px-8">
                <Input
                    placeholder="Suche nach Titel..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            {filteredTickets.map((ticket) =>
                    ticket?.id && (
                        <div key={ticket.id} className="mx-8 my-4">
                            <Link href={`/tickets/${ticket.id}`} passHref>
                                <TicketCard ticketID={ticket.id} setDialogState={setDialogState}/>
                            </Link>
                        </div>
                    )
            )}
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
