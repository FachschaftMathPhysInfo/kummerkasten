"use client"

import {zodResolver} from "@hookform/resolvers/zod";
import {ControllerRenderProps, useForm} from "react-hook-form";
import {z} from "zod";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import React, {useRef, useState} from "react";
import {LoaderCircle, LogIn} from "lucide-react";
import {useUser} from "@/components/providers/user-provider";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {cn} from "@/lib/utils";
import PasswordInput from "@/components/password-input";
import {useTranslations} from "next-intl";


export default function LoginForm() {
  const t = useTranslations("LoginPage.LoginForm")

  const loginFormSchema = z.object({
    mail: z.email(t("inputErrors.mail.format")),
    password: z.string(t("inputErrors.password.empty")),
  });

  const router = useRouter();
  const {login} = useUser()
  const [hasTriedToSubmit, setHasTriedToSubmit] = useState(false);
  const [correctCredentials, setCorrectCredentials] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      mail: "",
      password: "",
    },
  });

  const handleInputChange = <T extends keyof z.infer<typeof loginFormSchema>>(
    field: ControllerRenderProps<z.infer<typeof loginFormSchema>, T>,
    value: string
  ) => {
    field.onChange(value);
    if (!correctCredentials) setCorrectCredentials(true)
  };

  async function onValidSubmit(userData: z.infer<typeof loginFormSchema>) {
    setIsLoading(true);

    const ok = await login(userData.mail, userData.password)

    if (ok === null) {
      toast.error(t("toast.loginError"))
      return
    }

    setIsLoading(false);

    if (ok) {
      setHasTriedToSubmit(false)
      router.push("/tickets")
      router.refresh()
    } else {
      setCorrectCredentials(false);
      setHasTriedToSubmit(true)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onValidSubmit, () => setHasTriedToSubmit(true))}
        className="space-y-4 w-full mt-6"
        onKeyDown={e => {if (e.key === "Enter") submitButtonRef.current?.focus()}}
      >

        <FormField
          control={form.control}
          name="mail"
          render={({field}) => (
            <FormItem className={'flex-grow'}>
              <FormLabel hidden>{t("mail")}</FormLabel>
              <FormControl>
                {/*Injected Icons by password managers will trigger a warning*/}
                <Input
                  suppressHydrationWarning
                  placeholder={t("mail")}
                  className={cn(!correctCredentials && "border-destructive")}
                  {...field}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  data-cy={'mail-input'}
                />
              </FormControl>
              <FormMessage data-cy={'mail-message'}/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({field}) => (
            <FormItem>
              <FormLabel hidden>{t("password")}</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder={t("password")}
                  className={cn(!correctCredentials && "border-destructive")}
                  {...field}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  data-cy={'password-input'}
                />
              </FormControl>
              <FormMessage className={'text-destructive'} data-cy={'password-message'}>
                {!correctCredentials && hasTriedToSubmit && "Anmeldedaten inkorrekt"}
              </FormMessage>
            </FormItem>
          )}
        />

        <div className={'w-full'}>

          <Button
            ref={submitButtonRef}
            disabled={!form.formState.isValid && hasTriedToSubmit}
            type="submit"
            className={'w-full'}
            data-cy={'submit'}
          >
            {isLoading ? (
              <LoaderCircle className={'animate-spin'}/>
            ) : (
              <LogIn/>
            )}
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}