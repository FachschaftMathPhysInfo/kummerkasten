"use client";

import {Ticket} from "@/lib/graph/generated/graphql";

interface TicketDetailViewProps {
    ticket: Ticket | null;
    ticketId?: string;
}

export default function TicketDetailView({ticket, ticketId}: TicketDetailViewProps) {
    if (!ticketId) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                Bitte wählen Sie ein Ticket aus der Übersicht.
            </div>
        );
    }

    if (!ticket) {
        return <>Loading Ticket...</>;
    }

    return (
        <div className="flex mx-6">
            <div className="flex flex-col">
                <h1 className="text-2xl font-semibold mb-4">{ticket.title}</h1>
                <div>{ticket.text}</div>
            </div>
        </div>
    );
}
