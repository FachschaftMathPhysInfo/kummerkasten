"use client"

import {z} from "zod";
import {Ticket, TicketState, UpdateTicket} from "@/lib/graph/generated/graphql";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
import {useEffect, useState} from "react";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {LoaderCircle, PlusCircle} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useLabels} from "@/components/providers/label-provider";
import LabelSelection from "@/components/label-selection";
import {useTickets} from "@/components/providers/ticket-provider";


interface TicketEditDialogProps {
  ticket: Ticket | null;
  closeDialog: () => void
  refreshData: () => void
}

const ticketEditSchema = z.object({
  title: z.string().nonempty(),
  state: z.enum(TicketState),
  labels: z.array(z.string().min(1, {message: "Bitte wähle mindestens ein Label aus."})),
})

type TicketEditFormData = z.infer<typeof ticketEditSchema>

export default function TicketEditDialog(props: TicketEditDialogProps) {
  const {labels} = useLabels()
  const {updateTicket, addLabelsToTicket, removeLabelsFromTicket} = useTickets()
  const form = useForm<TicketEditFormData>({
    resolver: zodResolver(ticketEditSchema),
    defaultValues: {
      title: "",
      state: props.ticket?.state,
      labels: props.ticket?.labels?.map(l => l.id)
    }
  })
  const [hasTriedToSubmit, setHasTriedToSubmit] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (props.ticket) {
      form.reset({
        title: props.ticket.title,
        state: props.ticket.state,
        labels: props.ticket.labels?.map(l => l.id) || [],
      });
    }
  }, [props.ticket, form]);

  async function onValidSubmit(data: TicketEditFormData) {
    if (!props.ticket?.id) return;
    setLoading(true)

    const ticketId = props.ticket.id;
    const initialLabelIds = props.ticket.labels?.map(l => l.id) || [];
    const selectedLabelIds = data.labels || [];

    const labelsToAdd = selectedLabelIds.filter(id => !initialLabelIds.includes(id));
    const labelsToRemove = initialLabelIds.filter(id => !selectedLabelIds.includes(id));

    const updatedTicket: UpdateTicket = {
      title: data.title,
      state: data.state,
    }

    const updateError = await updateTicket(ticketId, updatedTicket)
    const addLabelsError = await addLabelsToTicket(ticketId, labelsToAdd)
    const removeLabelsError = await removeLabelsFromTicket(ticketId, labelsToRemove)

    if (!updateError && !addLabelsError && !removeLabelsError) {
      toast.success("Ticket wurde aktualisiert.")
      setHasTriedToSubmit(true)
      props.closeDialog()
    } else {
      toast.error("Beim Aktualisieren des Tickets ist ein Fehler aufgetreten.")
    }

    setLoading(false)
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onValidSubmit, () =>
          setHasTriedToSubmit(true))}
        className="space-y-4 w-full">
        <FormField
          control={form.control}
          name="title"
          render={({field}) => (
            <FormItem className="flex-grow">
              <FormLabel>Titel</FormLabel>
              <FormControl>
                <Input placeholder={"Titel"}{...field}/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="state"
          render={({field}) => (
            <FormItem className="flex-grow">
              <FormLabel>TicketStatus</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status auswählen"/>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(TicketState).map((state) => (
                      <SelectItem key={state} value={state}>
                        {state === "NEW"
                          ? "Neu"
                          : state === "OPEN"
                            ? "Offen"
                            : "Fertig"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="labels"
          render={() => (
            <FormItem className="flex-grow">
              <FormLabel>Labels</FormLabel>
              <FormControl>
                <LabelSelection
                  labels={labels}
                  selectedLabels={labels.filter(label =>
                    form.getValues('labels').includes(label.id)
                  )}
                  setLabels={(labels) => {
                    const labelIds = labels.map(label => label.id)
                    form.setValue('labels', labelIds)
                  }}
                />
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
            Speichern
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}