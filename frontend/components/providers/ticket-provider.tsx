"use client"

import React, {createContext, ReactNode, SetStateAction, useContext, useEffect, useState} from "react";
import {
  AddLabelsToTicketDocument,
  AllTicketsDocument,
  DeleteTicketDocument, Label,
  LabelToTicketAssignment,
  RemoveLabelsFromTicketDocument,
  Ticket, TicketState,
  UpdateTicket,
  UpdateTicketDocument
} from "@/lib/graph/generated/graphql";
import {getClient} from "@/lib/graph/client";
import {defaultTicketFiltering, defaultTicketSorting} from "@/lib/graph/defaultTypes";
import {compareStringSets} from "@/lib/utils";
import {parseAsBoolean, parseAsIsoDate, parseAsStringLiteral, useQueryState} from "nuqs";


export type TicketSorting = {
  field: TicketSortingField,
  orderAscending: boolean
}

export type TicketSortingField = "Erstellt" | "Geändert" | "Titel"
const sortOrderValues = ['Erstellt', 'Geändert', "Titel"] as const

export type TicketFiltering = {
  searchTerm: string;
  state: TicketState[];
  labels: Label[];
  startDate: Date | null;
  endDate: Date | null;
}

interface TicketsContextType {
  tickets: Ticket[];
  filtering: TicketFiltering
  stateFilterSet: boolean
  areFiltersSet: boolean
  sorting: TicketSorting
  updateTicket: (id: string, ticket: UpdateTicket) => Promise<string | null>
  deleteTickets: (ids: string[]) => Promise<string | null>
  addLabelsToTicket: (ticketID: string, labelIDs: string[]) => Promise<string | null>
  removeLabelsFromTicket: (ticketID: string, labelIDs: string[]) => Promise<string | null>
  triggerTicketRefetch: () => void;
  setFiltering: React.Dispatch<SetStateAction<TicketFiltering>>
  setSorting: React.Dispatch<SetStateAction<TicketSorting>>
}

const TicketsContext = createContext<TicketsContextType | null>(null);

