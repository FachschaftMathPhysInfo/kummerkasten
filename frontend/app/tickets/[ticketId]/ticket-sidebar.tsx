"use client";

import {Input} from "@/components/ui/input";
import {Badge} from "@/components/ui/badge";
import {useRouter} from "next/navigation";
import {Label, TicketState,} from "@/lib/graph/generated/graphql";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {Check, Trash2} from "lucide-react";
import {cn, compareStringSets} from "@/lib/utils";
import {DateRangeFilter} from "@/components/date-range-filter";
import React, {useEffect, useState} from "react";
import {format} from "date-fns";
import {useLabels} from "@/components/providers/label-provider";
import {useTickets} from "@/components/providers/ticket-provider";
import LabelSelection from "@/components/label-selection";

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
  const {labels} = useLabels()
  const [stateFilter, setStateFilter] = useState<TicketState[]>([TicketState.New, TicketState.Open]);
  const [labelFilter, setLabelFilter] = useState<Label[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [sortField, setSortField] = useState<
    "Erstellt" | "Geändert" | "Titel"
  >("Erstellt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [areFiltersSet, setAreFiltersSet] = useState(false)
  const [isStateFilterSet, setIsStateFilterSet] = useState(false)

  useEffect(() => {
    const originalState = new Set([TicketState.Open, TicketState.New])
    const currentState = new Set(stateFilter)
    setIsStateFilterSet(!compareStringSets(originalState, currentState))
    // This will always change by one, thus .length is sufficient here
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateFilter.length]);

  useEffect(() =>
      setAreFiltersSet(
        isStateFilterSet ||
        labelFilter.length > 0 ||
        !!startDate ||
        !!endDate
      )
    , [isStateFilterSet, labelFilter.length, startDate, endDate])

  const filteredTickets = tickets.filter((ticket) => {
    if (!ticket) return false;

    const filterSearch = searchTerm.toLowerCase();
    const matchesTitleOrText =
      ticket.title.toLowerCase().includes(filterSearch) ||
      ticket.text.toLowerCase().includes(filterSearch);

    const matchesState =
      stateFilter.length > 0 ? stateFilter.includes(ticket.state) : true;

    const matchesLabel =
      labelFilter.length > 0
        ? ticket.labels?.some((label) => labelFilter
          .filter(l => l.id)
          .map(l => l.name)
          .includes(label.name))
        : true;

    const matchesStartDate = startDate
      ? new Date(ticket.createdAt) >= startDate
      : true;
    const matchesEndDate = endDate
      ? new Date(ticket.createdAt) <= endDate
      : true;

    return (
      matchesTitleOrText &&
      matchesState &&
      matchesLabel &&
      matchesStartDate &&
      matchesEndDate
    );
  });

  const resetAllFilters = () => {
    setSearchTermAction("");
    setStateFilter([TicketState.Open, TicketState.New]);
    setLabelFilter([]);
    setStartDate(null);
    setEndDate(null);
    setSortField("Erstellt");
    setSortOrder("asc");
  };

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
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className={cn(areFiltersSet && '!border-accent')}
              data-cy="filter-button"
            >
              Filter
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[85%] sm:w-[300px] overflow-y-auto"
          >
            <SheetHeader>
              <SheetTitle className="pt-0">Filter</SheetTitle>
              <SheetDescription>
                Filtere und Sortiere die eingegangenen Tickets.
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col px-4">
              <div className="font-semibold mb-2">Status:</div>
              {Object.values(TicketState).map((state) => {
                const isSelected = stateFilter.includes(state);
                return (
                  <Button
                    key={state}
                    variant={isSelected ? "secondary" : "outline"}
                    className="w-full flex items-center justify-start gap-2 mb-1"
                    onClick={() =>
                      setStateFilter((prev) =>
                        isSelected
                          ? prev.filter((s) => s !== state)
                          : [...prev, state]
                      )
                    }
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
                  </Button>
                );
              })}
            </div>

            <div className={'mt-4 px-4'}>
              <LabelSelection
                labels={labels}
                selectedLabels={labelFilter}
                setLabels={setLabelFilter}
              />
            </div>

            <div className="flex flex-col mt-4 px-4">
              <div className="font-semibold mb-2">Datum:</div>
              <DateRangeFilter
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                mobile={true}
              />
            </div>
            <div className="flex flex-col mt-4 px-4">
              <div className="font-semibold mb-2">Sortieren:</div>
              <div className="flex flex-row gap-1 mb-2">
                {["Erstellt", "Geändert", "Titel"].map((field) => (
                  <Button
                    key={field}
                    variant={sortField === field ? "secondary" : "outline"}
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => setSortField(field as typeof sortField)}
                  >
                    {field}
                  </Button>
                ))}
              </div>
              <div className="flex flex-row gap-1">
                <Button
                  variant={sortOrder === "asc" ? "secondary" : "outline"}
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => setSortOrder("asc")}
                >
                  Aufsteigend
                </Button>
                <Button
                  variant={sortOrder === "desc" ? "secondary" : "outline"}
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => setSortOrder("desc")}
                >
                  Absteigend
                </Button>
              </div>
            </div>
            <SheetFooter>
              <Button
                variant="outline"
                onClick={() => resetAllFilters()}
                data-cy="clear-labels"
              >
                <Trash2/>
                Filter löschen
              </Button>
              <SheetClose asChild>
                <Button variant="default">Schließen</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
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
                "text-white px-2 py-1 rounded mr-2 h-2",
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
      </div>
    </div>
  );
}
