"use client"

import {ManagementPageHeader} from "@/components/management-page-header";
import {Check, TicketIcon, Trash2} from "lucide-react";
import {TicketCard} from "@/app/tickets/ticket-card";
import {getClient} from "@/lib/graph/client";
import React, {useCallback, useEffect, useState} from "react";
import {
  AllLabelsDocument,
  AllLabelsQuery,
  AllTicketsDocument,
  AllTicketsQuery,
  DeleteTicketDocument,
  DeleteTicketMutation,
  Label,
  Ticket,
  TicketState
} from "@/lib/graph/generated/graphql";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import {toast} from "sonner";
import ConfirmationDialog from "@/components/dialogs/confirmation-dialog";
import {Command, CommandGroup, CommandInput, CommandItem} from "@/components/ui/command";
import {cn, compareStringSets} from "@/lib/utils";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {DateRangeFilter} from "@/components/date-range-filter";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,} from "@/components/ui/sheet"
import {useSidebar} from "@/components/ui/sidebar";
import LabelSelection from "@/components/label-selection";
import LabelBadge from "@/components/label-badge";
import SortingSelection from "@/app/tickets/sorting-selection";

export type TicketDialogState = {
  mode: "update" | "delete" | null;
  currentTicket: Ticket | null
}

export type TicketSorting = {
  field: TicketSortingField,
  orderAscending: boolean
}

export type TicketSortingField = "Erstellt" | "Geändert" | "Titel"

