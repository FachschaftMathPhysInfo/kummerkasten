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
import {useTranslations} from "next-intl";

interface ResetPasswordDialogProps {
  user: TableUser | null
  closeDialog: () => void;
  isOpen: boolean;
}

export function ResetPasswordDialog(props: ResetPasswordDialogProps) {
  const t = useTranslations("Settings.UserManagementPage.ResetPasswordDialog")
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
      toast.success(t("toast.resetSuccess"))
    } catch (error) {
      console.error(error)
      toast.error(t("toast.resetFailure"))
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
        setErrorMessage(t("inputErrors.short"))
        return
      }
      case hasLowercaseLetter.test(newPassword): {
        setErrorMessage(t("inputErrors.lowercase"))
        return
      }
      case hasUppercaseLetter.test(newPassword): {
        setErrorMessage(t("inputErrors.uppercase"))
        return
      }
      case hasNumber.test(newPassword): {
        setErrorMessage(t("inputErrors.number"))
        return
      }
      case hasSymbol.test(newPassword): {
        setErrorMessage(t("inputErrors.special"))
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
            {t("header")}
          </DialogTitle>
          <DialogDescription>
            {t("description.one")}<b>{props.user.firstname} {props.user.lastname}</b>{t("description.two")}
          </DialogDescription>
        </DialogHeader>

        <div className={'flex flex-col gap-2 w-full'}>
          <PasswordInput
            value={password}
            placeholder={t("password.placeholder")}
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
            {t("submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}