"use client"

import React, {useCallback, useEffect, useState} from "react";
import {Card, CardTitle} from "@/components/ui/card";
import {Label, Ticket, TicketByIdDocument, TicketByIdQuery} from "@/lib/graph/generated/graphql";
import {Link, MoreHorizontal, MoreVertical, Trash2} from "lucide-react";
import {Badge} from "@/components/ui/badge"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";
import {getClient} from "@/lib/graph/client";
import {TicketDialogState} from "@/app/tickets/page";
import {toast} from "sonner";


type TicketProps = {
    ticketID: string
    setDialogState: React.Dispatch<React.SetStateAction<TicketDialogState>>;
}

function useIsMobile(breakpoint = 380) {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const update = () => setIsMobile(window.innerWidth < breakpoint);
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [breakpoint]);
    return isMobile;
}

const client = getClient();

export function TicketCard({ticketID, setDialogState}: TicketProps) {
    const isMobile = useIsMobile();
    const [ticket, setTicket] = useState<Ticket>();
    const [ticketLabels, setTicketLabels] = useState<Label[]>([]);

    const fetchTicketData = useCallback(async () => {
        const data = await client.request<TicketByIdQuery>(TicketByIdDocument, {id: ticketID});
        const ticketData = data?.tickets?.[0];
        const labels = ticketData?.labels;
        if (ticketData) {
            setTicket(ticketData);
            setTicketLabels(labels ?? []);
        }
    }, [ticketID]);

    useEffect(() => {
        void fetchTicketData();
    }, [fetchTicketData]);


    const copyTicketUrl = async () => {
        try {
            const url = `${window.location.origin}/tickets/${ticketID}`;
            await navigator.clipboard.writeText(url);
            toast.success("Link kopiert!");
        } catch {
            toast.error("Kopieren fehlgeschlagen");
        }
    };


    return (
        <Card className="w-full p-3">
            <CardTitle className="flex flex-col ml-2 justify-between">
                <div className="flex justify-between items-center w-full">
                    <Badge
                        className="text-white"
                        style={{
                            backgroundColor:
                                ticket?.state === "NEW"
                                    ? "#839176"
                                    : ticket?.state === "OPEN"
                                        ? "#192B51"
                                        : ticket?.state === "CLOSED"
                                            ? "#DF517F"
                                            : "white"
                        }}
                    >
                        {ticket?.state === "NEW"
                            ? "new"
                            : ticket?.state === "OPEN"
                                ? "open"
                                : "fin"}
                    </Badge>
                    <div className="flex text-md absolute ml-[60px] truncate max-w-[20%] md:max-w-[20%]" title={ticket?.title}>
                        {ticket?.title}
                    </div>
                    <div className="flex flex-col items-end">
                        <div className=" md:flex md:mr-1">
                            <div className="flex md:max-w-[300px] overflow-x-auto whitespace-nowrap gap-1">
                                {ticketLabels?.map((label) => (
                                    label?.id &&
                                    <Badge key={label.id} className="hidden md:flex md:mx-1  justify-center text-white"
                                           style={{backgroundColor: label.color ?? "#000000"}}>{label.name}</Badge>
                                ))}
                            </div>
                            <div
                                className="hidden mx-3 md:flex flex-col text-xs items-end justify-center text-muted-foreground">
                                Geändert: {new Date(ticket?.lastModified || '').toLocaleDateString()}
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className="cursor-pointer flex items-center justify-center">
                                        {isMobile ? (
                                            <MoreHorizontal className="w-6 h-6"/>
                                        ) : (
                                            <MoreVertical className="w-6 h-6"/>
                                        )}
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent side="bottom" align="end">
                                    <DropdownMenuItem
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            copyTicketUrl();
                                        }}
                                    >
                                        <Link/> Link kopieren
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            if (!ticket) return;
                                            setDialogState({mode: "delete", currentTicket: ticket});
                                        }}
                                        className="text-destructive"
                                    >
                                        <Trash2 className="text-destructive"/> Löschen
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                    </div>
                </div>
            </CardTitle>
        </Card>

    )
}