export default function TicketPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stateFilter, setStateFilter] = useState<TicketState[]>([]);
  const [labelFilter, setLabelFilter] = useState<Label[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [dialogState, setDialogState] = useState<TicketDialogState>({mode: null, currentTicket: null});
  const [sorting, setSorting] = useState<TicketSorting>({field: "Erstellt", orderAscending: true});
  const {isMobile} = useSidebar();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showMobileLabelFilter, setShowMobileLabelFilter] = useState(false);
  const [labelSearchTerm, setLabelSearchTerm] = useState("");
  const [showMobileSort, setShowMobileSort] = useState(false);
  const [areFiltersSet, setAreFiltersSet] = useState(false);
  const [stateFilterSet, setStateFilterSet] = useState(false);

  useEffect(() => {
    const originalState = new Set([TicketState.New, TicketState.Open])
    const currentState = new Set(stateFilter)
    setStateFilterSet(!compareStringSets(originalState, currentState))
  // We can't add the expected stateFilter as array dependency, as it will change size
  // and thus throw an error
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateFilter.length]);

  const [filteredTickets, setFilteredTickets] = useState<(Ticket[])>([]);
  const [sortedTickets, setSortedTickets] = useState<(Ticket[])>([]);

  const fetchTickets = useCallback(async () => {
    const client = getClient();
    const data = await client.request<AllTicketsQuery>(AllTicketsDocument);
    if (data.tickets) setTickets(data.tickets.filter(ticket => !!ticket))
  }, []);

  const fetchAllLabels = useCallback(async () => {
    const client = getClient();
    const data = await client.request<AllLabelsQuery>(AllLabelsDocument);
    if (data.labels) setLabels(data.labels.filter(label => !!label));
  }, []);

  useEffect(() => {
    const newFilteredTickets = filterTickets(tickets);
    setFilteredTickets(newFilteredTickets)

    setSortedTickets(sortTickets([...newFilteredTickets]))
  }, [tickets, stateFilter, labelFilter, searchTerm, startDate, endDate]);

  useEffect(() => {
    setSortedTickets(sortTickets([...filteredTickets]))
  }, [sorting.field, sorting.orderAscending]);

  useEffect(() => {
    setSorting(prevState => ({
      ...prevState,
      orderAscending: true
    }))
  }, [sorting.field]);

  useEffect(() => {
    setAreFiltersSet(
      stateFilterSet ||
      labelFilter.length > 0 ||
      !!startDate ||
      !!endDate
    )
  }, [stateFilterSet, labelFilter.length, startDate, endDate]);

  const resetDialogState = () => {
    setDialogState({mode: null, currentTicket: null})
  }

  useEffect(() => {
    void fetchTickets();
    void fetchAllLabels();
  }, [fetchTickets, fetchAllLabels]);

  function sortTickets(tickets: Ticket[]) {
    tickets.sort((a, b) => {
      if (!a || !b) return 0;
      let valA: string | number = "";
      let valB: string | number = "";

      if (sorting.field === "Erstellt") {
        valA = new Date(a.createdAt).getTime();
        valB = new Date(b.createdAt).getTime();
      } else if (sorting.field === "Geändert") {
        valA = new Date(a.lastModified).getTime();
        valB = new Date(b.lastModified).getTime();
      } else if (sorting.field === "Titel") {
        valA = a.title.toLowerCase();
        valB = b.title.toLowerCase();
      }

      if (valA < valB) return sorting.orderAscending ? -1 : 1;
      if (valA > valB) return sorting.orderAscending ? 1 : -1;
      return 0;
    });

    return tickets;
  }

  function filterTickets(tickets: Ticket[]) {
    tickets.filter(ticket => {
      if (!ticket) return false;

      const filterSearch = searchTerm.toLowerCase();
      const matchesTitleOrText =
        ticket.title.toLowerCase().includes(filterSearch) ||
        ticket.text.toLowerCase().includes(filterSearch);

      const matchesState =
        stateFilter.length > 0 ? stateFilter.includes(ticket.state) : true;

      const matchesLabel =
        labelFilter.length > 0
          ? ticket.labels?.some((label) => labelFilter.map(l => l.id).includes(label.id))
          : true;

      const matchesStartDate = startDate ? new Date(ticket.createdAt) >= startDate : true
      const matchesEndDate = endDate ? new Date(ticket.createdAt) <= endDate : true

      return matchesTitleOrText && matchesState && matchesLabel && matchesStartDate && matchesEndDate;
    });

    return tickets
  }

  const resetAllFilters = () => {
    setSearchTerm("");
    setStateFilter([TicketState.New, TicketState.Open]);
    setLabelFilter([]);
    setStartDate(null);
    setEndDate(null);
    setSorting({field: "Erstellt", orderAscending: true});
    setLabelSearchTerm("");
  };

  async function handleDelete() {
    if (!dialogState.currentTicket) {
      toast.error("Ein Fehler beim Löschen des Tickets ist aufgetreten")
      return
    }

    try {
      const client = getClient();
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

  console.log("Sorting: ", sorting)

  return (
    <div className="w-full h-full flex flex-col grow">
      <ManagementPageHeader title="Tickets" description="Bearbeite alle verfügbaren Tickets"
                            icon={<TicketIcon/>}/>
      <div className="px-8 flex gap-4">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex gap-2">
            <Input
              placeholder="Suche nach Inhalt..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-cy="search-title"
            />
            {isMobile ? (
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(areFiltersSet && 'border !border-accent')}
                    data-cy="mobile-filter-button">
                    Filter
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[85%] sm:w-[400px] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filter</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col mt-0 px-4">
                    <div className="flex flex-row gap-2 justify-between">
                      <div className="font-semibold">Status:</div>
                      <Button variant="outline" className="w-fit justify-between"
                              onClick={() => setShowMobileFilters((prev) => !prev)}>
                        {stateFilter.length > 0 ? `${stateFilter.length} ausgewählt` : "Status filtern"}
                      </Button>
                    </div>
                    {showMobileFilters && (
                      <div className="mt-2 overflow-hidden">
                        {Object.values(TicketState).map((state) => {
                          const isSelected = stateFilter.includes(state);
                          return (
                            <Button
                              key={state}
                              variant={isSelected ? "secondary" : "outline"}
                              className="w-full flex items-center justify-start gap-2"
                              onClick={() =>
                                setStateFilter((prev) =>
                                  isSelected
                                    ? prev.filter((s) => s !== state)
                                    : [...prev, state]
                                )
                              }
                            >
                              <Check
                                className={cn("mr-2 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")}
                              />
                              {state === TicketState.New ? "Neu" : state === TicketState.Open ? "Offen" : "Fertig"}
                            </Button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col mt-4">
                    <div className="flex flex-row gap-2 px-4 justify-between">
                      <div className="font-semibold mt-1">Labels:</div>
                      <Button
                        variant="outline"
                        className="w-fit justify-between"
                        onClick={() => setShowMobileLabelFilter((prev) => !prev)}
                      >
                        {labelFilter.length > 0
                          ? `${labelFilter.length} ausgewählt`
                          : "Labels filtern"}
                      </Button>
                    </div>
                    {showMobileLabelFilter && (
                      <div className="mt-2 px-4">
                        <div className="overflow-hidden max-h-[150px] overflow-y-auto">
                          <Input
                            placeholder="Label suchen..."
                            value={labelSearchTerm}
                            onChange={(e) => setLabelSearchTerm(e.target.value)}
                            className="w-full mb-2"
                          />
                          {labels
                            .filter((label) =>
                              label?.name.toLowerCase().includes(labelSearchTerm.toLowerCase())
                            )
                            // for some reason, using it with && in the upper filter does not work...
                            .filter((label) => !!label)
                            .map((label) => {
                              const isSelected = label.id
                                ? labelFilter.map(l => l.id).includes(label.id)
                                : false;

                              return (
                                <Button
                                  key={label.id}
                                  variant={"ghost"}
                                  className="w-full flex items-center justify-start gap-2"
                                  onClick={() => {
                                    setLabelFilter((prev) =>
                                      isSelected
                                        ? prev.filter((l) => l.id !== label?.id)
                                        : [...prev, label]
                                    )
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      isSelected ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  <LabelBadge label={label}/>
                                </Button>
                              );
                            })}
                          {labelFilter.length > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-center mt-2"
                              onClick={() => setLabelFilter([])}
                              data-cy="clear-labels"
                            >
                              <Trash2 className="mr-2"/> Filter löschen
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col mt-4 px-4">
                    <div className="flex flex-col gap-2">
                      <div className="font-semibold mt-1 mb-1">Datum:</div>
                      <DateRangeFilter
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        mobile={true}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col mt-4 px-4">
                    <div className="flex flex-row gap-2 justify-between items-center">
                      <div className="font-semibold mt-1 mb-1">Sortieren:</div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-fit justify-between text-sm"
                        onClick={() => setShowMobileSort((prev) => !prev)}
                      >
                        {sorting.field} {sorting.orderAscending ? "↑" : "↓"}
                      </Button>
                    </div>
                    {showMobileSort && (
                      <div className="mt-1 border rounded-md overflow-hidden mb-4">
                        <div className="flex flex-col p-1 gap-1">
                          <div className="text-xs">Feld</div>
                          <div className="flex flex-row gap-1 flex-wrap">
                            {["Erstellt", "Geändert", "Titel"].map((field) => (
                              <Button
                                key={field}
                                variant={sorting.field === field ? "secondary" : "outline"}
                                size="sm"
                                className="flex-1 text-xs"
                                onClick={() => setSorting(prevState => ({
                                  ...prevState,
                                  field: field as TicketSortingField
                                }))}
                              >
                                {field}
                              </Button>
                            ))}
                          </div>
                          <div className="text-xs mt-1">Reihenfolge</div>
                          <div className="flex flex-row gap-1">
                            <Button
                              variant={sorting.orderAscending ? "secondary" : "outline"}
                              size="sm"
                              className="flex-1 text-xs"
                              onClick={() => setSorting(prevState => ({
                                ...prevState,
                                orderAscending: true
                              }))}
                            >
                              Aufsteigend
                            </Button>
                            <Button
                              variant={sorting.orderAscending ? "outline" : "secondary"}
                              size="sm"
                              className="flex-1 text-xs"
                              onClick={() => setSorting(prevState => ({
                                ...prevState,
                                orderAscending: false
                              }))}
                            >
                              Absteigend
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'max-w-[200px] justify-between',
                         stateFilterSet && 'border !border-accent'
                      )}
                      data-cy="button-status"
                    >
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
                              {state === TicketState.New
                                ? "Neu"
                                : state === TicketState.Open
                                  ? "Offen"
                                  : "Fertig"}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "max-w-[200px] justify-between",
                        labelFilter.length > 0 && 'border !border-accent'
                      )}
                      data-cy="button-label">
                      {labelFilter && labelFilter.length > 0
                        ? `${labelFilter.length} Labels`
                        : "Labels"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-[250px]">
                    <LabelSelection
                      labels={labels}
                      selectedLabels={labelFilter}
                      setLabels={(labels) => setLabelFilter(labels)}
                    />
                  </PopoverContent>
                </Popover>

                <DateRangeFilter
                  startDate={startDate}
                  setStartDate={setStartDate}
                  endDate={endDate}
                  setEndDate={setEndDate}
                />

                <SortingSelection setSorting={setSorting} sorting={sorting}/>

              </div>
            )}
          </div>
          {areFiltersSet && (
            <Button
              variant="outline"
              className="whitespace-nowrap"
              onClick={resetAllFilters}
              data-cy="reset-filters"
            >
              <Trash2 className="text-destructive"/>
              Filter zurücksetzen
            </Button>
          )}
        </div>
      </div>
      {sortedTickets.map((ticket) =>
          ticket?.id && (
            <div key={ticket.id} className="mx-8 my-4" data-cy={`ticket-card-${ticket.id}`}>
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
        data-cy-confirm="confirm-delete"
        data-cy-cancel="cancel-delete"
      />
    </div>
  )
}
