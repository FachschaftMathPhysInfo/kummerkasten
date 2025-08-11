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
    Label,
    Ticket,
    TicketByIdDocument,
    TicketByIdQuery
} from "@/lib/graph/generated/graphql";
import {Link, NotepadText, Trash2, X} from "lucide-react";
import {Button} from "@/components/ui/button";


const client = getClient();

export default function TicketDetailView() {
    const params = useParams();

    const router = useRouter();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [ticket, setTicket] = useState<Ticket | null>(null);
    const ticketId = params.ticketId;
    const [ticketLabels, setTicketLabels] = useState<Label[]>([]);

    const fetchTickets = useCallback(async () => {
        const data = await client.request<AllTicketsQuery>(AllTicketsDocument);
        if (data.tickets) setTickets(data.tickets.filter(t => t !== null) as Ticket[]);
    }, []);

    const fetchTicketDetail = useCallback(async () => {
        const data = await client.request<TicketByIdQuery>(TicketByIdDocument, {id: ticketId});
        const ticketData = data?.tickets?.[0];
        const labels = ticketData?.labels;
        if (ticketData) {
            setTicket(ticketData);
            setTicketLabels(labels ?? []);
        }
    }, [ticketId]);

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
                <ResizablePanel defaultSize={30} minSize={20} maxSize={30}
                                className="border-r border-gray-500 flex flex-col">
                    <div className="px-4">
                        <Input
                            placeholder="Suche nach Tickets..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="mb-4"
                        />
                        <div className="">
                            {filteredTickets.map(t => (
                                <div
                                    key={t.id}
                                    className={`p-2 cursor-pointer rounded ${t.id === ticketId ? "bg-accent" : "hover:bg-accent"}`}
                                    onClick={() => router.push(`/tickets/${t.id}`)}
                                >
                                    <Badge
                                        className="text-white px-2 py-1 rounded mr-5"
                                        style={{
                                            backgroundColor:
                                                t.state === "NEW" ? "#839176" :
                                                    t.state === "OPEN" ? "#192B51" :
                                                        t.state === "CLOSED" ? "#DF517F" : "gray"
                                        }}
                                    >
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
                            <div className="flex mx-6">
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
                <ResizablePanel defaultSize={13}>
                    {ticket ? (
                        <div className="flex flex-col justify-between items-center h-full">
                            <div className="flex items-stretch justify-center">
                                <Button variant="ghost">
                                    <Link/>
                                </Button>
                                <Button variant="ghost">
                                    <NotepadText/>
                                </Button>
                                <Button variant="ghost">
                                    <Trash2/>
                                </Button>
                                <Button variant="ghost">
                                    <X/>
                                </Button>
                            </div>
                            <div
                                className="flex flex-col border-2 border-dotted rounded-2xl w-[70%] justify-center p-2">
                                <div className="flex justify-between items-center">
                                    <div className="text-sm ">
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
                            </div>
                            <div className="flex flex-col">
                                {ticketLabels?.map((label) => (
                                    label?.id &&
                                    <Badge key={label.id}
                                           className="hidden md:flex mb-3 w-full text-white justify-between"
                                           style={{backgroundColor: label.color ?? "#000000"}}>{label.name}
                                        <button
                                            type="button"
                                            className="p-0 m-0 hover:opacity-75"
                                        >
                                            <X className="h-3 w-3"/>
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </div>) : (
                        <p>Lade Daten ...</p>
                    )}
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
        ;
}
