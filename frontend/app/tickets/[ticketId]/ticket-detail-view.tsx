"use client";

import {Label, Ticket} from "@/lib/graph/generated/graphql";
import {PageLoader} from "@/components/page-loader";
import {useSidebar} from "@/components/ui/sidebar";
import React, {Dispatch, useEffect} from "react";
import {TicketDialogState} from "@/app/tickets/page";
import {TicketInfoPane} from "@/app/tickets/[ticketId]/ticket-info-pane";
import {Button} from "@/components/ui/button";
import {Save} from "lucide-react";
import {toast} from "sonner";
import {Input} from "@/components/ui/input";
import {useTickets} from "@/components/providers/ticket-provider";
import {cn} from "@/lib/utils";

interface TicketDetailViewProps {
  ticket: Ticket | null;
  ticketLabels: Label[];
  setDialogStateAction: Dispatch<React.SetStateAction<TicketDialogState>>;
}

const MAX_TITLE_LENGTH = 70;

export default function TicketDetailView({
                                           ticket,
                                           ticketLabels,
                                           setDialogStateAction,
                                         }: TicketDetailViewProps) {
  const {isMobile} = useSidebar()
  const {updateTicket} = useTickets()
  const [editMode, setEditMode] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState(ticket?.title ?? "")

  useEffect(() => setNewTitle(ticket?.title ?? ""), [ticket?.title])

  async function handleTitleChange() {
    if (ticket?.title === newTitle || !ticket) return

    const error = await updateTicket(ticket.id, {title: newTitle})

    if (!error) {
      setEditMode(false)
      ticket.title = newTitle
    } else {
      toast.error("Beim Aktualisieren des Titels ist ein Fehler aufgetreten")
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
    // 2.5 rem is the padding added by the parent node
    <div
      className={cn(
        "mx-6 grow overflow-y-scroll min-h-[calc(100vh-2.5rem)] flex border rounded-lg p-5 flex-col",
        // 28px is the size of the toggle, only visible on mobile
        isMobile && 'min-h-[calc(100vh-2.5rem-28px)]'
      )}
    >
      {!isMobile ? (
        <div className={'w-full justify-between flex items-center gap-4'}>
          {editMode ? (
            <Input
              autoFocus
              onKeyDown={(e) =>
                e.key === "Enter" && handleTitleChange()
              }
              type="text"
              className={'bg-primary border-none !text-4xl !py-6'}
              maxLength={MAX_TITLE_LENGTH}
              placeholder={ticket?.title}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              data-cy={'ticket-detail-title-input'}
            />
          ) : (
            <h1
              className="text-4xl font-semibold text-wrap whitespace-nowrap truncate"
              title={"Original Titel: " + ticket.originalTitle}
              data-cy={'ticket-detail-title'}
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
                  data-cy={'ticket-detail-title-cancel'}
                >
                  Cancel
                </Button>
                <Button
                  type={"submit"}
                  variant={'secondary'}
                  onClick={handleTitleChange}
                  className={'bg-accent hover:bg-accent/60'}
                  data-cy={'ticket-detail-title-save'}
                >
                  <Save/>
                  Speichern
                </Button>
              </span>
            ) : (
              <Button variant={'secondary'} onClick={() => setEditMode(true)}
                      data-cy={'ticket-detail-title-edit'}>Edit</Button>
            )}
          </span>
        </div>
      ) : (
        <span className="flex items-center justify-between gap-2">
            <h1
              className="text-2xl font-semibold text-wrap whitespace-nowrap"
              title={"Originaltitel: " + ticket.originalTitle}
            >
              {ticket.title}
            </h1>
            <TicketInfoPane
              ticket={ticket}
              initialTicketLabels={ticketLabels}
              setDialogStateAction={setDialogStateAction}
            />
          </span>
      )}

      <div className={'w-full my-4 h-[1px] bg-border'}></div>

      <div className="flex justify-between h-full grow">
        <p>{ticket.text}</p>
        {!isMobile && (
          <TicketInfoPane
            ticket={ticket}
            initialTicketLabels={ticketLabels}
            setDialogStateAction={setDialogStateAction}
          />
        )}
      </div>
    </div>
  );
}
