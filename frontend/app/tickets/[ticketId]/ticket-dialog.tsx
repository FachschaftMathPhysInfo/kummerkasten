import {Dialog, DialogContent, DialogTitle} from "@/components/ui/dialog";
import {Ticket} from "@/lib/graph/generated/graphql";
import TicketEditDialog from "@/app/tickets/[ticketId]/ticket-edit-dialog";
import {Edit2} from "lucide-react";
import {useTranslations} from "next-intl";

interface TicketDialogProps {
    open: boolean;
    ticket: Ticket | null;
    closeDialog: () => void;
    refreshData: () => void;
}

export default function TicketDialog(props: TicketDialogProps) {
    const t = useTranslations("TicketId.TicketDialog")

    return (
        <Dialog open={props.open}>
            {/*hides the x in top right corner*/}
            <DialogContent className="[&>button]:hidden">
                <DialogTitle className={'flex items-center gap-2'}>
                    <Edit2/>
                    {t("title")}
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