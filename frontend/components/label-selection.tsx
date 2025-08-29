import {Label} from "@/lib/graph/generated/graphql";
import React from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {Command, CommandGroup, CommandInput, CommandItem} from "@/components/ui/command";
import {Check, RotateCcw} from "lucide-react";
import {cn} from "@/lib/utils";
import LabelBadge from "@/components/label-badge";

// Modal is not yet used, but will be important for the mobile sheet view
interface LabelSelectionProps {
  modal?: boolean;
  labels: Label[];
  setLabels: React.Dispatch<React.SetStateAction<Label[]>>;
}

export default function LabelSelection({labels, setLabels}: LabelSelectionProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="max-w-[200px] justify-between"
          data-cy="button-label"
        >
          {labels.length > 0
            ? `${labels.length} Labels`
            : "Labels"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[250px]">
        <Command>
          <CommandInput placeholder="Labels suchen..."/>
          <CommandGroup>
            {labels.map((label) => {
              const isSelected = labels.includes(label);
              return (
                <CommandItem
                  key={label.id}
                  onSelect={() => {
                    setLabels((prev) =>
                      isSelected
                        ? prev.filter((l) => l.id !== label.id)
                        : [...(prev ?? []), label]
                    )
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")}/>
                  <LabelBadge label={label}/>
                </CommandItem>
              );
            })}
          </CommandGroup>
          {labels.length > 0 && (
            <div className="p-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-center"
                onClick={() => setLabels([])}
                data-cy="clear-labels"
              >
                <RotateCcw/>
                Zurücksetzen
              </Button>
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}