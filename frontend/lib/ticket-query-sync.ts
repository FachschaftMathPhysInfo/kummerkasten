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

  useEffect(() => {
    const startDate = filtering.startDate
    // else it is 00:00 and gets reset to the day before when removing the timezone (if its not UTM)
    if (startDate) startDate.setHours(11, 55)
    void setFromUrlQuery(filtering.startDate);
    }, [filtering.startDate, setFromUrlQuery]);

  useEffect(() => {
    const endDate = filtering.endDate;
    // else it is 00:00 and gets reset to the day before when removing the timezone (if its not UTM)
    if (endDate) endDate.setHours(11, 55)
    void setToUrlQuery(endDate);
    }, [filtering.endDate, setToUrlQuery]);

  useEffect(() => {
    void setOrderUrlQuery(sorting.orderAscending ? null : true);
  }, [sorting.orderAscending, setOrderUrlQuery]);

  useEffect(() => {
    if (sorting.field === "Geändert") void setSortUrlQuery(null)
    else void setSortUrlQuery(sorting.field);
  }, [sorting.field, setSortUrlQuery]);

  return { initialized };
}