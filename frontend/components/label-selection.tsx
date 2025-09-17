import {Label} from "@/lib/graph/generated/graphql";
import React from "react";
import {Button} from "@/components/ui/button";
import {Command, CommandGroup, CommandInput, CommandItem} from "@/components/ui/command";
import {Check, RotateCcw} from "lucide-react";
import {cn} from "@/lib/utils";
import LabelBadge from "@/components/label-badge";

interface LabelSelectionProps {
  labels: Label[];
  selectedLabels: Label[];
  setLabels: (labels: Label[]) => void;
}

export default function LabelSelection({labels, selectedLabels, setLabels}: LabelSelectionProps) {
  return (
    <Command>
      <CommandInput placeholder="Labels suchen..."/>
      <CommandGroup className={'max-h-[300px] overflow-y-auto'}>
        {labels.map((label) => {
          const isSelected = selectedLabels.map(l => l.id).includes(label.id);
          return (
            <CommandItem
              key={label.id}
              onSelect={() => {
                setLabels(
                  isSelected
                    ? selectedLabels.filter((l) => l.id !== label.id)
                    : [...selectedLabels, label]
                )
              }}
              className={'data-[selected=true]:!bg-accent/50 flex items-center'}
            >
              <Check className={cn("mr-2 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")}/>
              <div className={'flex-1 min-w-0'}>
                <LabelBadge label={label}/>
              </div>
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
  )
}