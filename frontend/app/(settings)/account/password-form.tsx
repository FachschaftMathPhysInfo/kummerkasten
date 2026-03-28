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
import {useTranslations} from "next-intl";


export default function PasswordDataForm() {
  const t = useTranslations("AccountPage.PasswordDataForm");
  const tc = useTranslations("Commons")
  const {user, logout} = useUser();
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const isItLoading = false;
  const [hasTriedToSubmit, setHasTriedToSubmit] = useState(false);

  const passwordFormSchema = z
    .object({
      currentPassword: z.string().nonempty(t("inputErrors.currentPassword.empty")),
      newPassword: z
        .string()
        .min(8, {message: tc("fields.errors.short", {item: `8 ${t("words.character")}`})})
        .regex(/[A-Z]/, {message: tc("fields.errors.uppercase")})
        .regex(/\d/, {message: tc("fields.errors.number")})
        .regex(/[!@#$%^&*(),.?":{}|<>]/, {
          message: tc("fields.errors.special")
        }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("fields.confirmPassword.errors.match"),
      path: ["confirmPassword"],
    })
    .refine((data) => data.newPassword !== data.currentPassword, {
      message: t("fields.newPassword.errors.unique"),
      path: ["newPassword"],
    });

  type PasswordFormData = z.infer<typeof passwordFormSchema>;

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onPasswordSubmit(data: PasswordFormData) {
    setIsSavingPassword(true);
    if (!user) {
      toast.error(tc("toasts.loginAgainError"));
      return;
    }

    const client = getClient();

    try {
      await client.request(LoginDocument, {
        mail: user.mail,
        password: data.currentPassword,
      });


      await client.request(UpdateUserDocument, {
        id: user.id,
        user: {password: data.newPassword},
      });

      toast.success(t("toasts.changeSuccess"));
      passwordForm.reset();
      setHasTriedToSubmit(false);
      await logout();

    } catch (err) {
      if (String(err).includes('credentials')) {
        passwordForm.setError("currentPassword", {message: tc("fields.errors.wrong", {item: tc("words.password")})});
      } else {
        toast.error(tc("toasts.updateError", {item: t("data")}));
      }

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
          title={t("title")}
          hasTriedToSubmit={hasTriedToSubmit}
          isDirty={passwordForm.formState.isDirty}
          isLoading={isItLoading}
          isSaving={isSavingPassword}
          dataCy="input-settings-save"
        >

          <FormField
            control={passwordForm.control}
            name="currentPassword"
            render={({field}) => (
              <FormItem className={"flex-grow"}>
                <FormLabel>{t("fields.currentPassword.label")}</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder={t("fields.currentPassword.placeholder")}
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
                <FormLabel>{t("fields.newPassword.label")}</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder={t("fields.newPassword.placeholder")}
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
                    placeholder={t("fields.confirmPassword.placeholder")}
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