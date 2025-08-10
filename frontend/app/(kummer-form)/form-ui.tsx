"use client";

import {z} from "zod";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";
import {getClient} from "@/lib/graph/client";
import {
  CreateTicketMutation,
  NewTicket,
  FormLabels,
  CreateTicketDocument,
} from "@/lib/graph/generated/graphql";
import {toast} from "sonner";
import {LoaderCircle, Send} from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {Checkbox} from "@/components/ui/checkbox";

const formUiSchema = z.object({
  labels: z
    .array(z.nativeEnum(FormLabels))
    .min(1, "Bitte wählen Sie mindestens ein Label aus."),
  title: z.string().min(1, "Die Zusammenfassung darf nicht leer sein."),
  text: z.string().min(1, "Die Nachricht darf nicht leer sein."),
});

export default function FormUi() {
  const form = useForm<z.infer<typeof formUiSchema>>({
    resolver: zodResolver(formUiSchema),
    defaultValues: {
      labels: [],
      title: "",
      text: "",
    },
  });
  const [hasTriedToSubmit, setHasTriedToSubmit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  async function onValidSubmit(data: z.infer<typeof formUiSchema>) {
    setLoading(true);
    const client = getClient();

    const newTicket: NewTicket = {
      labels: data.labels,
      title: data.title,
      text: data.text,
    };

    try {
      await client.request<CreateTicketMutation>(CreateTicketDocument, {
        ticket: newTicket,
      });
      toast.success("Feedback wurde erfolgreich gesendet");
      setHasTriedToSubmit(false);
      form.reset();
    } catch (error) {
      toast.error(
        "Beim Senden des Feedbacks ist ein Fehler aufgetreten"
      );
      console.error(error);
    }
    setLoading(false);
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onValidSubmit, () =>
          setHasTriedToSubmit(true)
        )}
        className="space-y-4 w-full"
      >
        {/* Label selection */}
        <FormField
            control={form.control}
            name="labels"
            render={() => (
                <FormItem className="space-y-3">
                <FormLabel>An wen ist das Feedback gerichtet?</FormLabel>
                {Object.values(FormLabels).map((label) => (
                    <FormField
                    key={label}
                    control={form.control}
                    name="labels"
                    render={({field}) => {
                        return (
                        <FormItem
                            key={label}
                            className="flex flex-row items-start space-x-3 space-y-0"
                        >
                            <FormControl>
                            <Checkbox
                                checked={field.value?.includes(label)}
                                onCheckedChange={(checked) => {
                                return checked
                                    ? field.onChange([...field.value, label])
                                    : field.onChange(
                                        field.value?.filter((value) => value !== label)
                                    );
                                }}
                            />
                            </FormControl>
                            <FormLabel className="font-normal capitalize">
                            {label}
                            </FormLabel>
                        </FormItem>
                        );
                    }}
                    />
                ))}
                <FormMessage />
                </FormItem>
            )}
        />

        {/* Summary field */}
        <FormField
          control={form.control}
          name="title"
          render={({field}) => (
            <FormItem>
              <FormLabel>Zusammenfassung</FormLabel>
              <FormControl>
                <Input placeholder="Zusammenfassung" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Feedback text field */}
        <FormField
          control={form.control}
          name="text"
          render={({field}) => (
            <FormItem>
              <FormLabel>Feedback</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Deine anonyme Nachricht"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit button */}
        <Button
          disabled={(!form.formState.isValid && hasTriedToSubmit) || loading}
          type="submit"
          className="w-full flex justify-center items-center gap-2"
        >
          {loading ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <Send />
          )}
          Absenden
        </Button>
      </form>
    </FormProvider>
  );
}