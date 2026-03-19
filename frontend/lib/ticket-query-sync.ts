import { parseAsBoolean, parseAsIsoDate, parseAsStringLiteral, useQueryState } from "nuqs";
import React, { useEffect, useState } from "react";
import {SORT_FIELDS, TicketFiltering, TicketSorting, TicketSortingField} from "@/components/providers/ticket-provider";


export function useTicketUrlSync(
  filtering: TicketFiltering,
  setFiltering: React.Dispatch<React.SetStateAction<TicketFiltering>>,
  sorting: TicketSorting,
  setSorting: React.Dispatch<React.SetStateAction<TicketSorting>>
) {
  const [searchUrlQuery, setSearchUrlQuery] = useQueryState('q');
  const [fromUrlQuery, setFromUrlQuery] = useQueryState('from', parseAsIsoDate);
  const [toUrlQuery, setToUrlQuery] = useQueryState('to', parseAsIsoDate);
  const [orderUrlQuery, setOrderUrlQuery] = useQueryState('desc', parseAsBoolean);
  const [sortUrlQuery, setSortUrlQuery] = useQueryState('s', parseAsStringLiteral(SORT_FIELDS).withDefault("Geändert"));

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized) return;

    setFiltering(prev => ({
      ...prev,
      searchTerm: searchUrlQuery ?? "",
      startDate: fromUrlQuery,
      endDate: toUrlQuery,
    }));

    setSorting({
      field: sortUrlQuery as TicketSortingField,
      orderAscending: !orderUrlQuery,
    });

    setInitialized(true);
  }, [fromUrlQuery, initialized, searchUrlQuery, toUrlQuery, orderUrlQuery, sortUrlQuery, setFiltering, setSorting]);

  useEffect(() => {
    void setSearchUrlQuery(filtering.searchTerm || null);
  }, [filtering.searchTerm, setSearchUrlQuery]);

  useEffect(() => { void setFromUrlQuery(filtering.startDate); }, [filtering.startDate, setFromUrlQuery]);
  useEffect(() => { void setToUrlQuery(filtering.endDate); }, [filtering.endDate, setToUrlQuery]);

  useEffect(() => {
    void setOrderUrlQuery(sorting.orderAscending ? null : true);
  }, [sorting.orderAscending, setOrderUrlQuery]);

  useEffect(() => {
    void setSortUrlQuery(sorting.field);
  }, [sorting.field, setSortUrlQuery]);

  return { initialized };
}