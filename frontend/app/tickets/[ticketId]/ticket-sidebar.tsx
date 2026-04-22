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
import React, {useMemo, useState} from "react";
import {format} from "date-fns";
import {useTickets} from "@/components/providers/ticket-provider";
import {defaultTicketFiltering} from "@/lib/graph/defaultTypes";
import {
  getCurrentSemesterTickets,
  getFilteredTickets,
  getOlderSemesterTickets,
  getSortedTickets
} from "@/lib/ticket-operations";
import {TicketState} from "@/lib/graph/generated/graphql";
import {Button} from "@/components/ui/button";
import FilterBar from "@/components/filter-bar";
import {RotateCcw} from "lucide-react";
import {useTranslations} from "next-intl";

interface TicketSidebarProps {
  selectedTicketId?: string;
}

export default function TicketSidebar({selectedTicketId}: TicketSidebarProps) {
  const t = useTranslations("TicketId.TicketSidebar");
  const tc = useTranslations("Commons")
  const router = useRouter();
  const {tickets, filtering, areFiltersSet, sorting, setFiltering} = useTickets()
  const [showFilters, setShowFilters] = useState(false)

  const filteredTickets = useMemo(
    () => getFilteredTickets(filtering, tickets),
    [filtering, tickets]
  )

  const sortedTickets = useMemo(
    () => getSortedTickets(sorting, filteredTickets),
    [sorting, filteredTickets]
  )

  return (
    <div className="h-[95vh] max-h-[95vh] flex flex-col overflow-hidden">
      <div className="px-4 flex flex-col gap-4 h-full min-h-0">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/tickets" data-cy="ticket-sidebar-breadcrumb">{t("tickets")}</BreadcrumbLink>
            </BreadcrumbItem>
            {selectedTicketId && (
              <>
                <BreadcrumbSeparator/>
                <BreadcrumbItem>
                  <BreadcrumbPage>{t("details")}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex flex-col">
          <div className={'flex gap-2'}>
            <Input
              placeholder={t("searchbar.placeholder")}
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
              {tc("words.filter")}
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
                <RotateCcw/> {tc("buttons.resetFilter")}
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
          {tickets.length == 0 ? (
            <div className={'mx-5 flex items-center justify-center grow'}>
              <p className={'text-wrap text-center text-muted-foreground'}>
                {t("noTickets")}
              </p>
            </div>
          ) : sortedTickets.length == 0 ? (
            <div className={'mx-5 flex items-center justify-center grow'}>
              <p className={'text-wrap text-xl text-center text-muted-foreground'}>
                {t("noFilteredResults")}
              </p>
            </div>
          ) : (
            <>
              {getCurrentSemesterTickets(sortedTickets).length > 0 && (
                <>
                  {getOlderSemesterTickets(sortedTickets).length > 0 && (
                    <div className={'w-full flex gap-4 items-center my-2'}>
                      <span className={'grow h-0.5 bg-muted-foreground'}/>
                      <p className={'text-muted-foreground'}>{t("thisSemester")}</p>
                      <span className={'grow h-0.5 bg-muted-foreground'}/>
                    </div>
                  )}

                  {getCurrentSemesterTickets(sortedTickets).map((ticket) => (
                    <div
                      key={ticket.id}
                      className={`flex flex-row p-2 cursor-pointer rounded items-center ${
                        ticket.id === selectedTicketId ? "bg-accent/50" : "hover:bg-accent/40"
                      }`}
                      onClick={() => router.push(`/tickets/${ticket.id}`)}
                      data-cy={`ticket-card-id-${ticket.id}`}
                    >
                      <Badge
                        className={cn(
                          "px-2 py-1 rounded mr-5 h-2",
                          ticket.state === TicketState.New && "bg-ticketstate-new",
                          ticket.state === TicketState.Open && "bg-ticketstate-open",
                          ticket.state === TicketState.Closed && "bg-ticketstate-closed"
                        )}
                        data-cy={`ticket-status-${ticket.id}`}
                      />
                      <div className="flex flex-row justify-between w-full gap-3 overflow-x-auto">
                        <div
                          className={`truncate max-w-[28vh] flex-grow`}
                          title={ticket.title}
                          data-cy={`ticket-title-${ticket.id}`}
                        >
                          {ticket.title}
                        </div>
                        <div
                          className="hidden md:flex text-xs items-center text-muted-foreground min-w-[12vh] flex-shrink-0">
                          {tc("ticketSortingFields.modified")}: {ticket?.lastModified ? format(new Date(ticket.lastModified), "dd.MM.yy") : ""}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {getOlderSemesterTickets(sortedTickets).length > 0 && (
                <>
                  <div className={'w-full flex gap-4 items-center my-2'}>
                    <span className={'grow h-0.5 bg-muted-foreground'}/>
                    <p className={'text-muted-foreground'}>{t("oldSemester")}</p>
                    <span className={'grow h-0.5 bg-muted-foreground'}/>
                  </div>
                  {getOlderSemesterTickets(sortedTickets).map((ticket) => (
                    <div
                      key={ticket.id}
                      className={`flex flex-row p-2 cursor-pointer rounded items-center ${
                        ticket.id === selectedTicketId ? "bg-accent/50" : "hover:bg-accent/40"
                      }`}
                      onClick={() => router.push(`/tickets/${ticket.id}`)}
                      data-cy={`ticket-card-id-${ticket.id}`}
                    >
                      <Badge
                        className={cn(
                          "text-white px-2 py-1 rounded mr-5 h-2",
                          ticket.state === "NEW" && "bg-ticketstate-new",
                          ticket.state === "OPEN" && "bg-ticketstate-open",
                          ticket.state === "CLOSED" && "bg-ticketstate-closed"
                        )}
                        data-cy={`ticket-status-${ticket.id}`}
                      />
                      <div className="flex flex-row justify-between w-full gap-3 overflow-x-auto">
                        <div
                          className="truncate max-w-[28vh] flex-grow"
                          title={ticket.title}
                          data-cy={`ticket-title-${ticket.id}`}
                        >
                          {ticket.title}
                        </div>
                        <div
                          className="hidden md:flex text-xs items-center text-muted-foreground min-w-[12vh] flex-shrink-0">
                          {tc("ticketSortingFields.modified")}: {ticket?.lastModified ? format(new Date(ticket.lastModified), "dd.MM.yy") : ""}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </>
          )
          }
        </div>
      </div>
    </div>
  );
}
