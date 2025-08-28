"use client"

import React from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {ArrowDown, ArrowUp} from "lucide-react";
import {Command, CommandGroup, CommandItem} from "@/components/ui/command";
import {TicketSorting, TicketSortingField} from "@/app/tickets/page";

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
          className="w-[170px] justify-between items-center"
          data-cy="sort-button"
        >
          <span className="flex justify-center items-center">
            Sortieren: {props.sorting.field}{" "}
            {props.sorting.orderAscending ? (
              <ArrowUp className="inline h-4 w-4 ml-1"/>
            ) : (
              <ArrowDown className="inline h-4 w-4 ml-1"/>
            )}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[250px]">
        <Command>
          <CommandGroup heading="Feld">
            {["Erstellt", "Geändert", "Titel"].map((field) => (
              <CommandItem
                key={field}
                onSelect={() => props.setSorting(prevState => ({
                  ...prevState,
                  field: field as TicketSortingField,
                }))}
              >
                {field}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Reihenfolge">
            <CommandItem
              onSelect={() => props.setSorting(prevState => ({
                ...prevState,
                orderAscending: true
              }))}
              data-cy="sort-order-asc"
            >
              Aufsteigend
            </CommandItem>
            <CommandItem
              onSelect={() => props.setSorting(prevState => ({
                ...prevState,
                orderAscending: false
              }))}
              data-cy="sort-order-desc"
            >
              Absteigend
            </CommandItem>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}