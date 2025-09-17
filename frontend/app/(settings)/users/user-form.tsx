"use client"

import {z} from "zod";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";
import {getClient} from "@/lib/graph/client";
import {CreateUserDocument, CreateUserMutation, GetUserIdByMailDocument, NewUser} from "@/lib/graph/generated/graphql";
import {toast} from "sonner";
import {LoaderCircle, PlusCircle} from "lucide-react";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";

interface UserFormProps {
  closeDialog: () => void
  refreshData: () => void
}

const passwordSchema = z.string()
  .min(12, "Passwort muss mindestens 12 Zeichen lang sein")
  .refine((val) => /[a-z]/.test(val), {
    message: "Passwort muss mindestens einen Kleinbuchstaben enthalten",
  })
  .refine((val) => /[A-Z]/.test(val), {
    message: "Passwort muss mindestens einen Großbuchstaben enthalten",
  })
  .refine((val) => /[0-9]/.test(val), {
    message: "Passwort muss mindestens eine Zahl enthalten",
  })
  .refine((val) => /[^A-Za-z0-9]/.test(val), {
    message: "Passwort muss mindestens ein Sonderzeichen enthalten",
  });

const userFormSchema = z.object({
  firstname: z.string().min(2, {error: "Bitte verwende mindestens 2 Zeichen"}),
  lastname: z.string().min(2, {error: "Bitte verwende mindestens 2 Zeichen"}),
  mail: z.email({error: "Bitte gib ein gültiges Format an"}),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwörter stimmen nicht überein",
});

export default function UserForm(props: UserFormProps) {
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

  async function onValidSubmit(data: z.infer<typeof userFormSchema>) {
    setLoading(true)

    if (await testIfMailExists(data.mail)) {
      form.setError('mail', {message: 'Diese E-Mail-Adresse wird bereits verwendet'})
      return
    }

    const client = getClient();

    const newUser: NewUser = {
      firstname: data.firstname,
      lastname: data.lastname,
      mail: data.mail,
      password: data.password,
    }

    try {
      await client.request<CreateUserMutation>(CreateUserDocument, {user: newUser})
      toast.success("User wurde erfolgreich erstellt")
      setHasTriedToSubmit(false)
      props.refreshData()
      props.closeDialog()
    } catch (error) {
      toast.error("Beim Erstellen des Users ist ein Fehler aufgetreten");
      console.error(error)
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
              <FormLabel>Vorname</FormLabel>
              <FormControl>
                <Input placeholder={"Maxi"} {...field} data-cy={'firstname-input'}/>
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
              <FormLabel>Nachname</FormLabel>
              <FormControl>
                <Input placeholder={"Musterperson"} {...field} data-cy={'lastname-input'}/>
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
              <FormLabel>E-Mail</FormLabel>
              <FormControl>
                <Input placeholder={"maxi.musterperson@mail.de"} {...field} data-cy={'mail-input'}/>
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
              <FormLabel>Passwort</FormLabel>
              <FormControl>
                <Input placeholder={"Passwort"} type={"password"} {...field} data-cy={'password-input'}/>
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
                  placeholder={"Passwort bestätigen"}
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
            Abbrechen
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
            Erstellen
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}