import {Check, Trash2} from "lucide-react";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {TicketState} from "@/lib/graph/generated/graphql";
import {cn} from "@/lib/utils";
import LabelBadge from "../../components/label-badge";
import {DateRangeFilter} from "@/components/date-range-filter";
import React, {useState} from "react";
import {useTickets} from "@/components/providers/ticket-provider";
import {Input} from "@/components/ui/input";
import {useLabels} from "@/components/providers/label-provider";
import {useTranslations} from "next-intl";
import {TicketSortingField} from "@/lib/types/ticket-sorting-filtering";

export default function MobileFilterSheet() {
  const t = useTranslations("TicketPage.MobileFilterSheet");
  const tc = useTranslations("Commons")
  const {labels} = useLabels()
  const [showFilters, setShowFilters] = useState(false);
  const [showLabelFilters, setShowLabelFilters] = useState(false);
  const [labelSearchTerm, setLabelSearchTerm] = useState("");
  const [showSort, setShowSort] = useState(false);
  const {filtering, setFiltering, sorting, setSorting, areFiltersSet} = useTickets()


  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className={cn(areFiltersSet && 'border !border-accent')}
          data-cy="mobile-filter-button">
          {tc("words.filter")}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[85%] sm:w-[400px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{tc("words.filter")}</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col mt-0 px-4">
          <div className="flex flex-row gap-2 justify-between">
            <div className="font-semibold">Status:</div>
            <Button variant="outline" className="w-fit justify-between"
                    onClick={() => setShowFilters((prev) => !prev)}>
              {filtering.state.length > 0
                ? tc("buttons.ticketSorting.nonEmpty", {length: filtering.state.length})
                : tc("buttons.stateSorting.empty")}
            </Button>
          </div>
          {showFilters && (
            <div className="mt-2 overflow-hidden">
              {Object.values(TicketState).map((state) => {
                const isSelected = filtering.state.includes(state);
                return (
                  <Button
                    key={state}
                    variant={isSelected ? "secondary" : "outline"}
                    className="w-full flex items-center justify-start gap-2"
                    onClick={() =>
                      setFiltering(prev => ({
                        ...prev,
                        state: isSelected
                          ? prev.state.filter((s) => s !== state)
                          : [...prev.state, state]
                      }))
                    }
                  >
                    <Check
                      className={cn("mr-2", isSelected ? "opacity-100" : "opacity-0")}
                    />
                    {state === TicketState.New ? tc("ticketStates.new")
                      : state === TicketState.Open ? tc("ticketStates.open")
                        : tc("ticketStates.done")}
                  </Button>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex flex-col mt-4">
          <div className="flex flex-row gap-2 px-4 justify-between">
            <div className="font-semibold mt-1">{tc("words.labels")}:</div>
            <Button
              variant="outline"
              className="w-fit justify-between"
              onClick={() => setShowLabelFilters((prev) => !prev)}
            >
              {filtering.labels.length > 0
                ? tc("buttons.labelFiltering.nonEmpty", {length: filtering.labels.length})
                : tc("buttons.labelFiltering.empty")}
            </Button>
          </div>
          {showLabelFilters && (
            <div className="mt-2 px-4">
              <div className="overflow-hidden max-h-[150px] overflow-y-auto">
                <Input
                  placeholder={t("searchbar.placeholder")}
                  value={labelSearchTerm}
                  onChange={(e) => setLabelSearchTerm(e.target.value)}
                  className="w-full mb-2"
                />
                {labels
                  .filter((label) =>
                    label?.name.toLowerCase().includes(labelSearchTerm.toLowerCase())
                  )
                  // for some reason, using it with && in the upper filter does not work...
                  .filter((label) => !!label)
                  .map((label) => {
                    const isSelected = label.id
                      ? filtering.labels.map(l => l.id).includes(label.id)
                      : false;

                    return (
                      <Button
                        key={label.id}
                        variant={"ghost"}
                        className="w-full flex items-center justify-start gap-2"
                        onClick={() => {
                          setFiltering(prev => ({
                            ...prev,
                            labels: isSelected
                              ? prev.labels.filter((l) => l.id !== label?.id)
                              : [...prev.labels, label]
                          }))
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            isSelected ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <LabelBadge label={label}/>
                      </Button>
                    );
                  })}
                {filtering.labels.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-center mt-2"
                    onClick={() =>
                      setFiltering(prev => ({
                        ...prev,
                        labels: []
                      }))
                    }
                    data-cy="clear-labels"
                  >
                    <Trash2 className="mr-2 text-destructive"/> {tc("buttons.resetFilters")}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col mt-4 px-4">
          <div className="flex flex-col gap-2">
            <div className="font-semibold mt-1 mb-1">{tc("words.date")}:</div>
            <DateRangeFilter
              startDate={filtering.startDate}
              setStartDate={(date) => setFiltering(prev => ({...prev, startDate: date}))}
              endDate={filtering.endDate}
              setEndDate={(date) => setFiltering(prev => ({...prev, startDate: date}))}
              mobile={true}
            />
          </div>
        </div>
        <div className="flex flex-col mt-4 px-4">
          <div className="flex flex-row gap-2 justify-between items-center">
            <div className="font-semibold mt-1 mb-1">{tc("words.sort")}:</div>
            <Button
              variant="outline"
              size="sm"
              className="w-fit justify-between text-sm"
              onClick={() => setShowSort((prev) => !prev)}
            >
              {sorting.field === "Geändert"
                ? tc("ticketSortingFields.modified")
                : sorting.field === "Erstellt"
                  ? tc("ticketSortingFields.created")
                  : tc("ticketSortingFields.title")
              }
              {sorting.orderAscending ? "↑" : "↓"}
            </Button>
          </div>
          {showSort && (
            <div className="mt-1 border rounded-md overflow-hidden mb-4">
              <div className="flex flex-col p-1 gap-1">
                <div className="text-xs">Feld</div>
                <div className="flex flex-row gap-1 flex-wrap">
                  {["Erstellt", "Geändert", "Titel"].map((field) => (
                    <Button
                      key={field}
                      variant={sorting.field === field ? "secondary" : "outline"}
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => setSorting(prevState => ({
                        ...prevState,
                        field: field as TicketSortingField
                      }))}
                    >
                      {field}
                    </Button>
                  ))}
                </div>
                <div className="text-xs mt-1">{tc("words.order")}</div>
                <div className="flex flex-row gap-1">
                  <Button
                    variant={sorting.orderAscending ? "secondary" : "outline"}
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => setSorting(prevState => ({
                      ...prevState,
                      orderAscending: true
                    }))}
                  >
                    {tc("words.ascending")}
                  </Button>
                  <Button
                    variant={sorting.orderAscending ? "outline" : "secondary"}
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => setSorting(prevState => ({
                      ...prevState,
                      orderAscending: false
                    }))}
                  >
                    {tc("words.descending")}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}