"use client"

import {zodResolver} from "@hookform/resolvers/zod";
import {ControllerRenderProps, useForm} from "react-hook-form";
import {z} from "zod";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import React, {useState} from "react";
import {LogIn} from "lucide-react";
import {useUser} from "@/components/providers/user-provider";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {cn} from "@/lib/utils";


const loginFormSchema = z.object({
  mail: z.email("Bitte gib eine gültige E-Mail an."),
  password: z.string("Bitte gib ein Passwort an."),
});

interface LoginFormProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LoginForm(props: LoginFormProps) {
  const router = useRouter();
  const {login} = useUser()
  const [hasTriedToSubmit, setHasTriedToSubmit] = useState(false);
  const [correctCredentials, setCorrectCredentials] = useState(true);

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
    let ok: boolean

    try {
      ok = await login(userData.mail, userData.password)
      props.setLoading(true)
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onValidSubmit, () => setHasTriedToSubmit(true))}
        className="space-y-4 w-full mt-6"
      >

        <FormField
          control={form.control}
          name="mail"
          render={({field}) => (
            <FormItem className={'flex-grow'}>
              <FormLabel hidden>E-Mail</FormLabel>
              <FormControl>
                <Input
                  placeholder={'E-Mail'}
                  className={cn(!correctCredentials && "border-destructive")}
                  {...field}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({field}) => (
            <FormItem>
              <FormLabel hidden>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder={'Passwort'}
                  type={"password"}
                  className={cn(!correctCredentials && "border-destructive")}
                  {...field}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                />
              </FormControl>
              <FormMessage className={'text-destructive'}>
                {!correctCredentials && hasTriedToSubmit && "Anmeldedaten inkorrekt"}
              </FormMessage>
            </FormItem>
          )}
        />

        <div className={'w-full'}>

          <Button
            disabled={!form.formState.isValid && hasTriedToSubmit}
            type="submit"
            className={'w-full'}
          >
            <LogIn/>
            Anmelden
          </Button>
        </div>
      </form>
    </Form>
  );
}