export function TicketsProvider({children}: { children: ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [refetchKey, setRefetchKey] = useState(false);
  const [sorting, setSorting] = useState(defaultTicketSorting);
  const [filtering, setFiltering] = useState(defaultTicketFiltering);
  const [stateFilterSet, setStateFilterSet] = useState(false)
  const [areFiltersSet, setAreFiltersSet] = useState(false)

  const [searchUrlQuery, setSearchUrlQuery] = useQueryState('q');
  const [fromUrlQuery, setFromUrlQuery] = useQueryState('from', parseAsIsoDate);
  const [toUrlQuery, setToUrlQuery] = useQueryState('to', parseAsIsoDate);
  const [orderUrlQuery, setOrderUrlQuery] = useQueryState('desc', parseAsBoolean);
  const [sortUrlQuery, setSortUrlQuery] = useQueryState('s', parseAsStringLiteral(sortOrderValues).withDefault("Geändert"));
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      const client = getClient()
      const data = await client.request(AllTicketsDocument)

      const newTickets: Ticket[] = data.tickets?.filter(ticket => !!ticket).map(ticket => ({
        ...ticket,
        labels: ticket.labels?.map(label => ({...label})),
        // DB returns a timestamp which ts cannot compare directly
        createdAt: new Date(ticket.createdAt),
        lastModified: new Date(ticket.lastModified),
      })) ?? []

      setTickets(newTickets);
    }
    void fetchTickets();
  }, [refetchKey]);

  useEffect(() => {
    const originalState = new Set(defaultTicketFiltering.state)
    const currentState = new Set(filtering.state)
    setStateFilterSet(!compareStringSets(originalState, currentState))
    // We can't add the expected stateFilter as array dependency, as it will change size
    // and thus throw an error
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtering.state.length]);

  useEffect(() => {
    setAreFiltersSet(
      stateFilterSet ||
      filtering.labels.length > 0 ||
      !!filtering.startDate ||
      !!filtering.endDate
    )
  }, [stateFilterSet, filtering.labels.length, filtering.startDate, filtering.endDate]);

  useEffect(() => {
    if (initialized) return

    setFiltering(prevState => ({
      ...prevState,
      searchTerm: searchUrlQuery ?? "",
      startDate: fromUrlQuery ? new Date(fromUrlQuery) : null,
      endDate: toUrlQuery ? new Date(toUrlQuery) : null,
    }))

    setSorting({
      field: sortUrlQuery as TicketSortingField,
      orderAscending: orderUrlQuery ? !orderUrlQuery : true,
    })

    setInitialized(true);
  }, [fromUrlQuery, initialized, searchUrlQuery, toUrlQuery, orderUrlQuery, sortUrlQuery])

  useEffect(() => {
    if (filtering.searchTerm === "") {
      void setSearchUrlQuery(null)
    } else {
      void setSearchUrlQuery(filtering.searchTerm);
    }
  }, [filtering.searchTerm, setSearchUrlQuery])

  useEffect(() => { void setFromUrlQuery(filtering.startDate) }, [filtering.startDate, setFromUrlQuery]);

  useEffect(() => { void setToUrlQuery(filtering.endDate) }, [filtering.endDate, setToUrlQuery]);

  useEffect(() => {
    if (sorting.orderAscending) void setOrderUrlQuery(null)
    else void setOrderUrlQuery(true)
  }, [setOrderUrlQuery, sorting.orderAscending]);

  useEffect(() => {void setSortUrlQuery(sorting.field)}, [setSortUrlQuery, sorting.field]);

  function triggerTicketRefetch() {
    setRefetchKey(!refetchKey);
  }


  async function updateTicket(id: string, ticket: UpdateTicket) {
    const client = getClient()

    try {
      await client.request(UpdateTicketDocument, {id, ticket})
      return null
    } catch (e) {
      return String(e)
    } finally {
      triggerTicketRefetch()
    }
  }

  async function deleteTickets(ids: string[]) {
    const client = getClient()

    try {
      await client.request(DeleteTicketDocument, {ids})
      return null
    } catch (e) {
      return String(e)
    } finally {
      triggerTicketRefetch()
    }
  }

  async function addLabelsToTicket(ticketID: string, labelsIDs: string[]) {
    if (!(labelsIDs.length > 0)) return null

    const client = getClient()
    const assignments: LabelToTicketAssignment[] = labelsIDs.map(labelID => ({
      labelID: labelID,
      ticketID: ticketID
    }))

    try {
      await client.request(AddLabelsToTicketDocument, {assignments})
      return null
    } catch (e) {
      return String(e)
    } finally {
      triggerTicketRefetch()
    }
  }

  async function removeLabelsFromTicket(ticketID: string, labelsIDs: string[]) {
    if (!(labelsIDs.length > 0)) return null

    const client = getClient()
    const assignments: LabelToTicketAssignment[] = labelsIDs.map(labelID => ({
      labelID: labelID,
      ticketID: ticketID
    }))

    try {
      await client.request(RemoveLabelsFromTicketDocument, {assignments})
      return null
    } catch (e) {
      return String(e)
    } finally {
      triggerTicketRefetch()
    }
  }

  return (
    <TicketsContext.Provider
      value={{
        tickets,
        filtering,
        stateFilterSet,
        areFiltersSet,
        sorting,
        updateTicket,
        deleteTickets,
        addLabelsToTicket,
        removeLabelsFromTicket,
        triggerTicketRefetch,
        setFiltering,
        setSorting
      }}>
      {children}
    </TicketsContext.Provider>
  );
}

export const useTickets = (): TicketsContextType => {
  const context = useContext(TicketsContext);

  if (!context) {
    throw new Error("useTickets must be used within a TicketsProvider");
  }

  return context;
}