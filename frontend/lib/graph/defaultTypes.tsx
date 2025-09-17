import {Label, TicketState, User, UserRole} from "@/lib/graph/generated/graphql";
import {TicketFiltering, TicketSorting} from "@/app/tickets/page";

const now = new Date()

export const defaultUser: User = {
  firstname: 'Maxi',
  lastname: 'Musterperson',
  id: "invalid ID",
  lastLogin: now,
  lastModified: now,
  createdAt: now,
  mail: 'max.musterperson@mail.com',
  role: UserRole.User,
  password: 'invalid',
}

export const defaultLabel: Label = {
  id: "invalid ID",
  name: "default name",
  color: "#7a7777"
}

export const defaultTicketFiltering: TicketFiltering = {
  searchTerm: "",
  state: [TicketState.New, TicketState.Open],
  labels: [],
  startDate: null,
  endDate: null,
}

export const defaultTicketSorting: TicketSorting = {
  field: "Erstellt",
  orderAscending: true,
}
