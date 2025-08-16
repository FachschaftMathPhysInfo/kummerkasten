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
        <div className="flex flex-col justify-between items-center h-full w-full">
            <div className="flex flex-wrap justify-center gap-0 max-w-fit">
                <Button variant="ghost" onClick={copyCurrentUrl} data-cy="copy-link-statusbar"><Link/></Button>
                <Button variant="ghost" onClick={() => setDialogState({
                    mode: "update",
                    currentTicket: ticket
                })} data-cy="edit-ticket"><Edit2/></Button>
                <Button variant="ghost" onClick={() => setDialogState({
                    mode: "delete",
                    currentTicket: ticket
                })} data-cy="delete-ticket-statusbar"><Trash2/></Button>
                <Button variant="ghost" onClick={() => router.push("/tickets")} data-cy="exit-ticket"><X/></Button>
            </div>
            <div className="flex flex-col border-2 border-dotted rounded-2xl md:w-[70%] justify-center p-2 mb-2 gap-1">
                <div className="flex md:flex-col justify-between items-center gap-2 md:gap-1">
                    <div className="text-sm ">Status:</div>
                    <Badge
                        className="text-white rounded"
                        style={{
                            backgroundColor:
                                ticket.state === "NEW" ? "#839176" :
                                    ticket.state === "OPEN" ? "#192B51" :
                                        ticket.state === "CLOSED" ? "#DF517F" : "gray"
                        }}
                        data-cy="ticket-status-badge-detail"
                    >
                        {ticket.state.toLowerCase()}
                    </Badge>
                </div>
                <div className="flex flex-col text-sm justify-between items-center">
                    <div>Erstellt:</div>
                    <div>{new Date(ticket.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="flex flex-col text-sm justify-between items-center">
                    <div>Geändert:</div>
                    <div>{new Date(ticket.lastModified).toLocaleDateString()}</div>
                </div>
            </div>
            <div className="flex md:flex-col flex-row gap-2 overflow-x-auto max-w-full py-2 items-center overflow-y-auto max-h-[100px] mb-3">
                {ticketLabels?.map((label) => (
                    label?.id &&
                    <Badge
                        key={label.id}
                        className="flex-shrink-0 text-white justify-center px-3 py-1 md:w-full"
                        style={{backgroundColor: label.color ?? "#000000"}}
                        data-cy={`ticket-label-${label.id}`}
                    >
                        {label.name}
                    </Badge>
                ))}
            </div>
        </div>
    );
}
