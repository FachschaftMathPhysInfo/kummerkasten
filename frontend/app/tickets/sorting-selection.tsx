"use client"

import React from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {ArrowDown, ArrowUp} from "lucide-react";
import {Command, CommandGroup, CommandItem} from "@/components/ui/command";
import {TicketSorting, TicketSortingField} from "@/app/tickets/page";
import {cn} from "@/lib/utils";

interface SortingSelectionProps {
  setSorting: React.Dispatch<React.SetStateAction<TicketSorting>>;
  sorting: TicketSorting;
}

export default function SortingSelection(props: SortingSelectionProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="justify-between items-center"
          data-cy="sort-button"
        >
          <span className="flex justify-center items-center">
            {props.sorting.field}{" "}
            {props.sorting.orderAscending ? (
              <ArrowUp className="inline h-4 w-4 ml-1"/>
            ) : (
              <ArrowDown className="inline h-4 w-4 ml-1"/>
            )}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[170px]">
        <Command>
          <CommandGroup>
            {["Erstellt", "Geändert", "Titel"].map((field) => (
              <CommandItem
                key={field}
                className={cn(
                  props.sorting.field === field
                    ? 'bg-accent/50 hover:!bg-accent/70'
                    : 'data-[selected=true]:!bg-muted-foreground/10'
                )}
                onSelect={() => props.setSorting(prevState => ({
                  field: field as TicketSortingField,
                  orderAscending: !prevState.orderAscending
                }))}
              >
                {field}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}