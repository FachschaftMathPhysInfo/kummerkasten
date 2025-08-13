"use client";

import React, {useCallback, useEffect, useState} from "react";
import {useParams} from "next/navigation";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";
import {getClient} from "@/lib/graph/client";
import {AllTicketsDocument, AllTicketsQuery, Label, Ticket, TicketByIdDocument, TicketByIdQuery} from "@/lib/graph/generated/graphql";
import TicketSidebar from "@/app/tickets/[ticketId]/ticket-sidebar";
import TicketDetailView from "@/app/tickets/[ticketId]/ticket-detail-view";
import TicketStatusBar from "@/app/tickets/[ticketId]/ticket-status-bar";

const client = getClient();

export default function TicketPage() {
    const params = useParams();
    const ticketId = params.ticketId as string;

    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [ticketLabels, setTicketLabels] = useState<Label[]>([]);

    const fetchTickets = useCallback(async () => {
        const data = await client.request<AllTicketsQuery>(AllTicketsDocument);
        if (data.tickets) setTickets(data.tickets.filter(Boolean) as Ticket[]);
    }, []);

    const fetchTicketDetail = useCallback(async () => {
        if (!ticketId) return;
        const data = await client.request<TicketByIdQuery>(TicketByIdDocument, {id: ticketId});
        const ticketData = data?.tickets?.[0];
        setTicket(ticketData ?? null);
        setTicketLabels(ticketData?.labels ?? []);
    }, [ticketId]);

    useEffect(() => { void fetchTickets(); }, [fetchTickets]);
    useEffect(() => { void fetchTicketDetail(); }, [fetchTicketDetail, ticketId]);

    return (
        <div className="w-full h-full flex flex-col pt-2 grow">
            <ResizablePanelGroup direction="horizontal" className="flex flex-grow">
                <ResizablePanel defaultSize={30} minSize={20} maxSize={30} className="border-r border-gray-500 flex flex-col">
                    <TicketSidebar
                        tickets={tickets}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        selectedTicketId={ticketId}
                    />
                </ResizablePanel>
                <ResizableHandle/>
                <ResizablePanel defaultSize={50} className="border-r border-gray-500 flex flex-col">
                    <TicketDetailView ticket={ticket} ticketId={ticketId}/>
                </ResizablePanel>
                <ResizablePanel defaultSize={13}>
                    <TicketStatusBar ticket={ticket} ticketLabels={ticketLabels}/>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
