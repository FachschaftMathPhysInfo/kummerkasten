import {Ticket} from "@/lib/graph/generated/graphql";
import {TicketSorting} from "@/app/tickets/page";

export function sortTickets(sorting: TicketSorting, tickets: Ticket[]) {
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

export function getCurrentSemesterTickets(tickets: Ticket[]) {
  const now = new Date();
  const year = now.getFullYear();
  let startOfThisSemester: Date;

  if (now.getMonth() + 1 >= 10) {
    startOfThisSemester = new Date(year, 9, 1);
  } else if (now.getMonth() + 1 >= 4) {
    startOfThisSemester = new Date(year, 3, 1);
  } else {
    startOfThisSemester = new Date(year - 1, 9, 1);
  }

  return tickets.filter(ticket => ticket.createdAt >= startOfThisSemester)
}

export function getOlderSemesterTickets(tickets: Ticket[]) {
  const currentSemesterTickets = getCurrentSemesterTickets(tickets);
  return tickets.filter(ticket => !currentSemesterTickets.includes(ticket));
}
