"use client";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Edit2, Link, Trash2, X} from "lucide-react";
import {Label, Ticket} from "@/lib/graph/generated/graphql";
import React from "react";
import {TicketDialogState} from "@/app/tickets/page";
import {useRouter} from "next/navigation";
import {toast} from "sonner";

interface TicketStatusBarProps {
    ticket: Ticket | null;
    ticketLabels: Label[];
    setDialogState: React.Dispatch<React.SetStateAction<TicketDialogState>>;
}


export default function TicketStatusBar({ticket, ticketLabels, setDialogState}: TicketStatusBarProps) {
    const router = useRouter();

    const copyCurrentUrl = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            toast.success("Link kopiert!");
        } catch {
            toast.error("Kopieren fehlgeschlagen");
        }
    };


    if (!ticket) return <div/>;

    return (
        <div className="flex flex-col justify-between items-center h-full">
            <div className="flex items-stretch justify-center">
                <Button variant="ghost" onClick={copyCurrentUrl}><Link/></Button>
                <Button variant="ghost" onClick={() => setDialogState({
                    mode: "update",
                    currentTicket: ticket
                })}><Edit2/></Button>
                <Button variant="ghost" onClick={() => setDialogState({
                    mode: "delete",
                    currentTicket: ticket
                })}><Trash2/></Button>
                <Button variant="ghost" onClick={() => router.push("/tickets")}><X/></Button>
            </div>
            <div className="flex flex-col border-2 border-dotted rounded-2xl w-[70%] justify-center p-2">
                <div className="flex justify-between items-center">
                    <div className="text-sm ">Status:</div>
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
                    <Badge
                        key={label.id}
                        className="flex mb-3 w-full text-white justify-center"
                        style={{backgroundColor: label.color ?? "#000000"}}
                    >
                        {label.name}
                    </Badge>
                ))}
            </div>
        </div>
    );
}
