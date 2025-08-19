import {Dialog, DialogContent, DialogTitle} from "@/components/ui/dialog";
import {Edit2, PlusCircle} from "lucide-react";
import {Label} from "@/lib/graph/generated/graphql";
import LabelForm from "@/app/(settings)/labels/label-form";

interface LabelDialogProps {
  open: boolean;
  createMode: boolean;
  label: Label | null;
  closeDialog: () => void;
  refreshData: () => void;
}

export default function LabelDialog(props: LabelDialogProps) {
  return (
    <Dialog open={props.open}>
      {/*hides the x in top right corner*/}
      <DialogContent className="[&>button]:hidden">
        <DialogTitle className={'flex items-center gap-2'}>
          {props.createMode ? <PlusCircle/> : <Edit2 size={20}/>}
          {props.createMode ? "Label erstellen" : "Label bearbeiten"}
        </DialogTitle>
        <LabelForm
          createMode={props.createMode}
          label={props.label}
          closeDialog={props.closeDialog}
          refreshData={props.refreshData}
        />
      </DialogContent>
    </Dialog>
  )
}