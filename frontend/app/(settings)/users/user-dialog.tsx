import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import UserForm from "@/app/(settings)/users/user-form";

interface UserDialogProps {
  open: boolean;
  closeDialog: () => void;
  refreshData: () => void;
}

export default function UserDialog(props: UserDialogProps) {
  return (
    <Dialog open={props.open}>
      {/*hides the x in top right corner*/}
      <DialogContent className="[&>button]:hidden">
        <DialogTitle>
          User erstellen
        </DialogTitle>
        <DialogDescription>
          Erstelle hier einen neuen User
        </DialogDescription>
        <UserForm
          refreshData={props.refreshData}
          closeDialog={props.closeDialog}
        />
      </DialogContent>
    </Dialog>
  )
}