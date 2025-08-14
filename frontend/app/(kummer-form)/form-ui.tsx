"use client";

import {z} from "zod";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState, useEffect} from "react";
import {getClient} from "@/lib/graph/client";
import {
  CreateTicketMutation,
  NewTicket,
  CreateTicketDocument,
  FormLabelsQuery,
  FormLabelsDocument,
  Label
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
    .array(z.string())
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
  const [formLabels, setFormLabels] = useState<Label[]>([]);
  const [isLabelsLoading, setIsLabelsLoading] = useState<boolean>(true);
  const [labelsError, setLabelsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLabels = async () => {
      try {
        setIsLabelsLoading(true);
        const client = getClient();
        const data = await client.request<FormLabelsQuery>(FormLabelsDocument);
        if (data.labels) {
          const filteredLabels = data.labels
            .filter((label): label is Label => label !== null)
            .filter(label => label.formLabel);
          setFormLabels(filteredLabels);
        } else {
          setFormLabels([]);
        }
      } catch (err) {
        console.error("Failed to fetch form labels:", err);
        setLabelsError("Form labels could not be loaded.");
      } finally {
        setIsLabelsLoading(false);
      }
    };
    void fetchLabels();
  }, []);

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
        <FormField
            control={form.control}
            name="labels"
            render={() => (
                <FormItem className="space-y-3">
                <FormLabel>An wen ist das Feedback gerichtet?</FormLabel>
                {isLabelsLoading && <div className="flex items-center justify-center"><LoaderCircle className="animate-spin" /></div>}
                {labelsError && <p className="text-red-500">{labelsError}</p>}
                {!isLabelsLoading && formLabels.length > 0 && formLabels.map((label) => (
                    <FormField
                    key={label.id}
                    control={form.control}
                    name="labels"
                    render={({field}) => {
                        return (
                        <FormItem
                            key={label.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                        >
                            <FormControl>
                            <Checkbox
                                checked={field.value?.includes(label.name)}
                                onCheckedChange={(checked) => {
                                return checked
                                    ? field.onChange([...field.value, label.name])
                                    : field.onChange(
                                        field.value?.filter((value) => value !== label.name)
                                    );
                                }}
                            />
                            </FormControl>
                            <FormLabel className="font-normal capitalize">
                            {label.name}
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
