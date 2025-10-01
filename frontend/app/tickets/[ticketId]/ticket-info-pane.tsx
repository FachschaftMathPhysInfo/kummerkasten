"use client";

import {Button} from "@/components/ui/button";
import {Info, Trash2} from "lucide-react";
import {
  AddLabelsToTicketDocument,
  AddLabelsToTicketMutation,
  Label,
  LabelToTicketAssignment,
  RemoveLabelsFromTicketDocument,
  RemoveLabelsFromTicketMutation,
  Ticket,
  TicketState,
  UpdateTicketStateDocument,
  UpdateTicketStateMutation,
  UserRole
} from "@/lib/graph/generated/graphql";
import React, {useEffect} from "react";
import {TicketDialogState} from "@/app/tickets/page";
import {toast} from "sonner";
import {Sheet, SheetContent, SheetFooter, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {VisuallyHidden} from "@radix-ui/react-visually-hidden";
import {useSidebar} from "@/components/ui/sidebar";
import TicketLabelArea from "@/app/tickets/[ticketId]/ticket-label-area";
import TicketMetaDataArea from "@/app/tickets/[ticketId]/ticket-metadata-area";
import TicketActionsBar from "@/app/tickets/[ticketId]/ticket-action-bar";
import {getClient} from "@/lib/graph/client";
import TicketStatusArea from "@/app/tickets/[ticketId]/ticket-status-area";
import {useTickets} from "@/components/providers/ticket-provider";
import {useUser} from "@/components/providers/user-provider";

interface TicketInfoPaneProps {
  ticket: Ticket | null;
  initialTicketLabels: Label[];
  setDialogStateAction: React.Dispatch<React.SetStateAction<TicketDialogState>>;
}

export function TicketInfoPane({ticket, initialTicketLabels, setDialogStateAction}: TicketInfoPaneProps) {
  const {user} = useUser()
  const {triggerTicketRefetch} = useTickets()
  const {isMobile} = useSidebar()
  const [ticketLabels, setTicketLabels] = React.useState<Label[]>(initialTicketLabels)
  const [ticketState, setTicketState] = React.useState<TicketState>(ticket?.state ?? TicketState.New);

  // This is for the inital ticketLabels mounting with [] and then updating. Length changes are sufficient here.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setTicketLabels(initialTicketLabels), [initialTicketLabels.length])
  useEffect(() => setTicketState(ticket?.state ?? TicketState.New), [ticket?.state]);

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
      if (ticketsToRemove.length > 0) {
        await client.request<RemoveLabelsFromTicketMutation>(RemoveLabelsFromTicketDocument,
          {assignments: ticketsToRemove}
        )
      }

      if (ticketsToAdd.length > 0) {
        await client.request<AddLabelsToTicketMutation>(AddLabelsToTicketDocument,
          {assignments: ticketsToAdd}
        )
      }


    } catch (err) {
      toast.error("Fehler beim Aktualisieren der Labels")
      console.error(err);
    } finally {
      triggerTicketRefetch()
      setTicketLabels(labels);
    }
  }

  const handleStateChange = async (state: TicketState) => {
    if (!ticket) return;

    const client = getClient();

    try {
      await client.request<UpdateTicketStateMutation>(
        UpdateTicketStateDocument,
        {id: ticket.id, state: state}
      )
    } catch (err) {
      toast.error("Fehler beim Aktualisieren des Ticketstatus")
      console.error(err);
    } finally {
      triggerTicketRefetch()
      setTicketState(state)
    }
  }

  if (!ticket) return null;

  return isMobile ?
    (
      <Sheet>
        <SheetTrigger asChild>
          <button
            data-cy="mobile-filter-button"
            className={'h-10 aspect-square border rounded-lg flex justify-center items-center'}
          >
            <Info className={'stroke-muted-foreground'}/>
          </button>
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

          <TicketMetaDataArea
            createdAt={new Date(ticket.createdAt)}
            lastModified={new Date(ticket.lastModified)}
          />

          {ticketLabels && <TicketLabelArea ticketLabels={ticketLabels} setTicketLabelsAction={handleLabelsChange}/>}
          <SheetFooter>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    ) : (
      <div className={'h-full flex flex-col w-[200px] pb-5 gap-2 justify-between'}>
        <div className={'flex flex-col grow w-full gap-2'}>
          <span className={'flex items-center justify-between pb-2 px-5 gap-2'}>
            <TicketStatusArea
              state={ticketState}
              setStatusAction={(state) => void handleStateChange(state)}
            />

            {user?.role === UserRole.Admin && (
              <Button
                variant={"outline"}
                className={'!border-destructive aspect-square hover:bg-destructive/10 dark:hover:bg-destructive/20'}
                onClick={() => setDialogStateAction({
                  mode: "delete",
                  currentTicket: ticket
                })}
                data-cy={'ticket-info-pane-delete'}
              >
                <Trash2 className={'stroke-destructive'}/>
              </Button>
            )}
          </span>


          <TicketMetaDataArea
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
      </div>
    )
}
