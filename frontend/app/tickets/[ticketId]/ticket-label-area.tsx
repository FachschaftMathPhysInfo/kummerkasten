"use client"

import {Label} from "@/lib/graph/generated/graphql";
import React, {useEffect} from "react";
import {Check, Save, Settings} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Command, CommandGroup, CommandInput, CommandItem} from "@/components/ui/command";
import {cn} from "@/lib/utils";
import {useLabels} from "@/components/providers/label-provider";
import LabelBadge from "@/components/label-badge";


interface TicketLabelAreaProps {
  ticketLabels: Label[]
  setTicketLabelsAction: (labels: Label[]) => void;
}

export default function TicketLabelArea({ticketLabels, setTicketLabelsAction}: TicketLabelAreaProps) {
  const [editMode, setEditMode] = React.useState(false);
  const {labels} = useLabels();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedLabels, setSelectedLabels] = React.useState<Label[]>(ticketLabels);

  useEffect(() => {
    setSelectedLabels(ticketLabels);
    // This is for the inital ticketLabels mounting with [] and then updating. Length changes are sufficient here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketLabels.length]);


  function handleSave() {
    setTicketLabelsAction(selectedLabels)
    setEditMode(false)
  }

  return (
    <div className={'text-muted-foreground flex flex-col gap-2'}>
      <div className={'w-full px-5'}>
        <Button
          variant={"ghost"}
          onClick={() => setEditMode(!editMode)}
          className="w-full flex items-center justify-between">
          <p>Labels</p>
          <Settings size={18} className={'stroke-muted-foreground'}/>
        </Button>
      </div>
      {editMode ? (
        <Command>
          <CommandInput placeholder="Labels suchen..." onValueChange={setSearchTerm}/>
          <CommandGroup className={'max-h-[300px] overflow-y-auto'}>
            {labels
              .filter((label) => label && label.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((label) => {
                if (!label) return null;
                const isSelected = selectedLabels.map(l => l.id).includes(label.id);
                return (
                  <CommandItem
                    key={label.id}
                    onSelect={() => {
                      setSelectedLabels(
                        isSelected
                          ? selectedLabels.filter((l) => l.id !== label.id)
                          : [...(selectedLabels ?? []), label]
                      );
                    }}
                    className={'data-[selected=true]:!bg-accent/50'}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {label.name}
                  </CommandItem>
                );
              })}
          </CommandGroup>
          <Button onClick={handleSave} variant={'secondary'}>
            <Save className={'mr-2'}/>
            Speichern
          </Button>
        </Command>
      ) : (
        <div className="flex flex-col gap-2 overflow-y-scroll grow items-end px-10">
          {ticketLabels.map(label => (<LabelBadge key={label.id} label={label} />))}
        </div>
      )}
    </div>
  )
}