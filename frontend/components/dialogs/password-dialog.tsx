"use client"

import {useState} from "react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "../ui/input";
import {DialogProps} from "@radix-ui/react-dialog";
import {useUser} from "@/components/providers/user-provider";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";

interface PasswordDialogProps extends DialogProps {
  onSuccessfulConfirmationAction: () => void
  closeDialogAction: () => void
}

export default function PasswordDialog(props: PasswordDialogProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null)
  const {user, login} = useUser()

  async function onSubmit() {
    if (!user) {
      toast.error('Ein Fehler beim Aktualisieren ist aufgetreten, melde dich erneut an')
      return
    }

    const ok = await login(user.mail, password)

    if (ok === null) {
      toast.error('Ein Fehler beim Aktualisieren ist aufgetreten, melde dich erneut an')
      return
    } else if (ok) {
      props.onSuccessfulConfirmationAction()
      props.closeDialogAction()
    } else {
      setError("Das Passwort ist inkorrekt")
    }
  }

  return (
    <Dialog open={props.open}>
      <DialogContent className="[&>button]:hidden">
        <DialogHeader>
          <DialogTitle>E-Mail ändern bestätigen</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Bitte gib dein Passwort ein, um deine E-Mail-Adresse zu ändern.
          </p>
          <Input
            type="password"
            placeholder="Passwort eingeben"
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
            Abbrechen
          </Button>
          <Button variant={'destructive'} onClick={onSubmit} disabled={!password}>
            Bestätigen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}