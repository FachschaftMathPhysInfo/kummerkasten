"use client"
import {ManagementPageHeader} from "@/components/management-page-header";
import {TicketIcon} from "lucide-react";
import {TicketCard} from "@/app/tickets/ticket-card";
import {getClient} from "@/lib/graph/client";
import {useCallback, useEffect, useState} from "react";
import {AllTicketsDocument, AllTicketsQuery, Ticket} from "@/lib/graph/generated/graphql";
import {Input} from "@/components/ui/input";
import Link from "next/link";

const client = getClient();

export default function TicketPage() {
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
                                <TicketCard ticketID={ticket.id}/>
                            </Link>
                        </div>
                    )
            )}
        </div>
    );
}
