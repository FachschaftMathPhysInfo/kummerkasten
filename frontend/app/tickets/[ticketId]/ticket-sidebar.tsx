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
import {cn} from "@/lib/utils";
import React, {useEffect, useState} from "react";
import {format} from "date-fns";
import {useTickets} from "@/components/providers/ticket-provider";
import {defaultTicketFiltering} from "@/lib/graph/defaultTypes";
import {
  getCurrentSemesterTickets,
  getFilteredTickets,
  getOlderSemesterTickets,
  getSortedTickets
} from "@/lib/ticket-operations";
import {Ticket, TicketState} from "@/lib/graph/generated/graphql";
import {Button} from "@/components/ui/button";
import FilterBar from "@/components/filter-bar";
import {RotateCcw} from "lucide-react";

interface TicketSidebarProps {
  selectedTicketId?: string;
}

export default function TicketSidebar({selectedTicketId}: TicketSidebarProps) {

  const router = useRouter();
  const {tickets, filtering, areFiltersSet, sorting, setFiltering, stateFilterSet} = useTickets()
  const [showFilters, setShowFilters] = useState(false)
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>(getFilteredTickets(filtering, tickets))
  const [sortedTickets, setSortedTickets] = useState<Ticket[]>(getSortedTickets(sorting, filteredTickets))

  useEffect(() => {
    const newFilteredTickets = getFilteredTickets(filtering, tickets)
    setFilteredTickets(newFilteredTickets)
    setSortedTickets(getSortedTickets(sorting, newFilteredTickets))
  }, [
    stateFilterSet, filtering.labels.length, filtering.startDate, filtering.endDate, filtering.searchTerm,
    sorting.field, sorting.orderAscending, filtering, sorting, tickets
  ])

  useEffect(() => {
    const newFilteredTickets = getFilteredTickets(filtering, tickets)
    setFilteredTickets(newFilteredTickets)
    setSortedTickets(getSortedTickets(sorting, newFilteredTickets))
  }, [tickets, filtering, sorting])

  return (
    <div className="px-4 flex flex-col gap-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/tickets" data-cy="ticket-sidebar-breadcrumb">Tickets</BreadcrumbLink>
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
      <div className="flex flex-col">
        <div className={'flex gap-2'}>
          <Input
            placeholder="Suche nach Tickets..."
            value={filtering.searchTerm}
            onChange={(e) => setFiltering(prevState => ({
                ...prevState,
                searchTerm: e.target.value
              })
            )}
            className="mb-4"
            data-cy="ticket-detail-search"
          />

          <Button
            variant="outline"
            className={cn(areFiltersSet && 'border !border-accent')}
            onClick={() => setShowFilters(!showFilters)}
            data-cy="ticket-detail-filter-button"
          >
            Filter
          </Button>
        </div>

        <div
          className={cn(
            'w-full border rounded-lg p-2',
            !showFilters && !areFiltersSet && 'hidden'
          )}
        >
          {showFilters && (
            <FilterBar scrollable/>
          )}

          {areFiltersSet && (
            <Button
              variant={"ghost"}
              onClick={() => {
                setFiltering(defaultTicketFiltering)
                setShowFilters(false)
              }}
              className={'w-full'}
              data-cy="ticket-detail-reset-filter"
            >
              <RotateCcw/> Filter zurücksetzen
            </Button>
          )}</div>
      </div>

      <div>
        <div className={'w-full flex gap-4 items-center my-2'}>
          <span className={'grow h-0.5 bg-muted-foreground'}/>
          <p className={'text-muted-foreground'}>Dieses Semester</p>
          <span className={'grow h-0.5 bg-muted-foreground'}/>
        </div>

        {getCurrentSemesterTickets(sortedTickets).map((t) => (
          <div
            key={t.id}
            className={`flex flex-row p-2 cursor-pointer rounded items-center ${
              t.id === selectedTicketId ? "bg-accent/50" : "hover:bg-accent/40"
            }`}
            onClick={() => router.push(`/tickets/${t.id}`)}
            data-cy={`ticket-card-id-${t.id}`}
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
            <div className="flex flex-row justify-between w-full gap-3 overflow-x-auto">
              <div
                className="truncate max-w-[250px] shrink-0"
                title={t.title}
                data-cy={`ticket-title-${t.id}`}
              >
                {t.title}
              </div>
              <div
                className="hidden md:flex text-xs items-center text-muted-foreground truncate"
                title={`Geändert: ${t?.lastModified ? format(new Date(t.lastModified), "dd.MM.yy") : ""}`}
              >
                Geändert: {t?.lastModified ? format(new Date(t.lastModified), "dd.MM.yy") : ""}
              </div>
            </div>
          </div>
        ))}

        <div className={'w-full flex gap-4 items-center my-2'}>
          <span className={'grow h-0.5 bg-muted-foreground'}/>
          <p className={'text-muted-foreground'}>Frühere Semester</p>
          <span className={'grow h-0.5 bg-muted-foreground'}/>
        </div>

        {getOlderSemesterTickets(sortedTickets).map((t) => (
          <div
            key={t.id}
            className={`flex flex-row p-2 cursor-pointer rounded items-center ${
              t.id === selectedTicketId ? "bg-accent/50" : "hover:bg-accent/40"
            }`}
            onClick={() => router.push(`/tickets/${t.id}`)}
            data-cy={`ticket-card-id-${t.id}`}
          >
            <Badge
              className={cn(
                "text-white px-2 py-1 rounded mr-5 h-2",
                t.state === "NEW" && "bg-ticketstate-new",
                t.state === "OPEN" && "bg-ticketstate-open",
                t.state === "CLOSED" && "bg-ticketstate-closed"
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
