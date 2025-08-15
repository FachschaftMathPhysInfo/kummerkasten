"use client";

import {Ticket} from "@/lib/graph/generated/graphql";
import {PageLoader} from "@/components/page-loader";

interface TicketDetailViewProps {
    ticket: Ticket | null;
    ticketId?: string;
}

export default function TicketDetailView({ticket}: TicketDetailViewProps) {
    if (!ticket) {
        return <PageLoader message="Bitte wählen Sie ein Ticket aus der Übersicht."/>
    }

    return (
        <div className="flex mx-6">
            <div className="flex flex-col">
                <h1 className="text-2xl font-semibold mb-4">{ticket.title}</h1>
                <div className="flex flex-col grow">
                    <div className="flex">{ticket.text}</div>
                </div>
            </div>
        </div>
    );
}
