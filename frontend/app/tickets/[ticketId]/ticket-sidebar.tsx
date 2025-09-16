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
import {Ticket, TicketState} from "@/lib/graph/generated/graphql";
import {Button} from "@/components/ui/button";
import FilterBar from "@/components/filter-bar";
import {RotateCcw} from "lucide-react";
import {getCurrentSemesterTickets, getOlderSemesterTickets} from "@/lib/ticket-operations";

interface TicketSidebarProps {
  selectedTicketId?: string;
}

export default function TicketSidebar({selectedTicketId,}: TicketSidebarProps) {

  const router = useRouter();
  const {tickets} = useTickets()
  const [filtering, setFiltering] = useState<TicketFiltering>(defaultTicketFiltering)
  const [sorting, setSorting] = useState<TicketSorting>(defaultTicketSorting)
  const [areFiltersSet, setAreFiltersSet] = useState(false)
  const [isStateFilterSet, setIsStateFilterSet] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>(getFilteredTickets(filtering, tickets))
  const [sortedTickets, setSortedTickets] = useState<Ticket[]>(getSortedTickets(sorting, filteredTickets))

  useEffect(() => {
    const originalState = new Set(defaultTicketFiltering.state)
    const currentState = new Set(filtering.state)
    setIsStateFilterSet(!compareStringSets(originalState, currentState))
    // This will always change by one, thus .length is sufficient here
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtering.state.length]);

  useEffect(() => {
    setAreFiltersSet(
      isStateFilterSet ||
      filtering.labels.length > 0 ||
      !!filtering.startDate ||
      !!filtering.endDate
    )

    const newFilteredTickets = getFilteredTickets(filtering, tickets)
    setFilteredTickets(newFilteredTickets)
    setSortedTickets(getSortedTickets(sorting, newFilteredTickets))
  }, [
    isStateFilterSet, filtering.labels.length, filtering.startDate, filtering.endDate, filtering.searchTerm,
    sorting.field, sorting.orderAscending
  ])

  useEffect(() => {
    const newFilteredTickets = getFilteredTickets(filtering, tickets)
    setFilteredTickets(newFilteredTickets)
    setSortedTickets(getSortedTickets(sorting, newFilteredTickets))
  }, [tickets])

  return (
    <div className="px-4 flex flex-col gap-4">
      <Breadcrumb>
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
            data-cy="search-ticket-detail"
          />

          <Button
            variant="outline"
            className={cn(areFiltersSet && 'border !border-accent')}
            onClick={() => setShowFilters(!showFilters)}
            data-cy="mobile-filter-button"
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
            <FilterBar
              filtering={filtering}
              setFiltering={setFiltering}
              sorting={sorting}
              setSorting={setSorting}
              stateFilterSet={isStateFilterSet}
              scrollable
            />
          )}

          {areFiltersSet && (
            <Button
              variant={"ghost"}
              onClick={() => {
                setFiltering(defaultTicketFiltering)
                setShowFilters(false)
              }}
              className={'w-full'}
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
            data-cy={`ticket-card-${t.id}`}
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
