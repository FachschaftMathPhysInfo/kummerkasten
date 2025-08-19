"use client"

import {z} from "zod";
import {
    AddLabelsToTicketDocument,
    AddLabelsToTicketMutation,
    AllLabelsDocument,
    AllLabelsQuery,
    Label,
    RemoveLabelsFromTicketDocument,
    RemoveLabelsFromTicketMutation,
    Ticket,
    TicketState,
    UpdateTicket,
    UpdateTicketDocument,
    UpdateTicketMutation
} from "@/lib/graph/generated/graphql";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {getClient} from "@/lib/graph/client";
import {toast} from "sonner";
import {useEffect, useState} from "react";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Check, LoaderCircle, PlusCircle} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Command, CommandGroup, CommandInput, CommandItem} from "@/components/ui/command";
import {cn} from "@/lib/utils";

interface TicketEditDialogProps {
    ticket: Ticket | null;
    closeDialog: () => void
    refreshData: () => void
}

const ticketEditSchema = z.object({
    title: z.string().nonempty(),
    text: z.string().nonempty(),
    note: z.string(),
    state: z.enum(TicketState),
    labels: z.array(z.string().min(1, {message: "Bitte wähle mindestens ein Label aus."})),
})

type TicketEditFormData = z.infer<typeof ticketEditSchema>

export default function TicketEditDialog(props: TicketEditDialogProps) {
    const [allLabels, setAllLabels] = useState<Label[]>([]);
    const form = useForm<TicketEditFormData>({
        resolver: zodResolver(ticketEditSchema),
        defaultValues: {
            title: "",
            text: "",
            note: "",
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
                text: props.ticket.text,
                note: props.ticket.note ?? "",
                state: props.ticket.state,
                labels: props.ticket.labels?.map(l => l.id) || [],
            });
        }
    }, [props.ticket, form]);


    useEffect(() => {
        async function fetchLabels() {
            const client = getClient();
            const data = await client.request<AllLabelsQuery>(AllLabelsDocument);
            setAllLabels((data.labels ?? []).filter((l): l is Label => l !== null));
        }

        fetchLabels();
    }, []);


    async function onValidSubmit(data: TicketEditFormData) {
        if (!props.ticket?.id) return;
        setLoading(true)
        const client = getClient();

        const ticketId = props.ticket.id;
        const initialLabelIds = props.ticket.labels?.map(l => l.id) || [];
        const selectedLabelIds = data.labels || [];

        const labelsToAdd = selectedLabelIds.filter(id => !initialLabelIds.includes(id));
        const labelsToRemove = initialLabelIds.filter(id => !selectedLabelIds.includes(id));

        const updatedTicket: UpdateTicket = {
            title: data.title,
            text: data.text,
            note: data.note,
            state: data.state,
        }

        try {
            await client.request<UpdateTicketMutation>(UpdateTicketDocument, {
                id: props.ticket.id,
                ticket: updatedTicket
            })
            if (labelsToAdd.length) {
                const labelsToAddAssignments = labelsToAdd.map(labelID => ({
                    labelID,
                    ticketID: ticketId
                }));
                await client.request<AddLabelsToTicketMutation>(AddLabelsToTicketDocument, {assignments: labelsToAddAssignments});
            }
            if (labelsToRemove.length) {
                const labelsToRemoveAssignments = labelsToRemove.map(labelID => ({
                    labelID,
                    ticketID: ticketId
                }));
                await client.request<RemoveLabelsFromTicketMutation>(RemoveLabelsFromTicketDocument, {assignments: labelsToRemoveAssignments})
            }
            toast.success("Ticket wurde aktualisiert.")
            setHasTriedToSubmit(true)
            props.closeDialog()
            props.refreshData()
        } catch (error) {
            toast.error("Beim Aktualisieren des Tickets ist ein Fehler aufgetreten.")
            console.error(error)
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
                                                    ? "New"
                                                    : state === "OPEN"
                                                        ? "Open"
                                                        : "Closed"}
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
                    render={({field}) => (
                        <FormItem className="flex-grow">
                            <FormLabel>Labels</FormLabel>
                            <FormControl>
                                <Command>
                                    <CommandInput placeholder="Labels suchen..."/>
                                    <CommandGroup className="max-h-48 overflow-y-auto">
                                        {allLabels.map((label) => {
                                            const isSelected = field.value?.includes(label.id);
                                            return (
                                                <CommandItem
                                                    key={label.id}
                                                    value={label.name}
                                                    onSelect={() => {
                                                        if (isSelected) {
                                                            field.onChange(field.value.filter((l) => l !== label.id));
                                                        } else {
                                                            field.onChange([...(field.value || []), label.id]);
                                                        }
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            isSelected ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    {label.name}
                                                </CommandItem>
                                            );
                                        })}
                                    </CommandGroup>
                                </Command>
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