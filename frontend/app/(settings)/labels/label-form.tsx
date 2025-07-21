"use client"

import {z} from "zod";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";
import {getClient} from "@/lib/graph/client";
import {
  CreateLabelDocument,
  CreateLabelMutation,
  Label,
  NewLabel, UpdateLabelDocument,
  UpdateLabelMutation
} from "@/lib/graph/generated/graphql";
import {toast} from "sonner";
import {LoaderCircle, PlusCircle, Save} from "lucide-react";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

interface LabelFormProps {
  createMode: boolean;
  label: Label | null;
  closeDialog: () => void
  refreshData: () => void
}

const labelFormSchema = z.object({
  name: z.string().min(2),
  color: z.string().min(2),
})

export default function LabelForm(props: LabelFormProps) {
  const form = useForm<z.infer<typeof labelFormSchema>>({
    resolver: zodResolver(labelFormSchema),
    defaultValues: {
      name: props.label?.name ?? "",
      color: props.label?.color ?? "",
    }
  })

  const [hasTriedToSubmit, setHasTriedToSubmit] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  if (!props.createMode && !props.label) {
    toast.error("Ein Fehler ist aufgetreten")
    console.error("Failed editing label: Label not provided")
    return null;
  }

  async function onValidSubmit(data: z.infer<typeof labelFormSchema>) {
    setLoading(true)

    if (props.createMode) {
      await createLabel(data.name, data.color)
    } else {
      if (!props.label) return
      await updateLabel(props.label?.id, data.name, data.color)
    }

    setLoading(false)
  }

  async function createLabel(name: string, color: string) {
    const client = getClient();
    const label: NewLabel = {name: name, color: color};

    try {
      await client.request<CreateLabelMutation>(CreateLabelDocument, {label: label})
      toast.success("Label erstellt!")
      props.refreshData()
      props.closeDialog()
    } catch (err) {
      toast.error("Ein Fehler beim Erstellen des Labels ist aufgetreten")
      console.error("Failed creating label: ", err)
    }
  }

  async function updateLabel(id: string, name: string, color: string) {
    const client = getClient();
    const label: NewLabel = {name: name, color: color};

    try {
      await client.request<UpdateLabelMutation>(UpdateLabelDocument, {id: id, label: label})
      toast.success("Label erfolgreich updated!")
      props.refreshData()
      props.closeDialog()
    } catch (err) {
      toast.error("Ein Fehler beim Updaten des Labels ist aufgetreten")
      console.error("Failed updating label: ", err)
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
          name="name"
          render={({field}) => (
            <FormItem className={"flex-grow"}>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder={props.label?.name ?? ""} {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({field}) => (
            <FormItem className={"flex-grow"}>
              <FormLabel>Farbe</FormLabel>
              <FormControl>
                <Input placeholder={props.label?.color ?? ""} {...field} />
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
            {loading ? (<LoaderCircle/>) : props.createMode ?
              (
                <PlusCircle/>
              ) : (
                <Save/>
              )}
            {props.createMode ? "Erstellen" : "Speichern"}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}