import {TicketFiltering, TicketSorting} from "@/app/tickets/page";
import React from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {Command, CommandGroup, CommandInput, CommandItem} from "@/components/ui/command";
import {TicketState} from "@/lib/graph/generated/graphql";
import {Check} from "lucide-react";
import LabelSelection from "@/components/label-selection";
import {DateRangeFilter} from "@/components/date-range-filter";
import SortingSelection from "@/app/tickets/sorting-selection";
import {useLabels} from "@/components/providers/label-provider";

interface FilterBarProps {
  filtering: TicketFiltering;
  setFiltering: React.Dispatch<React.SetStateAction<TicketFiltering>>;
  sorting: TicketSorting;
  setSorting: React.Dispatch<React.SetStateAction<TicketSorting>>;
  stateFilterSet: boolean;
  scrollable?: boolean;
}

export default function FilterBar(
  {filtering, setFiltering, sorting, setSorting, stateFilterSet, scrollable = false}: FilterBarProps) {
  const {labels} = useLabels()

  return (
    <div className={cn("flex gap-2", scrollable && "overflow-x-auto max-w-full h-13")}
         data-cy={'ticket-filter-bar'}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'max-w-[200px] justify-between',
              stateFilterSet && 'border !border-accent'
            )}
            data-cy="desktop-overview-button-status"
          >
            {filtering.state.length > 0
              ? `${filtering.state.length} Status`
              : "Status"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[170px]">
          <Command>
            <CommandInput placeholder="Status suchen..." data-cy={'desktop-overview-status-search'}/>
            <CommandGroup>
              {Object.values(TicketState).map((state) => {
                const isSelected = filtering.state.includes(state);
                return (
                  <CommandItem
                    key={state}
                    onSelect={() => {
                      setFiltering(prev => ({
                        ...prev,
                        state: isSelected
                          ? prev.state.filter((s) => s !== state)
                          : [...(prev.state), state]
                      }))
                    }}
                    data-cy={`desktop-overview-button-${state}`}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {state === TicketState.New
                      ? "Neu"
                      : state === TicketState.Open
                        ? "Offen"
                        : "Fertig"}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "max-w-[200px] justify-between",
              filtering.labels.length > 0 && 'border !border-accent'
            )}
            data-cy="desktop-overview-button-label">
            {filtering.labels.length > 0
              ? `${filtering.labels.length} Labels`
              : "Labels"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 max-w-[200px]">
          <LabelSelection
            labels={labels}
            selectedLabels={filtering.labels}
            setLabels={(labels) => setFiltering(prev => ({
              ...prev,
              labels: labels,
            }))}
          />
        </PopoverContent>
      </Popover>
      <DateRangeFilter
        startDate={filtering.startDate}
        setStartDate={(date) => setFiltering(prev => ({...prev, startDate: date}))}
        endDate={filtering.endDate}
        setEndDate={(date) => setFiltering(prev => ({...prev, endDate: date}))}
      />
      <SortingSelection setSorting={setSorting} sorting={sorting}/>
    </div>

  )
}