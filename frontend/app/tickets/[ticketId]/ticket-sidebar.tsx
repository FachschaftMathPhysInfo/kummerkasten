"use client";

import {Input} from "@/components/ui/input";
import {Badge} from "@/components/ui/badge";
import {useRouter} from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {cn, compareStringSets} from "@/lib/utils";
import React, {useEffect, useState} from "react";
import {format} from "date-fns";
import {useTickets} from "@/components/providers/ticket-provider";
import {TicketFiltering, TicketSorting} from "@/app/tickets/page";
import {defaultTicketFiltering, defaultTicketSorting} from "@/lib/graph/defaultTypes";
import {getFilteredTickets, getSortedTickets} from "@/lib/ticket-operations";
import MobileFilterSheet from "@/components/mobile-filter-sheet";
import {TicketState} from "@/lib/graph/generated/graphql";

interface TicketSidebarProps {
  searchTerm: string;
  setSearchTermAction: (term: string) => void;
  selectedTicketId?: string;
}

export default function TicketSidebar({
                                        searchTerm,
                                        setSearchTermAction,
                                        selectedTicketId,
                                      }: TicketSidebarProps) {

  const router = useRouter();
  const {tickets} = useTickets()
  const [filtering, setFiltering] = useState<TicketFiltering>(defaultTicketFiltering)
  const [sorting, setSorting] = useState<TicketSorting>(defaultTicketSorting)
  const [areFiltersSet, setAreFiltersSet] = useState(false)
  const [isStateFilterSet, setIsStateFilterSet] = useState(false)

  useEffect(() => {
    const originalState = new Set(defaultTicketFiltering.state)
    const currentState = new Set(filtering.state)
    setIsStateFilterSet(!compareStringSets(originalState, currentState))
    // This will always change by one, thus .length is sufficient here
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtering.state.length]);

  useEffect(() =>
      setAreFiltersSet(
        isStateFilterSet ||
        filtering.labels.length > 0 ||
        !!filtering.startDate ||
        !!filtering.endDate
      )
    , [isStateFilterSet, filtering.labels.length, filtering.startDate, filtering.endDate])

  const filteredTickets = getFilteredTickets(filtering, tickets)
  const sortedTickets = getSortedTickets(sorting, filteredTickets)


  return (
    <div className="px-4">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/tickets">Tickets</BreadcrumbLink>
          </BreadcrumbItem>
          {selectedTicketId && (
            <>
              <BreadcrumbSeparator/>
              <BreadcrumbItem>
                <BreadcrumbPage>Details</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-row gap-2">
        <Input
          placeholder="Suche nach Tickets..."
          value={searchTerm}
          onChange={(e) => setSearchTermAction(e.target.value)}
          className="mb-4"
          data-cy="search-ticket-detail"
        />

        <MobileFilterSheet
          filtering={filtering}
          setFiltering={setFiltering}
          sorting={sorting}
          setSorting={setSorting}
          areFiltersSet={areFiltersSet}
        />
      </div>

      <div>
        {sortedTickets.map((t) => (
          <div
            key={t.id}
            className={`flex flex-row p-2 cursor-pointer rounded items-center ${
              t.id === selectedTicketId ? "bg-accent/50" : "hover:bg-accent/40"
            }`}
            onClick={() => router.push(`/tickets/${t.id}`)}
            data-cy={`ticket-card-${t.id}`}
          >
            <Badge
              className={cn(
                "px-2 py-1 rounded mr-5 h-2",
                t.state === TicketState.New && "bg-ticketstate-new",
                t.state === TicketState.Open && "bg-ticketstate-open",
                t.state === TicketState.Closed && "bg-ticketstate-closed"
              )}
              data-cy={`ticket-status-${t.id}`}
            />
            <div className="flex flex-row justify-between w-full">
              <div
                className="truncate max-w-[250px]"
                title={t.title}
                data-cy={`ticket-title-${t.id}`}
              >
                {t.title}
              </div>
              <div
                className="hidden mx-3 md:flex flex-col text-xs items-end justify-center text-muted-foreground">
                Geändert: {t?.lastModified ? format(new Date(t.lastModified), "dd.MM.yy") : ""}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
