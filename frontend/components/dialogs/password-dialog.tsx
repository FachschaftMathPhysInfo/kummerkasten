"use client"

import {useState} from "react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "../ui/input";
import {DialogProps} from "@radix-ui/react-dialog";
import {useUser} from "@/components/providers/user-provider";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {useTranslations} from "next-intl";

interface PasswordDialogProps extends DialogProps {
  onSuccessfulConfirmationAction: () => void
  closeDialogAction: () => void
}

export default function PasswordDialog(props: PasswordDialogProps) {
  const t = useTranslations("Components.Dialogs.PasswordDialog")
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null)
  const {user, login} = useUser()

  async function onSubmit() {
    if (!user) {
      toast.error(t("toasts.updateError"))
      return
    }

    const ok = await login(user.mail, password)

    if (ok === null) {
      toast.error(t("toasts.updateError"))
      return
    } else if (ok) {
      props.onSuccessfulConfirmationAction()
      props.closeDialogAction()
    } else {
      setError(t("fields.password.errors.wrong"))
    }
  }

  return (
    <Dialog open={props.open}>
      <DialogContent className="[&>button]:hidden">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {t("description")}
          </p>
          <Input
            type="password"
            placeholder={t("fields.password.placeholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={cn(!!error && 'border-destructive')}
          />
          {!!error && (
            <p className={'text-destructive text-sm'}>{error}</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => props.closeDialogAction()}>
            {t("buttons.cancel")}
          </Button>
          <Button variant={'destructive'} onClick={onSubmit} disabled={!password}>
            {t("buttons.submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}