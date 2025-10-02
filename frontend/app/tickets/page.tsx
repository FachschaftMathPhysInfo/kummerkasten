"use client"

import {ManagementPageHeader} from "@/components/management-page-header";
import {TicketIcon, Trash2} from "lucide-react";
import {TicketCard} from "@/app/tickets/ticket-card";
import React, {useEffect, useState} from "react";
import {Ticket} from "@/lib/graph/generated/graphql";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import {toast} from "sonner";
import ConfirmationDialog from "@/components/dialogs/confirmation-dialog";
import {Button} from "@/components/ui/button";
import {useSidebar} from "@/components/ui/sidebar";
import {useTickets} from "@/components/providers/ticket-provider";
import MobileFilterSheet from "@/app/tickets/mobile-filter-sheet";
import FilterBar from "@/components/filter-bar";
import {
  getCurrentSemesterTickets,
  getFilteredTickets,
  getOlderSemesterTickets,
  getSortedTickets
} from "@/lib/ticket-operations";
import {defaultTicketFiltering} from "@/lib/graph/defaultTypes";


export type TicketDialogState = {
  mode: "update" | "delete" | null;
  currentTicket: Ticket | null
}

export default function TicketPage() {
  const {
    tickets,
    filtering,
    areFiltersSet,
    sorting,
    setFiltering,
    setSorting,
    deleteTickets,
    triggerTicketRefetch
  } = useTickets();
  const [dialogState, setDialogState] = useState<TicketDialogState>({mode: null, currentTicket: null});
  const {isMobile} = useSidebar();
  const [filteredTickets, setFilteredTickets] = useState<(Ticket[])>([]);
  const [sortedTickets, setSortedTickets] = useState<(Ticket[])>([]);

  useEffect(() => {
    triggerTicketRefetch()
    // can't use function as array dependency as the render and update depth are exceeded
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
      const newFilteredTickets = getFilteredTickets(filtering, tickets);
      setFilteredTickets(newFilteredTickets)

      setSortedTickets(getSortedTickets(sorting, [...newFilteredTickets]))
    },
    [
      tickets,
      filtering.state.length,
      filtering.labels.length,
      filtering.searchTerm,
      filtering.startDate,
      filtering.endDate,
      filtering,
      sorting
    ]
  );

  useEffect(() => {
    setSortedTickets(getSortedTickets(sorting, [...filteredTickets]))
  }, [sorting.field, sorting.orderAscending, filteredTickets, sorting]);

  useEffect(() => {
    setSorting(prevState => ({
      ...prevState,
      orderAscending: true
    }))
  }, [sorting.field]);

  function resetDialogState() {
    setDialogState({mode: null, currentTicket: null})
  }

  async function handleDelete() {
    if (!dialogState.currentTicket) {
      toast.error("Ein Fehler beim Löschen des Tickets ist aufgetreten")
      return
    }

    const error = await deleteTickets([dialogState.currentTicket.id])

    if (!error) {
      toast.success("Ticket wurde erfolgreich gelöscht")
      resetDialogState()
    } else {
      toast.error("Ein Fehler beim Löschen des Tickets ist aufgetreten")
    }
  }

  return (
    <div className="space-y-6 grow max-w-screen">
      <ManagementPageHeader
        title="Tickets"
        description="Bearbeite alle verfügbaren Tickets"
        icon={<TicketIcon/>}
      />
      <div className="px-8 flex gap-4">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex gap-2">
            <Input
              placeholder="Suche nach Inhalt..."
              value={filtering.searchTerm}
              onChange={(e) => setFiltering(prev => ({
                ...prev,
                searchTerm: e.target.value,
              }))}
              data-cy="ticket-overview-search-field"
            />

            {isMobile ? (
              <MobileFilterSheet/>
            ) : (
              <FilterBar/>
            )}
          </div>
          {areFiltersSet && (
            <Button
              variant="outline"
              className="whitespace-nowrap"
              onClick={() => setFiltering(defaultTicketFiltering)}
              data-cy="desktop-overview-reset-filters"
            >
              <Trash2 className="text-destructive"/>
              Filter zurücksetzen
            </Button>
          )}
        </div>
      </div>

      <div className={'w-full px-10 flex gap-4 items-center my-2'}>
        <span className={'grow h-0.5 bg-muted-foreground'}/>
        <p className={'text-muted-foreground'}>Dieses Semester</p>
        <span className={'grow h-0.5 bg-muted-foreground'}/>
      </div>

      {getCurrentSemesterTickets(sortedTickets).map((ticket) =>
          ticket?.id && (
            <div key={ticket.id} className="mx-8 my-4" data-cy={`ticket-card-id-${ticket.id}`}>
              <Link href={`/tickets/${ticket.id}`} passHref>
                <TicketCard ticketID={ticket.id} setDialogStateAction={setDialogState}/>
              </Link>
            </div>
          )
      )}

      <div className={'w-full px-10 flex gap-4 items-center my-2'}>
        <span className={'grow h-0.5 bg-muted-foreground'}/>
        <p className={'text-muted-foreground'}>Frühere Semester</p>
        <span className={'grow h-0.5 bg-muted-foreground'}/>
      </div>
      {getOlderSemesterTickets(sortedTickets).map((ticket) =>
          ticket?.id && (
            <div key={ticket.id} className="mx-8 my-4" data-cy={`ticket-card-id-${ticket.id}`}>
              <Link href={`/tickets/${ticket.id}`} passHref>
                <TicketCard ticketID={ticket.id} setDialogStateAction={setDialogState}/>
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
      />
    </div>
  )
}
