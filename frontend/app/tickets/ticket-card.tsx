"use client"

import React, {useCallback, useEffect, useState} from "react";
import {Card, CardContent, CardTitle} from "@/components/ui/card";
import {Label, Ticket, TicketByIdDocument, TicketByIdQuery} from "@/lib/graph/generated/graphql";
import {getClient} from "@/lib/graph/client";
import {SeperatorHorizontal} from "@/components/seperator-horizontal";
import {ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";
import {SeperatorVertical} from "@/components/seperator-vertical";
import {Link, NotepadText, Trash2} from "lucide-react";
import { Badge } from "@/components/ui/badge"


type TicketProps = {
    ticketID: string
}

export function TicketCard({ticketID}: TicketProps) {
    const client = getClient();
    const [isLoading, setIsLoading] = useState(true);
    const [ticket, setTicket] = useState<Ticket>();
    const [ticketLabels, setTicketLabels] = useState<Label[]>([]);

    const fetchTicketData = useCallback(async () => {
        const data = await client.request<TicketByIdQuery>(TicketByIdDocument, {id: ticketID});
        const ticketData = data?.tickets?.[0];
        const labels = ticketData?.labels;
        if (ticketData) {
            setIsLoading(false);
            setTicket(ticketData);
            setTicketLabels(labels??[]);
        }
    }, [ticketID]);

    useEffect(() => {
        void fetchTicketData();
    }, [fetchTicketData]);

    return (
        <Card className="m-7">
            <ResizablePanelGroup
                direction="horizontal"
                className="flex"
            >
                <ResizablePanel defaultSize={92}>
                    <CardTitle className="flex ml-6 items-start justify-between">
                        <div>
                            <div className="text-[0.75rem] text-orange-400">Betreff</div>
                            <div className="mt-3 font-bold text-md">{ticket?.title}</div>
                        </div>
                        <div className="flex mr-3">
                            {ticketLabels?.map((label) => (

                                label?.id && <Badge className="mx-1" style={{ backgroundColor: label.color }}>{label.name}</Badge>
                            ))}

                        </div>
                    </CardTitle>
                    <SeperatorHorizontal className="m-1 md:m-3 mr-1"/>
                    <CardContent className="flex">
                        <div>
                            <div className="text-[0.75rem] text-orange-400">Text</div>
                            <div className="mt-2 bold text-md">{ticket?.text}</div>
                        </div>
                    </CardContent>
                </ResizablePanel>
                <SeperatorVertical className="h-auto ml-2"/>
                <ResizablePanel defaultSize={5} className="mr-2">
                    <ResizablePanelGroup
                        direction="vertical"
                        className="flex md:items-center"
                    >
                        <ResizablePanel defaultSize={33}>
                            <Link className="w-4 h-4 md:w-7 h-7"/>
                        </ResizablePanel>
                        <ResizablePanel defaultSize={33}>
                            <NotepadText className="w-4 h-4 md:w-7 h-7"/>
                        </ResizablePanel>
                        <ResizablePanel defaultSize={33}>
                            <Trash2 className="w-4 h-4 md:w-7 h-7"/>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
            </ResizablePanelGroup>
        </Card>
    )
}