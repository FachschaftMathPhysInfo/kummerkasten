import {Dialog, DialogContent, DialogTitle} from "@/components/ui/dialog";
import UserForm from "@/app/(settings)/users/user-form";
import {UserPlus} from "lucide-react";
import {useTranslations} from "next-intl";

interface UserDialogProps {
  open: boolean;
  closeDialog: () => void;
  refreshData: () => void;
}

export default function UserDialog(props: UserDialogProps) {
  const t = useTranslations("Settings.UserManagementPage.UserDialog")

  return (
    <Dialog open={props.open}>
      {/*hides the x in top right corner*/}
      <DialogContent className="[&>button]:hidden" data-cy={'user-dialog'}>
        <DialogTitle className={'flex items-center gap-2'}>
          <UserPlus/>
          {t("create")}
        </DialogTitle>
        <UserForm
          refreshData={props.refreshData}
          closeDialog={props.closeDialog}
        />
      </DialogContent>
    </Dialog>
  )
}