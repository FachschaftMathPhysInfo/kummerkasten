import React from "react";
import {TicketsProvider} from "@/components/providers/ticket-provider";
import {LabelProvider} from "@/components/providers/label-provider";

export default function TicketLayout({children}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TicketsProvider>
      <LabelProvider>
        {children}
      </LabelProvider>
    </TicketsProvider>
  )
}