"use client"

import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import React, {useCallback, useEffect, useState} from "react";
import {getClient} from "@/lib/graph/client";
import {
  CheckIfMailExistsDocument,
  UpdateUserSettingsDocument,
  UpdateUserSettingsMutation,
  UpdateUserSettingsMutationVariables
} from "@/lib/graph/generated/graphql";
import {toast} from "sonner";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {useUser} from "@/components/providers/user-provider";
import {SettingsBlock} from "@/components/settings-block";
import {User} from "lucide-react";
import PasswordDialog from "@/components/dialogs/password-dialog";
import {useTranslations} from "next-intl";

const MAX_NAME_LENGTH = 50;


export default function AccountDataForm() {
  const t = useTranslations("Settings.AccountPage.AccountDataForm")
  const tc = useTranslations("Commons")
  const {user} = useUser()
  const [isSavingAccount, setIsSavingAccount] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasTriedToSubmit, setHasTriedToSubmit] = useState(false);
  const [pendingUserData, setPendingUserData] = useState<AccountDataFormData>();
  const [passwordInputOpen, setPasswordInputOpen] = useState(false);

  const accountDataSchema = z.object({
    firstname: z.string().nonempty(tc("fields.errors.empty", {item: tc("fields.firstname.errorInfix")}))
      .max(MAX_NAME_LENGTH, tc("fields.errors.long", {item: MAX_NAME_LENGTH + " " + tc("words.character")})),
    lastname: z.string().nonempty(tc("fields.errors.empty", {item: tc("fields.lastname.errorInfix")}))
      .max(MAX_NAME_LENGTH, tc("fields.errors.long", {item: MAX_NAME_LENGTH + " " + tc("words.character")})),
    mail: z.email(tc("fields.email.errors.format")),
  });

  type AccountDataFormData = z.infer<typeof accountDataSchema>;
  const form = useForm<AccountDataFormData>({
    resolver: zodResolver(accountDataSchema),
    defaultValues: {
      firstname: user?.firstname,
      lastname: user?.lastname,
      mail: user?.mail,
    }
  })

  const resetFormWithUserData = useCallback(() => {
    if (!user) return;
    form.reset({
      firstname: user.firstname,
      lastname: user.lastname,
      mail: user.mail,
    });
    setIsLoading(false);
  }, [form, user]);

  useEffect(() => {
    resetFormWithUserData();
  }, [resetFormWithUserData]);

  async function onValidSubmit(userData: AccountDataFormData) {
    setHasTriedToSubmit(true)
    setIsSavingAccount(true);

    if (!user) {
      toast.error(tc("toasts.loginAgainError"));
      return;
    }

    if (userData.mail !== user.mail) {
      try {
        const client = getClient();
        const data = await client.request(CheckIfMailExistsDocument, {mail: userData.mail});
        const emailUsedByOtherUser = data.isMailInUse

        if (emailUsedByOtherUser) {
          form.setError("mail", {
            message: tc("fields.email.errors.inUse"),
          });
          return;
        }

        setPendingUserData(userData)
        setPasswordInputOpen(true);
      } catch (error) {
        toast.error(t("toasts.emailCheckError"));
        console.error(error);
      } finally {
        setIsSavingAccount(false)
      }
    } else {
      await updateProfileData(userData)
    }
  }

  async function updateProfileData(data: AccountDataFormData) {
    if (!user || !data) {
      toast.error(tc("toasts.loginAgainError"));
      return;
    }

    setIsSavingAccount(true)

    const client = getClient();
    const userObject = {
      firstname: data.firstname.trim() !== user?.firstname ? data.firstname.trim() : null,
      lastname: data.lastname.trim() !== user?.lastname ? data.lastname.trim() : null,
      mail: data.mail.trim() !== user?.mail ? data.mail.trim() : null,
    }

    const updateData: UpdateUserSettingsMutationVariables = {
      id: user.id,
      user: userObject,
    };

    try {
      await client.request<UpdateUserSettingsMutation>(UpdateUserSettingsDocument, updateData);
      form.reset({
        firstname: data.firstname,
        lastname: data.lastname,
        mail: data.mail,
      });

      toast.success(tc("toasts.updateSuccess", {item: "Dein Account"}));
      setHasTriedToSubmit(false);

      if (data.mail !== user.mail) window.location.reload()
    } catch {
      toast.error(tc("toasts.loginAgain"));
    } finally {
      setIsSavingAccount(false);
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onValidSubmit, () =>
            setHasTriedToSubmit(true)
          )}
          className="space-y-4 w-full"
        >

          <SettingsBlock
            icon={<User/>}
            title={t("title")}
            hasTriedToSubmit={hasTriedToSubmit}
            isDirty={form.formState.isDirty}
            isSaving={isSavingAccount}
            isLoading={isLoading}
            dataCy="input-profile-save"
            isValid={form.formState.isValid}
          >
            <FormField
              control={form.control}
              name="firstname"
              render={({field}) => (
                <FormItem className={"flex-grow"}>
                  <FormLabel>{tc("fields.firstname.label")}</FormLabel>
                  <FormControl>
                    <Input placeholder={tc("fields.firstname.placeholer")} {...field} data-cy={'account-firstname-input'}/>
                  </FormControl>
                  <FormMessage data-cy={'account-firstname-input-message'}/>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastname"
              render={({field}) => (
                <FormItem className={"flex-grow"}>
                  <FormLabel>{tc("fields.lastname.label")}</FormLabel>
                  <FormControl>
                    <Input placeholder={tc("fields.lastname.placeholder")} {...field} data-cy={'account-lastname-input'}/>
                  </FormControl>
                  <FormMessage data-cy={'account-lastname-input-message'}/>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mail"
              render={({field}) => (
                <FormItem className={"flex-grow"}>
                  <FormLabel>{tc("fields.email.label")}</FormLabel>
                  <FormControl>
                    <Input placeholder={tc("fields.email.placeholder")} {...field}
                           data-cy={'account-mail-input'}/>
                  </FormControl>
                  <FormMessage data-cy={'account-mail-input-message'}/>
                </FormItem>
              )}
            />
          </SettingsBlock>
        </form>
      </Form>

      <PasswordDialog
        open={passwordInputOpen}
        closeDialogAction={() => setPasswordInputOpen(false)}
        onSuccessfulConfirmationAction={async () => {
          if (pendingUserData) await updateProfileData(pendingUserData)
          else toast.error(tc("toasts.generalError"))
        }}
      />
    </>
  )
}