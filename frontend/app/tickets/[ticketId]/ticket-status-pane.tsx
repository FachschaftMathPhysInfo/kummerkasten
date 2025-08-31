"use client";

import {Button} from "@/components/ui/button";
import {MoreVertical, Trash2} from "lucide-react";
import {
  AddLabelsToTicketDocument,
  AddLabelsToTicketMutation,
  Label,
  LabelToTicketAssignment,
  RemoveLabelsFromTicketDocument,
  RemoveLabelsFromTicketMutation,
  Ticket
} from "@/lib/graph/generated/graphql";
import React, {useEffect} from "react";
import {TicketDialogState} from "@/app/tickets/page";
import {toast} from "sonner";
import {Sheet, SheetContent, SheetFooter, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {VisuallyHidden} from "@radix-ui/react-visually-hidden";
import {useSidebar} from "@/components/ui/sidebar";
import TicketLabelArea from "@/app/tickets/[ticketId]/ticket-label-area";
import TicketInfoArea from "@/app/tickets/[ticketId]/ticket-info-area";
import TicketActionsBar from "@/app/tickets/[ticketId]/ticket-action-bar";
import {getClient} from "@/lib/graph/client";

interface TicketStatusPaneProps {
  ticket: Ticket | null;
  initialTicketLabels: Label[];
  setDialogStateAction: React.Dispatch<React.SetStateAction<TicketDialogState>>;
}

export default function TicketStatusPane({ticket, initialTicketLabels, setDialogStateAction}: TicketStatusPaneProps) {
  const {isMobile} = useSidebar()
  const [ticketLabels, setTicketLabels] = React.useState<Label[]>(initialTicketLabels)

  useEffect(() => setTicketLabels(initialTicketLabels), [initialTicketLabels.length])

  console.log('Initial: initialTicketLabels', initialTicketLabels)
  console.log('ticketLabels:', ticketLabels)

  const copyCurrentUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link kopiert!");
    } catch {
      toast.error("Kopieren fehlgeschlagen");
    }
  };

  const handleLabelsChange = async (labels: Label[]) => {
    if (!ticket) return;

    const ticketsToRemove: LabelToTicketAssignment[] = ticketLabels
      .filter(ticketLabel => !labels.map(l => l.id).includes(ticketLabel.id))
      .map(ticketLabel => ({
        ticketID: ticket.id,
        labelID: ticketLabel.id
      }))

    const ticketsToAdd: LabelToTicketAssignment[] = labels
      .filter(label => !ticketLabels.map(l => l.id).includes(label.id))
      .map(label => ({
        ticketID: ticket.id,
        labelID: label.id
      }))

    if (ticketsToAdd.length === 0 && ticketsToRemove.length === 0) return;

    try {
      const client = getClient();
      if (ticketsToAdd.length > 0) {
        await client.request<RemoveLabelsFromTicketMutation>(RemoveLabelsFromTicketDocument,
          {assignments: ticketsToRemove}
        )
      }

      if(ticketsToRemove.length > 0) {
        await client.request<AddLabelsToTicketMutation>(AddLabelsToTicketDocument,
          {assignments: ticketsToAdd}
        )
      }



    } catch (err) {
      toast.error("Fehler beim Aktualisieren der Labels")
      console.error(err);
    } finally {
      setTicketLabels(labels);
    }
  }

  if (!ticket) return null;

  return isMobile ?
    (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" data-cy="mobile-filter-button"><MoreVertical/></Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[85%] overflow-y-auto px-10 pt-15 gap-10 [&>button]:hidden">
          <VisuallyHidden>
            <SheetTitle>Ticket Detail Bereich</SheetTitle>
          </VisuallyHidden>

          <TicketActionsBar
            copyCurrentUrl={copyCurrentUrl}
            ticket={ticket}
            setDialogStateAction={setDialogStateAction}
          />

          <TicketInfoArea
            state={ticket.state}
            createdAt={new Date(ticket.createdAt)}
            lastModified={new Date(ticket.lastModified)}
          />

          {ticketLabels && <TicketLabelArea ticketLabels={ticketLabels} setTicketLabelsAction={handleLabelsChange}/>}
          <SheetFooter>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    ) : (
      <div className={'flex flex-col w-[250px] py-5 gap-2 justify-between'}>
        <div className={'flex flex-col grow w-full gap-2'}>
          <TicketInfoArea
            state={ticket.state}
            createdAt={new Date(ticket.createdAt)}
            lastModified={new Date(ticket.lastModified)}
          />

          {ticketLabels &&
            <TicketLabelArea
              ticketLabels={ticketLabels}
              setTicketLabelsAction={(labels) => void handleLabelsChange(labels)}
            />
          }
        </div>

        <div className={'flex items-center justify-end w-full px-10'}>
          <Button
            variant={"outline"}
            className={'!border-destructive aspect-square'}
            onClick={() => setDialogStateAction({
              mode: "delete",
              currentTicket: ticket
            })}>
            <Trash2 className={'stroke-destructive'}/>
          </Button>
        </div>
      </div>
    )
}
