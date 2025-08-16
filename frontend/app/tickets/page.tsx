"use client"
import {ManagementPageHeader} from "@/components/management-page-header";
import {Check, TicketIcon} from "lucide-react";
import {TicketCard} from "@/app/tickets/ticket-card";
import {getClient} from "@/lib/graph/client";
import React, {useCallback, useEffect, useState} from "react";
import {
    AllTicketsDocument,
    AllTicketsQuery,
    DeleteTicketDocument,
    DeleteTicketMutation,
    Ticket,
    TicketState
} from "@/lib/graph/generated/graphql";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import {toast} from "sonner";
import ConfirmationDialog from "@/components/dialogs/confirmation-dialog";
import {Command, CommandGroup, CommandInput, CommandItem} from "@/components/ui/command";
import {cn} from "@/lib/utils";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {DateRangeFilter} from "@/components/date-range-filter";

const client = getClient();

export type TicketDialogState = {
    mode: "update" | "delete" | null;
    currentTicket: Ticket | null
}


export default function TicketPage() {
    const [tickets, setTickets] = useState<(Ticket | null)[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchTermText, setSearchTermText] = useState("");
    const [stateFilter, setStateFilter] = useState<string[]>([]);
    const [labelFilter, setLabelFilter] = useState<string[]>([]);
    const [startDate, setStartDate] = useState<Date | null>(null)
    const [endDate, setEndDate] = useState<Date | null>(null)
    const [dialogState, setDialogState] = useState<TicketDialogState>({mode: null, currentTicket: null});
    const [sortField, setSortField] = useState<"Erstellt" | "Geändert" | "Titel">("Erstellt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const resetDialogState = () => {
        setDialogState({mode: null, currentTicket: null})
    }

    const fetchTickets = useCallback(async () => {
        const data = await client.request<AllTicketsQuery>(AllTicketsDocument);
        if (data.tickets) {
            setTickets(data.tickets);
        }
    }, []);

    useEffect(() => {
        void fetchTickets();
    }, [fetchTickets]);

    const filteredTickets = tickets.filter(ticket => {
        if (!ticket) return false;

        const matchesTitle = ticket.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesText = ticket.text
            .toLowerCase()
            .includes(searchTermText.toLowerCase());

        const matchesState =
            stateFilter.length > 0 ? stateFilter.includes(ticket.state) : true;

        const matchesLabel =
            labelFilter.length > 0
                ? ticket.labels?.some((label) => labelFilter.includes(label.id))
                : true;

        const matchesStartDate = startDate ? new Date(ticket.createdAt) >= startDate : true
        const matchesEndDate = endDate ? new Date(ticket.createdAt) <= endDate : true


        return matchesTitle && matchesText && matchesState && matchesLabel && matchesStartDate && matchesEndDate;
    });

    const sortedTickets = [...filteredTickets].sort((a, b) => {
        if (!a || !b) return 0;
        let valA: string | number = "";
        let valB: string | number = "";

        if (sortField === "Erstellt") {
            valA = new Date(a.createdAt).getTime();
            valB = new Date(b.createdAt).getTime();
        } else if (sortField === "Geändert") {
            valA = new Date(a.lastModified).getTime();
            valB = new Date(b.lastModified).getTime();
        } else if (sortField === "Titel") {
            valA = a.title.toLowerCase();
            valB = b.title.toLowerCase();
        }

        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
    });

    async function handleDelete() {
        if (!dialogState.currentTicket) {
            toast.error("Ein Fehler beim Löschen des Tickets ist aufgetreten")
            return
        }

        try {
            await client.request<DeleteTicketMutation>(DeleteTicketDocument, {ids: [dialogState.currentTicket.id]})
            toast.success("Ticket wurde erfolgreich gelöscht")
            setTickets((prev) =>
                prev.filter((t) => t?.id !== dialogState.currentTicket?.id)
            );
            resetDialogState()
        } catch {
            toast.error("Ein Fehler beim Löschen des Tickets ist aufgetreten")
        }
    }

    return (
        <div className="space-y-6 grow max-w-screen">
            <ManagementPageHeader title="Tickets" description="Bearbeite alle verfügbaren Tickets"
                                  icon={<TicketIcon/>}/>
            <div className="px-8 flex gap-4">
                <Input
                    placeholder="Suche nach Titel..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    data-cy="search-title"
                />
                <Input
                    placeholder="Suche nach Text..."
                    value={searchTermText}
                    onChange={(e) => setSearchTermText(e.target.value)}
                    className="hidden md:flex"
                    data-cy="search-text"
                />
                <div className="hidden md:flex gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="max-w-[200px] justify-between" data-cy="button-status">
                                {stateFilter && stateFilter.length > 0
                                    ? `${stateFilter.length} Status`
                                    : "Status"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-[250px]">
                            <Command>
                                <CommandInput placeholder="Status suchen..."/>
                                <CommandGroup>
                                    {Object.values(TicketState).map((state) => {
                                        const isSelected = stateFilter?.includes(state);
                                        return (
                                            <CommandItem
                                                key={state}
                                                onSelect={() => {
                                                    setStateFilter((prev) =>
                                                        isSelected
                                                            ? prev?.filter((s) => s !== state)
                                                            : [...(prev ?? []), state]
                                                    );
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        isSelected ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {state}
                                            </CommandItem>
                                        );
                                    })}
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="max-w-[200px] justify-between" data-cy="button-label">
                                {labelFilter && labelFilter.length > 0
                                    ? `${labelFilter.length} Labels`
                                    : "Labels"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-[250px]">
                            <Command>
                                <CommandInput placeholder="Labels suchen..."/>
                                <CommandGroup>
                                    {tickets
                                        .flatMap((t) => t?.labels ?? [])
                                        .filter((v, i, a) => v && a.findIndex((l) => l.id === v.id) === i)
                                        .map((label) => {
                                            const isSelected = labelFilter?.includes(label.id);
                                            return (
                                                <CommandItem
                                                    key={label.id}
                                                    onSelect={() => {
                                                        setLabelFilter((prev) =>
                                                            isSelected
                                                                ? prev?.filter((l) => l !== label.id)
                                                                : [...(prev ?? []), label.id]
                                                        );
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            isSelected ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    {label.name}
                                                </CommandItem>
                                            );
                                        })}
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <DateRangeFilter
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                    />
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-[200px] justify-between"  data-cy="sort-button">
                                Sortieren: {sortField} ({sortOrder})
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-[250px]">
                            <Command>
                                <CommandGroup heading="Feld">
                                    {["Erstellt", "Geändert", "Titel"].map((field) => (
                                        <CommandItem
                                            key={field}
                                            onSelect={() => setSortField(field as typeof sortField)}
                                        >
                                            {field}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                                <CommandGroup heading="Reihenfolge">
                                    <CommandItem onSelect={() => setSortOrder("asc")} data-cy="sort-order-asc">Aufsteigend</CommandItem>
                                    <CommandItem onSelect={() => setSortOrder("desc")} data-cy="sort-order-desc">Absteigend</CommandItem>
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            {sortedTickets.map((ticket) =>
                    ticket?.id && (
                        <div key={ticket.id} className="mx-8 my-4" data-cy={`ticket-card-${ticket.id}`}>
                            <Link href={`/tickets/${ticket.id}`} passHref>
                                <TicketCard ticketID={ticket.id} setDialogState={setDialogState}/>
                            </Link>
                        </div>
                    )
            )}
            <ConfirmationDialog
                mode="confirmation"
                description={`Dies wird das Ticket ${dialogState.currentTicket?.title} unwiderruflich löschen`}
                onConfirm={handleDelete}
                isOpen={dialogState.mode === "delete"}
                closeDialog={resetDialogState}
                data-cy-confirm="confirm-delete"
                data-cy-cancel="cancel-delete"
            />
        </div>
    );
}
