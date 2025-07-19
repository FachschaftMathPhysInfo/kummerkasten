"use client"

import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import React, {useState} from "react";
import {Save} from "lucide-react";
import {useUser} from "@/components/providers/user-provider";
import {toast} from "sonner";
import {useRouter} from "next/navigation";


const loginFormSchema = z.object({
  mail: z.email("Bitte gib eine E-Mail an."),
  password: z.string("Bitte gib ein Passwort an"),
});

export default function AccountForm() {
  const router = useRouter();
  const {user, login} = useUser()
  const [hasTriedToSubmit, setHasTriedToSubmit] = useState(false);
  const [correctCredentials, setCorrectCredentials] = useState(false);

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      mail: "",
      password: "",
    },
  });


  async function onValidSubmit(userData: z.infer<typeof loginFormSchema>) {
    let ok: boolean

    try{
      ok = await login(userData.mail, userData.password )
    } catch (error) {
      toast.error("Fehler beim Anmelden")
      console.error("Failed logging in user: ", error)
      return
    }

    if (ok) {
      setHasTriedToSubmit(false)
      router.push("/tickets")
    } else {
      setCorrectCredentials(false);
      setHasTriedToSubmit(true)
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onValidSubmit, () => setHasTriedToSubmit(true))}
              className="space-y-4 w-full">

          <FormField
            control={form.control}
            name="mail"
            render={({field}) => (
              <FormItem className={'flex-grow'}>
                <FormLabel>E-Mail</FormLabel>
                <FormControl>
                  <Input placeholder={user?.mail} {...field}/>
                </FormControl>
                <FormMessage className={'text-destructive'}>
                  {hasTriedToSubmit && !correctCredentials && (
                    "Email oder Passwort falsch."
                  )}
                </FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({field}) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} type={"password"}/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />

          <div className={'w-full flex justify-end items-center gap-x-12 mt-8'}>

            <Button
              disabled={!form.formState.isValid && hasTriedToSubmit}
              type="submit"
            >
              <Save/>
              Anmelden
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}