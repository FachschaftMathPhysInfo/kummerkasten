"use client"

import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {
  AddLabelsToTicketDocument,
  AllTicketsDocument,
  DeleteTicketDocument,
  LabelToTicketAssignment,
  RemoveLabelsFromTicketDocument,
  Ticket,
  UpdateTicket,
  UpdateTicketDocument
} from "@/lib/graph/generated/graphql";
import {getClient} from "@/lib/graph/client";

interface TicketsContextType {
  tickets: Ticket[];
  updateTicket: (id: string, ticket: UpdateTicket) => Promise<string | null>
  deleteTickets: (ids: string[]) => Promise<string | null>
  addLabelsToTicket: (ticketID: string, labelIDs: string[]) => Promise<string | null>
  removeLabelsFromTicket: (ticketID: string, labelIDs: string[]) => Promise<string | null>
  triggerTicketRefetch: () => void;
}

const TicketsContext = createContext<TicketsContextType | null>(null);

export function TicketsProvider({children}: { children: ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [refetchKey, setRefetchKey] = useState(false);

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
    }
  }

  async function deleteTickets(ids: string[]) {
    const client = getClient()

    try {
      await client.request(DeleteTicketDocument, {ids})
      return null
    } catch (e) {
      return String(e)
    }
  }

  async function addLabelsToTicket(ticketID: string, labelsIDs: string[]) {
    if(!(labelsIDs.length > 0)) return null

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
    }
  }

  async function removeLabelsFromTicket(ticketID: string, labelsIDs: string[]) {
    if(!(labelsIDs.length > 0)) return null

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
    }
  }

  return (
    <TicketsContext.Provider
      value={{tickets, updateTicket, deleteTickets, addLabelsToTicket, removeLabelsFromTicket, triggerTicketRefetch}}>
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