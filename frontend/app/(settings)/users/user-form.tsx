"use client"

import {z} from "zod";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";
import {getClient} from "@/lib/graph/client";
import {CreateUserDocument, CreateUserMutation, NewUser} from "@/lib/graph/generated/graphql";
import {toast} from "sonner";
import {PlusCircle} from "lucide-react";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

interface UserFormProps {
  closeDialog: () => void
  refreshData: () => void
}

export default function UserForm(props: UserFormProps) {
  const userFormSchema = z.object({
    firstname: z.string().min(2),
    lastname: z.string().min(2),
    mail: z.email(),
    password: z.string().min(6),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwörter stimmen nicht überein.",
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

  async function onValidSubmit(data: z.infer<typeof userFormSchema>) {
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
              <FormLabel>Vorname</FormLabel>
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
                <Input placeholder={"Passwort"} {...field} />
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
                <Input placeholder={"Passwort bestätigen"} {...field} />
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
            disabled={!form.formState.isValid && hasTriedToSubmit}
            type="submit"
            className={"flex-grow"}
          >
            <PlusCircle/>
            Erstellen
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}