"use client";

import {Ticket} from "@/lib/graph/generated/graphql";
import {PageLoader} from "@/components/page-loader";

interface TicketDetailViewProps {
    ticket: Ticket | null;
}

export default function TicketDetailView({ticket}: TicketDetailViewProps) {
    if (!ticket) {
        return (
            <div className="flex flex-grow items-center justify-end">
                <PageLoader message="Bitte wählen Sie ein Ticket aus der Übersicht." loading={false}/>
            </div>
        )
    }

    return (
        <div className="flex mx-6">
            <div className="flex flex-col">
                <h1 className="text-2xl font-semibold mb-4 max-w-[300px] md:max-w-[900px] overflow-x-auto whitespace-nowrap"
                    title={"Original Titel: " + ticket.originalTitle}>{ticket.title}</h1>
                <div className="flex flex-col grow">
                    <div className="flex">{ticket.text}</div>
                </div>
            </div>
        </div>
    );
}
