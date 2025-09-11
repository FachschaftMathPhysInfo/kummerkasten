"use client"

import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";
import {getClient} from "@/lib/graph/client";
import {LoginDocument, UpdateUserDocument} from "@/lib/graph/generated/graphql";
import {toast} from "sonner";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useUser} from "@/components/providers/user-provider";
import {SettingsBlock} from "@/components/settings-block";
import PasswordInput from "@/components/password-input";
import {ShieldUser} from "lucide-react";

const passwordFormSchema = z
  .object({
    oldPassword: z.string().nonempty("Bitte gib dein aktuelles Passwort ein"),
    newPassword: z
      .string()
      .min(8, {message: "Mindestens 8 Zeichen"})
      .regex(/[A-Z]/, {message: "Mindestens ein Großbuchstabe"})
      .regex(/\d/, {message: "Mindestens eine Zahl"})
      .regex(/[!@#$%^&*(),.?":{}|<>]/, {
        message: "Mindestens ein Sonderzeichen.",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwörter stimmen nicht überein",
    path: ["confirmPassword"],
  })
  .refine((data) => data.newPassword !== data.oldPassword, {
    message: "Neues Passwort darf nicht dem alten entsprechen",
    path: ["newPassword"],
  });

type PasswordFormData = z.infer<typeof passwordFormSchema>;


export default function PasswordDataForm() {
  const {user, logout} = useUser();
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const isItLoading = false;
  const [hasTriedToSubmit, setHasTriedToSubmit] = useState(false);

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  async function onPasswordSubmit(data: PasswordFormData) {
    setIsSavingPassword(true);
    if (!user) {
      toast.error("Fehler beim Laden des Benutzers");
      return;
    }

    const client = getClient();

    try {
      const loginResponse = await client.request(LoginDocument, {
        mail: user.mail,
        password: data.oldPassword,
      });

      if (!loginResponse.login) {
        passwordForm.reset();
        passwordForm.setError("oldPassword", {
          message: "Falsches aktuelles Passwort",
        });
        return;
      }

      await client.request(UpdateUserDocument, {
        id: user.id,
        user: {password: data.newPassword},
      });

      toast.success("Passwort aktualisiert. Du wirst jetzt ausgeloggt");
      passwordForm.reset();
      setHasTriedToSubmit(false);
      await logout();

    } catch (err) {
      console.error(err);
      toast.error("Fehler beim Aktualisieren der Daten");
      return;
    } finally {
      setIsSavingPassword(false);
    }
  }


  return (
    <Form {...passwordForm}>
      <form
        onSubmit={passwordForm.handleSubmit(onPasswordSubmit, () =>
          setHasTriedToSubmit(true)
        )}
        className="space-y-4 w-full"
      >
        <SettingsBlock
          icon={<ShieldUser/>}
          title={"Sicherheit"}
          hasTriedToSubmit={hasTriedToSubmit}
          isDirty={passwordForm.formState.isDirty}
          isLoading={isItLoading}
          isSaving={isSavingPassword}
          dataCy="input-settings-save"
        >

          <FormField
            control={passwordForm.control}
            name="oldPassword"
            render={({field}) => (
              <FormItem className={"flex-grow"}>
                <FormLabel>Aktuelles Passwort</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder={"Aktuelles Passwort"}
                    {...field}
                    data-cy={'account-current-password-input'}
                  />
                </FormControl>
                <FormMessage data-cy={'account-current-password-input-message'}/>
              </FormItem>
            )}
          />

          <FormField
            control={passwordForm.control}
            name="newPassword"
            render={({field}) => (
              <FormItem className={"flex-grow"}>
                <FormLabel>Neues Passwort</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder={"Neues Passwort"}
                    {...field}
                    data-cy={'account-new-password-input'}
                  />
                </FormControl>
                <FormMessage data-cy={'account-new-password-input-message'}/>
              </FormItem>
            )}
          />

          <FormField
            control={passwordForm.control}
            name="confirmPassword"
            render={({field}) => (
              <FormItem className={"flex-grow"}>
                <FormControl>
                  <PasswordInput
                    placeholder={"Wiederhole dein neues Passwort"}
                    {...field}
                    data-cy={'account-confirm-password-input'}
                  />
                </FormControl>
                <FormMessage data-cy={'account-confirm-password-input-message'}/>
              </FormItem>
            )}
          />

        </SettingsBlock>
      </form>
    </Form>
  )
}