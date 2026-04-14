import {Label, TicketState} from "@/lib/graph/generated/graphql";
import {SORT_FIELDS} from "@/lib/constants/ticket-fields";

export type TicketSorting = {
  field: TicketSortingField,
  orderAscending: boolean
}

export type TicketSortingField = (typeof SORT_FIELDS)[number];

export type TicketFiltering = {
  searchTerm: string;
  state: TicketState[];
  labels: Label[];
  startDate: Date | null;
  endDate: Date | null;
}