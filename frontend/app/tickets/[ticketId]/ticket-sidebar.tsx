"use client";

import {Input} from "@/components/ui/input";
import {Badge} from "@/components/ui/badge";
import {useRouter} from "next/navigation";
import {AllLabelsDocument, AllLabelsQuery, Label, Ticket, TicketState,} from "@/lib/graph/generated/graphql";
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
import {cn} from "@/lib/utils";
import {DateRangeFilter} from "@/components/date-range-filter";
import React, {useCallback, useEffect, useState} from "react";
import {getClient} from "@/lib/graph/client";
import {format} from "date-fns";

interface TicketSidebarProps {
  tickets: Ticket[];
  searchTerm: string;
  setSearchTermAction: (term: string) => void;
  selectedTicketId?: string;
}

export default function TicketSidebar({
                                        tickets,
                                        searchTerm,
                                        setSearchTermAction,
                                        selectedTicketId,
                                      }: TicketSidebarProps) {
  const router = useRouter();
  const [labels, setLabels] = useState<(Label | null)[]>([]);
  const [stateFilter, setStateFilter] = useState<string[]>([]);
  const [labelFilter, setLabelFilter] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [sortField, setSortField] = useState<
    "Erstellt" | "Geändert" | "Titel"
  >("Erstellt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [labelSearchTerm, setLabelSearchTerm] = useState("");

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
        ? ticket.labels?.some((label) => labelFilter.includes(label.id))
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

  const fetchAllLabels = useCallback(async () => {
    const client = getClient();
    const data = await client.request<AllLabelsQuery>(AllLabelsDocument);
    if (data.labels) {
      setLabels(data.labels);
    }
  }, []);

  useEffect(() => {
    void fetchAllLabels();
  }, [fetchAllLabels]);

  const resetAllFilters = () => {
    setSearchTermAction("");
    setStateFilter([]);
    setLabelFilter([]);
    setStartDate(null);
    setEndDate(null);
    setSortField("Erstellt");
    setSortOrder("asc");
    setLabelSearchTerm("");
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
            <Button variant="outline" data-cy="filter-button">
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

            <div className="flex flex-col mt-4 px-4">
              <div className="font-semibold mb-2">Labels:</div>
              <Input
                placeholder="Label suchen..."
                value={labelSearchTerm}
                onChange={(e) => setLabelSearchTerm(e.target.value)}
                className="mb-2"
              />
              <div className="flex flex-col max-h-[120px] overflow-y-auto">
                {labels
                  .filter((label) =>
                    label?.name
                      .toLowerCase()
                      .includes(labelSearchTerm.toLowerCase())
                  )
                  .map((label) => {
                    const isSelected = label?.id
                      ? labelFilter.includes(label.id)
                      : false;
                    return (
                      <Button
                        key={label?.id}
                        variant={isSelected ? "secondary" : "outline"}
                        className="w-full flex items-center justify-start gap-2 mb-1"
                        onClick={() => {
                          if (!label?.id) return;
                          setLabelFilter((prev) =>
                            isSelected
                              ? prev.filter((l) => l !== label?.id)
                              : [...prev, label.id]
                          );
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            isSelected ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {label?.name}
                      </Button>
                    );
                  })}
              </div>
              {labelFilter.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center mt-2"
                  onClick={() => setLabelFilter([])}
                  data-cy="clear-labels"
                >
                  <Trash2 className="mr-2"/> Filter löschen
                </Button>
              )}
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
              t.id === selectedTicketId ? "bg-accent" : "hover:bg-accent"
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
