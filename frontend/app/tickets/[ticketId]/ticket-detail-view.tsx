"use client";

import {Label, Ticket, UpdateTicketDocument, UpdateTicketMutation} from "@/lib/graph/generated/graphql";
import {PageLoader} from "@/components/page-loader";
import {useSidebar} from "@/components/ui/sidebar";
import React, {Dispatch, useEffect} from "react";
import {TicketDialogState} from "@/app/tickets/page";
import {TicketInfoPane} from "@/app/tickets/[ticketId]/ticket-info-pane";
import {Button} from "@/components/ui/button";
import {Save} from "lucide-react";
import {getClient} from "@/lib/graph/client";
import {toast} from "sonner";
import {Input} from "@/components/ui/input";

interface TicketDetailViewProps {
  ticket: Ticket | null;
  ticketLabels: Label[];
  setDialogStateAction: Dispatch<React.SetStateAction<TicketDialogState>>;
  refreshTicketAction: () => void;
}

export default function TicketDetailView({
                                           ticket,
                                           ticketLabels,
                                           setDialogStateAction,
                                           refreshTicketAction
                                         }: TicketDetailViewProps) {
  const {isMobile} = useSidebar()
  const [editMode, setEditMode] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState(ticket?.title ?? "")

  useEffect(() => setNewTitle(ticket?.title ?? ""), [ticket?.title])

  async function handleTitleChange() {
    if (ticket?.title === newTitle || !ticket) return

    const client = getClient()

    try {
      await client.request<UpdateTicketMutation>(
        UpdateTicketDocument,
        {
          id: ticket.id,
          ticket: {title: newTitle}
        }
      )

      refreshTicketAction()
      setEditMode(false)
    } catch (error) {
      toast.error("Beim Aktualisieren des Titels ist ein Fehler aufgetreten")
      console.error(error)
    }
  }

  if (!ticket) {
    return (
      <div className="flex flex-grow items-center justify-center">
        <PageLoader message="Bitte wähle ein Ticket aus der Übersicht." loading={false}/>
      </div>
    )
  }

  return (
    <div className="flex flex-col mx-6 grow pt-5 pb-4 overflow-y-scroll">
      <div className={'grow border rounded-lg p-5'}>
        <div className={'w-full justify-between flex items-center gap-2'}>
          {editMode ? (
            <Input
              autoFocus
              onKeyDown={(e) =>
                e.key === "Enter" && handleTitleChange()
            }
              type="text"
              className={'bg-primary border-none !text-4xl !py-6'}
              placeholder={ticket?.title}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          ) : (
            <h1
              className="text-4xl font-semibold text-wrap whitespace-nowrap"
              title={"Original Titel: " + ticket.originalTitle}
            >
              {ticket.title}
            </h1>
          )}

          <span>
            {editMode ? (
              <span className={'flex items-center gap-2'}>
                <Button
                  variant={'secondary'}
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </Button>
                <Button
                  type={"submit"}
                  variant={'secondary'}
                  onClick={handleTitleChange}
                  className={'bg-accent hover:bg-accent/80'}
                >
                  <Save/>
                  Speichern
                </Button>
              </span>
            ) : (
              <Button variant={'secondary'} onClick={() => setEditMode(true)}>Edit</Button>
            )}
            {isMobile && (
              <TicketInfoPane
                ticket={ticket}
                initialTicketLabels={ticketLabels}
                setDialogStateAction={setDialogStateAction}
              />
            )}
          </span>

        </div>
        <div className={'w-full my-4 h-[1px] bg-border'}></div>
        <div className="flex flex-col grow">
          {ticket.text}
        </div>
      </div>

    </div>
  );
}
