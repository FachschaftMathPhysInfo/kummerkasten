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
  const {user, logout} = useUser();
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const isItLoading = false;
  const [hasTriedToSubmit, setHasTriedToSubmit] = useState(false);

  const passwordFormSchema = z
    .object({
      currentPassword: z.string().nonempty(t("inputErrors.currentPassword.empty")),
      newPassword: z
        .string()
        .min(8, {message: t("inputErrors.newPassword.short")})
        .regex(/[A-Z]/, {message: t("inputErrors.newPassword.capital")})
        .regex(/\d/, {message: t("inputErrors.newPassword.number")})
        .regex(/[!@#$%^&*(),.?":{}|<>]/, {
          message: t("inputErrors.newPassword.special")
        }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("inputErrors.confirmPassword.match"),
      path: ["confirmPassword"],
    })
    .refine((data) => data.newPassword !== data.currentPassword, {
      message: t("inputErrors.newPassword.notChanged"),
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
      toast.error(t("toast.loginError"));
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

      toast.success(t("toast.changeSuccess"));
      passwordForm.reset();
      setHasTriedToSubmit(false);
      await logout();

    } catch (err) {
      if (String(err).includes('credentials')) {
        passwordForm.setError("currentPassword", {message: t("inputErrors.currentPassword.wrong")});
      } else {
        toast.error(t("toast.changeFailure"));
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
          title={t("header")}
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
                <FormLabel>{t("currentPassword")}</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder={t("currentPassword")}
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
                <FormLabel>{t("newPassword")}</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder={t("newPassword")}
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
                    placeholder={t("confirmPassword.placeholder")}
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