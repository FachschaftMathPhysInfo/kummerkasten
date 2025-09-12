"use client"

import {z} from "zod";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";
import {getClient} from "@/lib/graph/client";
import {CreateUserDocument, CreateUserMutation, NewUser} from "@/lib/graph/generated/graphql";
import {toast} from "sonner";
import {LoaderCircle, PlusCircle} from "lucide-react";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

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
                <Input placeholder={"Maxi"} {...field} />
              </FormControl>
              <FormMessage/>
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
                <Input placeholder={"Musterperson"} {...field} />
              </FormControl>
              <FormMessage/>
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
                <Input placeholder={"maxi.musterperson@mail.de"} type={"email"} {...field} />
              </FormControl>
              <FormMessage/>
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
                <Input placeholder={"Passwort"} type={"password"} {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({field}) => (
            <FormItem className={"flex-grow"}>
              <FormControl>
                <Input placeholder={"Passwort bestätigen"} type={"password"} {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <div className={"flex justify-between items-center gap-x-12 mt-8"}>
          <Button
            onClick={props.closeDialog}
            variant={"outline"}
            type={"button"}
            className={"flex-grow-[0.5]"}
          >
            Abbrechen
          </Button>

          <Button
            disabled={(!form.formState.isValid && hasTriedToSubmit) || loading}
            type="submit"
            className={"flex-grow"}
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