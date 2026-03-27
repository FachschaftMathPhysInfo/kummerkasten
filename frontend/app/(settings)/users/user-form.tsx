"use client"

import {z} from "zod";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import React, {useRef, useState} from "react";
import {getClient} from "@/lib/graph/client";
import {CreateUserDocument, CreateUserMutation, GetUserIdByMailDocument, NewUser} from "@/lib/graph/generated/graphql";
import {toast} from "sonner";
import {LoaderCircle, PlusCircle} from "lucide-react";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {useTranslations} from "use-intl";

interface UserFormProps {
  closeDialog: () => void
  refreshData: () => void
}

export default function UserForm(props: UserFormProps) {
  const t = useTranslations("Settings.UserManagementPage.UserForm")
  const passwordSchema = z.string()
    .min(12, t("inputErrors.password.short"))
    .refine((val) => /[a-z]/.test(val), {
      message: t("inputErrors.password.lowercase"),
    })
    .refine((val) => /[A-Z]/.test(val), {
      message: t("inputErrors.password.uppercase")
    })
    .refine((val) => /[0-9]/.test(val), {
      message: t("inputErrors.password.number"),
    })
    .refine((val) => /[^A-Za-z0-9]/.test(val), {
      message: t("inputErrors.password.special"),
    });

  const userFormSchema = z.object({
    firstname: z.string().min(2, {error: t("inputErrors.firstname.short")}),
    lastname: z.string().min(2, {error: "inputErrors.lastname.short"}),
    mail: z.email({error: t("inputErrors.email.format")}),
    password: passwordSchema,
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: t("inputErrors.confirmPassword.identical"),
  });

  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      mail: "",
      password: "",
      confirmPassword: "",
    }
  })
  const [hasTriedToSubmit, setHasTriedToSubmit] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const formRef = useRef<HTMLFormElement | null>(null)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab' && formRef.current) {
      const focusableElements = Array.from(
        formRef.current.querySelectorAll(
          'input:not([disabled]), button:not([disabled]), [role="button"]:not([disabled])'
        )
      ) as HTMLElement[];

      const currentIndex = focusableElements.indexOf(e.target as HTMLElement);

      if (currentIndex !== -1) {
        e.preventDefault();

        let nextIndex;
        if (e.shiftKey) {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
        } else {
          nextIndex = currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0;
        }

        focusableElements[nextIndex]?.focus();
      }
    }
  };

  async function onValidSubmit(data: z.infer<typeof userFormSchema>) {
    setLoading(true)

    if (await testIfMailExists(data.mail)) {
      form.setError('mail', {message: t("inputErrors.email.unique")})
      return
    }

    const client = getClient();

    const newUser: NewUser = {
      firstname: data.firstname.trim(),
      lastname: data.lastname.trim(),
      mail: data.mail.trim(),
      password: data.password,
    }

    try {
      await client.request<CreateUserMutation>(CreateUserDocument, {user: newUser})
      toast.success(t("toast.createSuccess"))
      setHasTriedToSubmit(false)
      props.refreshData()
      props.closeDialog()
    } catch {
      toast.error(t("toast.createFailure"));
    }
    setLoading(false)
  }

  async function testIfMailExists(mail: string): Promise<boolean> {
    const client = getClient();
    const data = await client.request(GetUserIdByMailDocument, {mail: [mail]})
    const id = data.users?.find(u => !!u)?.id

    return !!id
  }


  return (
    <FormProvider {...form}>
      <form
        ref={formRef}
        onKeyDown={handleKeyDown}
        onSubmit={form.handleSubmit(onValidSubmit, () =>
          setHasTriedToSubmit(true)
        )}
        className="space-y-4 w-full"
      >

        <FormField
          control={form.control}
          name="firstname"
          render={({field}) => (
            <FormItem className={"flex-grow"}>
              <FormLabel>{t("firstname.label")}</FormLabel>
              <FormControl>
                <Input placeholder={t("firstname.placeholder")} {...field} data-cy={'firstname-input'}/>
              </FormControl>
              <FormMessage data-cy={'firstname-input-message'}/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastname"
          render={({field}) => (
            <FormItem className={"flex-grow"}>
              <FormLabel>{t("lastname.label")}</FormLabel>
              <FormControl>
                <Input placeholder={t("lastname.placeholder")} {...field} data-cy={'lastname-input'}/>
              </FormControl>
              <FormMessage data-cy={'lastname-input-message'}/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mail"
          render={({field}) => (
            <FormItem className={"flex-grow"}>
              <FormLabel>{t("email.label")}</FormLabel>
              <FormControl>
                <Input placeholder={t("email.placeholder")} {...field} data-cy={'mail-input'}/>
              </FormControl>
              <FormMessage data-cy={'mail-input-message'}/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({field}) => (
            <FormItem className={"flex-grow"}>
              <FormLabel>{t("password.label")}</FormLabel>
              <FormControl>
                <Input placeholder={t("password.placeholder")} type={"password"} {...field} data-cy={'password-input'}/>
              </FormControl>
              <FormMessage data-cy={'password-input-message'}/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({field}) => (
            <FormItem className={"flex-grow"}>
              <FormControl>
                <Input
                  placeholder={t("confirmPassword.placeholder")}
                  type={"password"}
                  {...field}
                  className={cn(form.getFieldState('password').invalid && 'border-destructive')}
                  data-cy={'confirm-password-input'}
                />
              </FormControl>
              <FormMessage data-cy={'confirm-password-input-message'}/>
            </FormItem>
          )}
        />

        <div className={"flex justify-between items-center gap-x-12 mt-8"}>
          <Button
            onClick={props.closeDialog}
            variant={"outline"}
            type={"button"}
            className={"flex-grow-[0.5]"}
            data-cy={'cancel-button'}
          >
            {t("cancel")}
          </Button>

          <Button
            disabled={(!form.formState.isValid && hasTriedToSubmit) || loading}
            type="submit"
            className={"flex-grow"}
            data-cy={'submit-button'}
          >
            {loading ? (
              <LoaderCircle/>
            ) : (
              <PlusCircle/>
            )}
            {t("submit")}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}