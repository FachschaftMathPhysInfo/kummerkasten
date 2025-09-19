"use client"

import {z} from "zod";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect, useState} from "react";
import {getClient} from "@/lib/graph/client";
import {
  CreateLabelDocument,
  CreateLabelMutation, FormLabelsDocument,
  Label,
  NewLabel,
  UpdateLabelDocument,
  UpdateLabelMutation
} from "@/lib/graph/generated/graphql";
import {toast} from "sonner";
import {LoaderCircle, PlusCircle, Save} from "lucide-react";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {cn} from "@/lib/utils";

const LabelMaxLength = 50;

interface LabelFormProps {
  createMode: boolean;
  originalLabel: Label | null;
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
  isFormLabel: z.boolean(),
})

export default function LabelForm(props: LabelFormProps) {
  const [hasTriedToSubmit, setHasTriedToSubmit] = useState<boolean>(false)
  const [color, setColor] = useState(props.originalLabel?.color ?? "#7A7777")
  const [loading, setLoading] = useState<boolean>(false)
  const [isLastFormLabel, setIsLastFormLabel] = useState(false)

  useEffect(() => {
    const checkIfIsLastFormLabel = async () => {
      const client = getClient();
      const data = await client.request(FormLabelsDocument)
      setIsLastFormLabel(data.formLabels?.length === 1)
    }

    void checkIfIsLastFormLabel()
  }, [props.originalLabel])

  const form = useForm<z.infer<typeof labelFormSchema>>({
    resolver: zodResolver(labelFormSchema),
    defaultValues: {
      name: props.originalLabel?.name ?? "",
      color: props.originalLabel?.color ?? color,
      isFormLabel: props.originalLabel?.formLabel ?? false
    }
  })

  async function onValidSubmit(data: z.infer<typeof labelFormSchema>) {
    setLoading(true)

    if (props.createMode) {
      await createLabel(data.name.trim(), data.color, data.isFormLabel)
    } else {
      if (!props.originalLabel) return
      await updateLabel(props.originalLabel.id, data.name.trim(), data.color, data.isFormLabel)
    }

    setLoading(false)
  }

  async function createLabel(name: string, color: string, isFormLabel: boolean) {
    const client = getClient();
    const label: NewLabel = {name: name, color: color, formLabel: isFormLabel};

    try {
      await client.request<CreateLabelMutation>(CreateLabelDocument, {label: label})
      toast.success("Label erstellt!")
      props.refreshData()
      props.closeDialog()
    } catch (error) {
      if (String(error).includes('unique constraint')) {
        form.setError("name", {message: "Ein Label mit diesem Namen existiert bereits"})
      } else {
        toast.error("Ein Fehler beim Erstellen des Labels ist aufgetreten")
      }
    }
  }

  async function updateLabel(id: string, name: string, color: string, isFormLabel: boolean) {
    const client = getClient();
    const label: NewLabel = {name: name, color: color, formLabel: isFormLabel};

    try {
      await client.request<UpdateLabelMutation>(UpdateLabelDocument, {id: id, label: label})
      toast.success("Label erfolgreich updated!")
      props.refreshData()
      props.closeDialog()
    } catch (error) {
      if (String(error).includes('unique constraint')) {
        form.setError("name", {message: "Ein Label mit diesem Namen existiert bereits"})
      } else {
        toast.error("Ein Fehler beim Aktualisieren des Labels ist aufgetreten")
      }
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
                  data-cy={'name-input'}
                  placeholder={props.originalLabel?.name ?? ""}
                  maxLength={50}
                  {...field}
                  onChange={e => field.onChange(e.target.value)}
                />
              </FormControl>
              <div className={'w-full flex justify-between'}>
                <div>
                  <FormMessage data-cy={'name-input-message'}/>
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
                      data-cy={'color-picker-input'}
                      type={"color"}
                      value={color}
                      onChange={e => {
                        const newColor = e.target.value.toUpperCase();
                        setColor(newColor);
                        form.setValue("color", newColor);
                        form.clearErrors("color");
                        if (hasTriedToSubmit) void form.trigger("color")
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
                      if (hasTriedToSubmit) void form.trigger('color')
                    }}
                    data-cy={'color-input'}
                  />
                </div>
              </FormControl>
              <FormMessage data-cy={'color-input-message'}/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isFormLabel"
          render={({field}) => (
            <FormItem className={"flex-grow"}>
              <div className={'flex items-center gap-4 mt-2'}>
                <FormLabel className={cn(isLastFormLabel && 'text-muted-foreground')}>Öffentliche Label</FormLabel>
                <FormControl>
                  <Checkbox
                    disabled={isLastFormLabel}
                    checked={field.value}
                    onCheckedChange={checked =>
                      form.setValue('isFormLabel', checked as boolean)
                    }
                    data-cy={'public-checkbox'}
                  />
                </FormControl>
              </div>
              <FormMessage className={'-mt-1'}/>
              <FormDescription>
                {isLastFormLabel ? (
                  "Dieses Label ist das letzte öffentliche Label. Wenn es privat gemacht werden soll, muss erst mindestens ein anderes Label öffentlich gemacht werden."
                ) : (
                  "Ist ein Label als öffentliches Label markiert, können Studis es beim Erstellen eines Tickets auswählen"
                )}
              </FormDescription>
            </FormItem>
          )}
        />

        <div className={"flex justify-between items-center gap-x-12 mt-8"}>
          <Button
            data-cy={'cancel-button'}
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