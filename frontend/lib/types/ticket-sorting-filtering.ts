import {Label, TicketState} from "@/lib/graph/generated/graphql";

export type TicketSorting = {
  field: TicketSortingField,
  orderAscending: boolean
}

export const SORT_FIELDS = ["Erstellt", "Geändert", "Titel"] as const;

export type TicketSortingField = (typeof SORT_FIELDS)[number];

export type TicketFiltering = {
  searchTerm: string;
  state: TicketState[];
  labels: Label[];
  startDate: Date | null;
  endDate: Date | null;
}