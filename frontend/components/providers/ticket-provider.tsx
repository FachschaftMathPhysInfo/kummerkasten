"use client"

import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {AllTicketsDocument, Ticket} from "@/lib/graph/generated/graphql";
import {getClient} from "@/lib/graph/client";

interface TicketsContextType {
  tickets: Ticket[];
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

      setTickets(
        data.tickets?.filter(ticket => !!ticket)
          .map(ticket => ({
            ...ticket,
            labels: ticket.labels?.map(label => ({...label})) ?? []
          })) ?? []
      );
    }
    void fetchTickets();
  }, [refetchKey]);

  function triggerTicketRefetch() {
    setRefetchKey(!refetchKey);
  }


  return (
    <TicketsContext.Provider value={{tickets, triggerTicketRefetch}}>
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