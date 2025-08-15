"use client";

import {Ticket} from "@/lib/graph/generated/graphql";
import {PageLoader} from "@/components/page-loader";
import {SerializedEditorState} from "lexical";
import {useEffect, useState} from "react";

interface TicketDetailViewProps {
    ticket: Ticket | null;
    ticketId?: string;
}

export default function TicketDetailView({ticket}: TicketDetailViewProps) {
    const [editorState, setEditorState] = useState<SerializedEditorState | undefined>(undefined);

    useEffect(() => {
        if (ticket?.note) {
            try {
                setEditorState(JSON.parse(ticket.note));
            } catch (error) {
                console.error("Fehler beim Parsen von ticket.note:", error);
            }
        }
    }, [ticket]);

    if (!ticket) {
        return <PageLoader message="Bitte wählen Sie ein Ticket aus der Übersicht."/>
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
