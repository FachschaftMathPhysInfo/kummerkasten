"use client"
import {ManagementPageHeader} from "@/components/management-page-header";
import {TicketIcon} from "lucide-react";
import {TicketCard} from "@/app/tickets/ticket-card";
import {getClient} from "@/lib/graph/client";
import {useCallback, useEffect, useState} from "react";
import {AllTicketsDocument, AllTicketsQuery, Ticket} from "@/lib/graph/generated/graphql";
import {Input} from "@/components/ui/input";

export default function TicketPage() {
    const client = getClient();
    const [tickets, setTickets] = useState<(Ticket | null)[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

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

    return (
        <div className="space-y-6 grow">
            <ManagementPageHeader title="Tickets" description="Bearbeite alle verfügbaren Tickets"
                                  icon={<TicketIcon/>}/>
            <div className="px-8">
                <Input
                    placeholder="Suche nach Titel..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            {filteredTickets.map((ticket) => (
                ticket?.id && <TicketCard ticketID={ticket.id}/>
            ))}
        </div>
    );
}
