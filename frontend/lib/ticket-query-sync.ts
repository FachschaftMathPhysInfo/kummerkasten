import {parseAsBoolean, parseAsIsoDate, parseAsStringLiteral, useQueryState} from "nuqs";
import {useEffect} from "react";
import {SORT_FIELDS, TicketFiltering, TicketSorting} from "@/components/providers/ticket-provider";


export function useTicketUrlSync(
  filtering: TicketFiltering,
  sorting: TicketSorting,
) {
  const [, setSearchUrlQuery] = useQueryState('q');
  const [, setFromUrlQuery] = useQueryState('from', parseAsIsoDate);
  const [, setToUrlQuery] = useQueryState('to', parseAsIsoDate);
  const [, setOrderUrlQuery] = useQueryState('desc', parseAsBoolean);
  const [, setSortUrlQuery] = useQueryState('s', parseAsStringLiteral(SORT_FIELDS).withDefault("Geändert"));

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
}