"use client"

import React, {useCallback, useEffect, useState} from "react";
import {Card, CardContent, CardTitle} from "@/components/ui/card";
import {Label, Ticket, TicketByIdDocument, TicketByIdQuery} from "@/lib/graph/generated/graphql";
import {getClient} from "@/lib/graph/client";
import {SeperatorHorizontal} from "@/components/seperator-horizontal";
import {ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";
import {SeperatorVertical} from "@/components/seperator-vertical";
import {Link, MoreHorizontal, MoreVertical, NotepadText, Trash2} from "lucide-react";
import {Badge} from "@/components/ui/badge"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";


type TicketProps = {
    ticketID: string
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

export function TicketCard({ticketID}: TicketProps) {
    const isMobile = useIsMobile();
    const client = getClient();
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
    }, [ticketID, client]);

    useEffect(() => {
        void fetchTicketData();
    }, [fetchTicketData]);

    return (
        <Card className="w-full">
            <ResizablePanelGroup
                direction="horizontal"
            >
                <ResizablePanel defaultSize={80}>
                    <CardTitle className="flex ml-6 justify-between">
                        <div>
                            <div className="flex font-bold text-md">{ticket?.title}</div>
                        </div>
                        <div className="hidden md:flex md:mr-1">
                            {ticketLabels?.map((label) => (
                                label?.id && <Badge key={label.id} className="md:mx-1"
                                                    style={{backgroundColor: label.color ?? "#000000"}}>{label.name}</Badge>
                            ))}
                        </div>
                    </CardTitle>
                    <SeperatorHorizontal className="hidden md:flex m-1 md:m-3 mr-0"/>
                    <CardContent className="flex">
                        <div>
                            <div className="mt-2 bold text-md">{ticket?.text}</div>
                        </div>
                    </CardContent>
                </ResizablePanel>
                <SeperatorVertical className="hidden md:flex h-auto"/>
                <ResizablePanel defaultSize={4} className="mr-3 md:mr-0">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="cursor-pointer flex justify-center">
                                {isMobile ? (
                                    <MoreHorizontal className="w-6 h-6"/>
                                ) : (
                                    <MoreVertical className="w-6 h-6"/>
                                )}
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="bottom" align="end">
                            <DropdownMenuItem onClick={() => console.log("Edit", ticketID)}>
                                <NotepadText/> Bearbeiten
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => console.log("Link", ticketID)}>
                                <Link/> Link kopieren
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => console.log("Delete", ticketID)}
                                className="text-destructive"
                            >
                                <Trash2 className="text-destructive"/> Löschen
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </ResizablePanel>
            </ResizablePanelGroup>
        </Card>
    )
}