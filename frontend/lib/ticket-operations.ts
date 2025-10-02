import {Ticket, TicketState} from "@/lib/graph/generated/graphql";
import {TicketFiltering, TicketSorting} from "@/components/providers/ticket-provider";

export function getTicketStateColor(state: TicketState): string {
  const stateVarMap: Record<TicketState, string> = {
    [TicketState.New]: "--ticketstate-new",
    [TicketState.Open]: "--ticketstate-open",
    [TicketState.Closed]: "--ticketstate-closed",
  };

  const cssVar = stateVarMap[state];

  const computedColor = getComputedStyle(document.documentElement)
    .getPropertyValue(cssVar)
    .trim();

  const temp = document.createElement("div");
  temp.style.color = computedColor;
  document.body.appendChild(temp);
  const rgb = getComputedStyle(temp).color;
  document.body.removeChild(temp);

  return rgbToHex(rgb);
}

export function getFilteredTickets(filter: TicketFiltering, tickets: Ticket[]) {
  return tickets.filter(ticket => {
    if (!ticket) return false;

    const filterSearch = filter.searchTerm.toLowerCase();
    const matchesTitleOrText =
      ticket.title.toLowerCase().includes(filterSearch) ||
      ticket.text.toLowerCase().includes(filterSearch);

    const matchesState =
      filter.state.length > 0 ? filter.state.includes(ticket.state) : true;

    const matchesLabel =
      filter.labels.length > 0
        ? ticket.labels?.some((label) => filter.labels.map(l => l.id).includes(label.id))
        : true;

    const matchesStartDate = filter.startDate ? new Date(ticket.createdAt) >= filter.startDate : true
    const matchesEndDate = filter.endDate ? new Date(ticket.createdAt) <= filter.endDate : true

    return matchesTitleOrText && matchesState && matchesLabel && matchesStartDate && matchesEndDate;
  });
}

export function getSortedTickets(sorting: TicketSorting, tickets: Ticket[]) {
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


function rgbToHex(rgb: string): string {
  const result = rgb
    .match(/\d+/g)
    ?.map((n) => parseInt(n, 10))
    .slice(0, 3);

  if (!result || result.length < 3) return "#000000";

  const [r, g, b] = result;
  return `#${((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1)}`;
}

