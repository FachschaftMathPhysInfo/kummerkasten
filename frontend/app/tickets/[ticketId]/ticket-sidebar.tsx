"use client";

import {Input} from "@/components/ui/input";
import {Badge} from "@/components/ui/badge";
import {useRouter} from "next/navigation";
import {Ticket} from "@/lib/graph/generated/graphql";

interface TicketSidebarProps {
    tickets: Ticket[];
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedTicketId?: string;
}

export default function TicketSidebar({tickets, searchTerm, setSearchTerm, selectedTicketId}: TicketSidebarProps) {
    const router = useRouter();
    const filteredTickets = tickets.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="px-4">
            <Input
                placeholder="Suche nach Tickets..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="mb-4"
                data-cy="search-ticket-detail"
            />
            <div>
                {filteredTickets.map(t => (
                    <div
                        key={t.id}
                        className={`flex flex-row p-2 cursor-pointer rounded items-center ${t.id === selectedTicketId ? "bg-accent" : "hover:bg-accent"}`}
                        onClick={() => router.push(`/tickets/${t.id}`)}
                        data-cy={`ticket-card-${t.id}`}
                    >
                        <Badge
                            className="text-white px-2 py-1 rounded mr-5 h-2"
                            style={{
                                backgroundColor:
                                    t.state === "NEW" ? "#839176" :
                                        t.state === "OPEN" ? "#192B51" :
                                            t.state === "CLOSED" ? "#DF517F" : "gray"
                            }}
                            data-cy={`ticket-status-${t.id}`}
                        />
                        <div className="truncate max-w-[250px]" title={t.title} data-cy={`ticket-title-${t.id}`}>{t.title}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
