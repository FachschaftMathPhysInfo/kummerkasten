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
  NewLabel,
  UpdateLabelDocument,
  UpdateLabelMutation
} from "@/lib/graph/generated/graphql";
import {toast} from "sonner";
import {LoaderCircle, PlusCircle, Save} from "lucide-react";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

const LabelMaxLength = 50;

interface LabelFormProps {
  createMode: boolean;
  label: Label | null;
  closeDialog: () => void
  refreshData: () => void
}

const labelFormSchema = z.object({
  // This field has a max length of 50, but is already restricted by the input itself and the api,
  // so I did not add further length checks
  name: z.string().nonempty({
    message: "Bitte gib dem Label einen Namen",
  }),
  color: z.string().regex(
    new RegExp("^#([A-Fa-f0-9]{6})$"), "Bitte gültigen HEX-Code angeben"
  ),
})

export default function LabelForm(props: LabelFormProps) {
  const [hasTriedToSubmit, setHasTriedToSubmit] = useState<boolean>(false)
  const [color, setColor] = useState(props.label?.color ?? "#7A7777")
  const [loading, setLoading] = useState<boolean>(false)

  const form = useForm<z.infer<typeof labelFormSchema>>({
    resolver: zodResolver(labelFormSchema),
    defaultValues: {
      name: props.label?.name ?? "",
      color: props.label?.color ?? color,
    }
  })

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
    } catch {
      toast.error("Ein Fehler beim Erstellen des Labels ist aufgetreten")
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
    } catch {
      toast.error("Ein Fehler beim Updaten des Labels ist aufgetreten")
    }
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onValidSubmit, () => setHasTriedToSubmit(true))}
        className="space-y-4 w-full"
      >

        <FormField
          control={form.control}
          name="name"
          render={({field}) => (
            <FormItem className={"flex-grow"}>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  data-cy={'label-name-input'}
                  placeholder={props.label?.name ?? ""}
                  maxLength={50}
                  {...field}
                  onChange={e => field.onChange(e.target.value.toLowerCase())}
                />
              </FormControl>
              <div className={'w-full flex justify-between'}>
                <div>
                  <FormMessage/>
                </div>
                <div className={'text-xs text-muted-foreground'}>
                  {field.value.length} / {LabelMaxLength}
                </div>
              </div>
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
                <div className={'flex space-x-8 items-center'}>
                  <div className={'h-full min-h-9 aspect-square flex-shrink-0'}>
                    <input
                      data-cy={'color-picker'}
                      type={"color"}
                      value={color}
                      onChange={e => {
                        const newColor = e.target.value.toUpperCase();
                        setColor(newColor);
                        form.setValue("color", newColor);
                      }}
                      className={'w-full h-full rounded-lg m-0 cursor-pointer'}
                    />
                  </div>
                  <Input
                    type="text"
                    {...field}
                    value={field.value.toUpperCase()}
                    onChange={(e) => {
                      field.onChange(e);
                      setColor(e.target.value.toUpperCase());
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage data-cy={'label-color-message'}/>
            </FormItem>
          )}
        />

        <div className={"flex justify-between items-center gap-x-12 mt-8"}>
          <Button
            data-cy={'close-dialog-button'}
            onClick={props.closeDialog}
            variant={"outline"}
            type={"button"}
            className={"flex-grow-[0.5]"}
          >
            Abbrechen
          </Button>

          <Button
            data-cy={'submit-button'}
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