"use client"

import {ResetPasswordDocument, ResetPasswordMutation} from "@/lib/graph/generated/graphql";
import {useState} from "react";
import {getClient} from "@/lib/graph/client";
import {toast} from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {RotateCcw, Save} from "lucide-react";
import {Button} from "@/components/ui/button";
import {TableUser} from "@/app/(settings)/users/user-table";
import PasswordInput from "@/components/password-input";
import {testPasswordFormat} from "@/lib/password";
import {cn} from "@/lib/utils";

interface ResetPasswordDialogProps {
  user: TableUser | null
  closeDialog: () => void;
  isOpen: boolean;
}

export function ResetPasswordDialog(props: ResetPasswordDialogProps) {
  const [password, setPassword] = useState<string>("");
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);
  const [hasTriedToSubmit, setHasTriedToSubmit] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  if (!props.user) return

  async function handleSubmit() {
    setHasTriedToSubmit(true)
    if (!isPasswordValid) return
    await handleReset()
  }

  async function handleReset() {
    const client = getClient();

    try {
      await client.request<ResetPasswordMutation>(ResetPasswordDocument, {id: props.user?.id, password: password})
      setHasTriedToSubmit(false);
      setPassword("")
      setIsPasswordValid(false)
      props.closeDialog();
      toast.success("Password wurde erfolgreich zurückgesetzt")
    } catch (error) {
      console.error(error)
      toast.error("Beim Zurücksetzen des Passworts ist ein Fehler aufgetreten")
    }
  }

  function onPasswordChange(newPassword: string) {
    setPassword(newPassword)
    setIsPasswordValid(testPasswordFormat(newPassword))
    if (testPasswordFormat(newPassword)) return

    const hasLowercaseLetter = new RegExp(".*[a-z].*")
    const hasUppercaseLetter = new RegExp(".*[A-Z].*")
    const hasNumber = new RegExp(".*\\d.*")
    const hasSymbol = new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*")

    switch (false) {
      case newPassword.length >= 8: {
        setErrorMessage("Das Passwort muss mindestens 8 Zeichen haben")
        return
      }
      case hasLowercaseLetter.test(newPassword): {
        setErrorMessage('Das Passwort muss mindestens einen Kleinbuchstaben enthalten')
        return
      }
      case hasUppercaseLetter.test(newPassword): {
        setErrorMessage('Das Passwort muss mindestens einen Großbuchstaben enthalten')
        return
      }
      case hasNumber.test(newPassword): {
        setErrorMessage('Das Passwort muss mindestens eine Nummer enthalten')
        return
      }
      case hasSymbol.test(newPassword): {
        setErrorMessage('Das Passwort muss mindestens ein Sonderzeichen enthalten')
        return
      }
    }
  }

  return (
    <Dialog
      open={props.isOpen}
      onOpenChange={open => {
        if (!open) props.closeDialog()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className={'w-full flex items-center gap-2'}>
            <RotateCcw/>
            Password zurücksetzen
          </DialogTitle>
          <DialogDescription>
            Dies wird das Passwort für <b>{props.user.firstname} {props.user.lastname}</b> ändern.
          </DialogDescription>
        </DialogHeader>

        <div className={'flex flex-col gap-2 w-full'}>
          <PasswordInput
            value={password}
            placeholder={'Neues Passwort'}
            onChange={(e) => onPasswordChange(e.target.value)}
            className={cn(!isPasswordValid && hasTriedToSubmit && 'border border-destructive')}
          />
          {!isPasswordValid && hasTriedToSubmit && (
            <p className={'text-destructive text-sm'}>
              {errorMessage}
            </p>
          )}
        </div>

        <DialogFooter className={'mt-3 w-full flex items-center justify-end'}>
          <Button
            variant={'destructive'}
            onClick={handleSubmit}
            disabled={!isPasswordValid && hasTriedToSubmit}
          >
            <Save/>
            Speichern
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}