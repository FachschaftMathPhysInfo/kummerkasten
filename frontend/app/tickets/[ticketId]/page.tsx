"use client";

import React, {useCallback, useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";
import {Input} from "@/components/ui/input";
import {Badge} from "@/components/ui/badge";
import {getClient} from "@/lib/graph/client";
import {
    AllTicketsDocument,
    AllTicketsQuery,
    Ticket,
    TicketByIdDocument,
    TicketByIdQuery
} from "@/lib/graph/generated/graphql";
import {Card, CardContent} from "@/components/ui/card";

type Props = {
    params: {
        ticketId: string
    }
}

const client = getClient();

export default function TicketDetailView() {
    const params = useParams();

    const router = useRouter();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [ticket, setTicket] = useState<Ticket | null>(null);
    const ticketId = params.ticketId;

    const fetchTickets = useCallback(async () => {
        const data = await client.request<AllTicketsQuery>(AllTicketsDocument);
        if (data.tickets) setTickets(data.tickets.filter(t => t !== null) as Ticket[]);
    }, [client]);

    const fetchTicketDetail = useCallback(async () => {
        const data = await client.request<TicketByIdQuery>(TicketByIdDocument, {id: ticketId});
        if (data.tickets?.[0]) setTicket(data.tickets[0]);
    }, [client, ticketId]);

    useEffect(() => {
        void fetchTickets();
    }, [fetchTickets]);

    useEffect(() => {
        setTicket(null);
        void fetchTicketDetail();
    }, [fetchTicketDetail, ticketId]);


    const filteredTickets = tickets.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="w-full h-full flex flex-col pt-2 grow">
            <ResizablePanelGroup direction="horizontal" className="flex flex-grow">
                <ResizablePanel defaultSize={30}
                                className="border-r border-gray-500 flex flex-col">
                    <div className="px-4">
                        <Input
                            placeholder="Suche nach Tickets..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="mb-4"
                        />
                        <div className="flex-row">
                            {filteredTickets.map(t => (
                                <div
                                    key={t.id}
                                    className={`p-2 cursor-pointer rounded ${t.id === ticketId ? "bg-background" : "hover:bg-accent"}`}
                                    onClick={() => router.push(`/tickets/${t.id}`)}
                                >
                                    <Badge
                                        className="text-white px-2 py-1 rounded mr-2"
                                        style={{
                                            backgroundColor:
                                                t.state === "NEW" ? "#839176" :
                                                    t.state === "OPEN" ? "#192B51" :
                                                        t.state === "CLOSED" ? "#DF517F" : "gray"
                                        }}
                                    >
                                        {t.state.toLowerCase()}
                                    </Badge>
                                    {t.title}
                                </div>
                            ))}
                        </div>
                    </div>
                </ResizablePanel>
                <ResizableHandle/>
                <ResizablePanel defaultSize={50}
                                className="border-r border-gray-500 flex flex-col">
                    {ticketId ? (
                        ticket ? (
                            <div className="flex mx-3">
                                <div className="flex flex-col">
                                    <h1 className="text-2xl font-semibold mb-4">{ticket.title}</h1>
                                    <div>{ticket.text}</div>
                                </div>
                            </div>
                        ) : (
                            "Loading Ticket..."
                            // exchange with pageloader later on
                        )
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            Bitte wählen Sie ein Ticket aus der Übersicht.
                        </div>
                    )}
                </ResizablePanel>
                <ResizablePanel defaultSize={15}>
                    {ticket ? (
                        <div className="flex justify-center">
                            <Card className="flex w-[80%] border-dotted border-2 px-0">
                                <CardContent className="flex flex-col text-sm">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            Status:
                                        </div>
                                        <Badge
                                            className="text-white rounded"
                                            style={{
                                                backgroundColor:
                                                    ticket.state === "NEW" ? "#839176" :
                                                        ticket.state === "OPEN" ? "#192B51" :
                                                            ticket.state === "CLOSED" ? "#DF517F" : "gray"
                                            }}
                                        >
                                            {ticket.state.toLowerCase()}
                                        </Badge>
                                    </div>
                                    <div className="flex text-sm justify-between items-center">
                                        <div>Erstellt:</div>
                                        <div>{new Date(ticket.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    <div className="flex text-sm justify-between items-center">
                                        <div>Geändert:</div>
                                        <div>{new Date(ticket.lastModified).toLocaleDateString()}</div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>) : (
                        <p>Lade Daten ...</p>
                    )}
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
        ;
}
