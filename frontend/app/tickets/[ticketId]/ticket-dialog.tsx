import {Dialog, DialogContent, DialogTitle} from "@/components/ui/dialog";
import {Ticket} from "@/lib/graph/generated/graphql";
import TicketEditDialog from "@/app/tickets/[ticketId]/ticket-edit-dialog";
import {Edit2} from "lucide-react";

interface TicketDialogProps {
    open: boolean;
    ticket: Ticket | null;
    closeDialog: () => void;
    refreshData: () => void;
}

export default function TicketDialog(props: TicketDialogProps) {
    return (
        <Dialog open={props.open}>
            {/*hides the x in top right corner*/}
            <DialogContent className="[&>button]:hidden">
                <DialogTitle className={'flex items-center gap-2'}>
                    <Edit2/>
                    Ticket Bearbeiten
                </DialogTitle>
                <TicketEditDialog
                    ticket={props.ticket}
                    closeDialog={props.closeDialog}
                    refreshData={props.refreshData}
                />
            </DialogContent>
        </Dialog>
    )
}