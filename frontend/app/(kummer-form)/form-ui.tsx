"use client";

import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect, useState} from "react";
import {cn} from "@/lib/utils"
import {getClient} from "@/lib/graph/client";
import {
  CreateTicketDocument,
  CreateTicketMutation,
  FormLabelsDocument,
  FormLabelsQuery,
  Label,
  NewTicket
} from "@/lib/graph/generated/graphql";
import {toast} from "sonner";
import {LoaderCircle, Send} from "lucide-react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {Checkbox} from "@/components/ui/checkbox";
import {defaultLabel} from "@/lib/graph/defaultTypes";

const TITLE_MAX_LENGTH = 70
const TEXT_MAX_LENGTH = 3000

const formUiSchema = z.object({
  labels: z.array(z.string())
    .nonempty({error: "Bitte wähle mindestens ein Label aus."}),
  title: z.string().nonempty({error: "Die Zusammenfassung darf nicht leer sein."})
    .max(TITLE_MAX_LENGTH, "Die Zusammenfassung ist zu lang."),
  text: z.string().nonempty({error: "Die Nachricht darf nicht leer sein."})
    .max(TEXT_MAX_LENGTH, "Die Nachricht ist zu lang"),
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

  useEffect(() => {
    const fetchPublicLabels = async () => {
      try {
        setIsLabelsLoading(true);
        const client = getClient();
        const data = await client.request<FormLabelsQuery>(FormLabelsDocument);
        if (!data.formLabels) return;
        const filteredLabels = data.formLabels
          .filter((label) => !!label)
          .filter(label => label.formLabel)
          .map(label => ({...defaultLabel, ...label}));

        setFormLabels(filteredLabels);

      } catch (err) {
        console.error("Failed to fetch form labels:", err);
        toast.error("Das Formular konnte nicht fertig geladen werden. Versuche es später erneut");
      } finally {
        setIsLabelsLoading(false);
      }
    };

    void fetchPublicLabels();
  }, [form]);

  async function onValidSubmit(data: z.infer<typeof formUiSchema>) {
    setLoading(true);
    const client = getClient();

    const newTicket: NewTicket = {
      labels: data.labels,
      originalTitle: data.title.trim(),
      text: data.text.trim(),
    };

    try {
      await client.request<CreateTicketMutation>(CreateTicketDocument, {ticket: newTicket});
      toast.success("Feedback wurde erfolgreich gesendet");
      setHasTriedToSubmit(false);
      form.reset();
    } catch (error) {
      toast.error("Beim Senden des Feedbacks ist ein Fehler aufgetreten.");
      console.error(error);
    }
    setLoading(false);
  }

  return (
    <div className="w-full max-w-4xl rounded-lg p-6 my-4 border">
      <h2 className="text-3xl font-semibold text-foreground-muted mb-6 text-center">Deine anonyme Nachricht</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onValidSubmit, () =>
            setHasTriedToSubmit(true)
          )}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="labels"
            render={() => (
              <FormItem>
                <FormLabel className={cn('data-[error=true]:text-destructive text-lg ')}>
                  Worum geht es in deinem Feedback?
                </FormLabel>
                {isLabelsLoading &&
                  <div className="flex items-center justify-center">
                    <LoaderCircle className="animate-spin"/>
                  </div>}
                {!isLabelsLoading && formLabels.length > 0 && (
                  <div className="flex flex-row flex-wrap" data-cy="kummerform-labels">
                    {formLabels.map((label) => (
                      <FormField
                        key={label.id}
                        control={form.control}
                        name="labels"
                        render={({field}) => {
                          return (
                            <FormItem
                              key={label.id}
                            >
                              <FormControl>
                                <div className={'flex items-center gap-2 mx-2'} data-cy={`label-${label.name}`}>
                                  <Checkbox
                                    className={cn("h-4 w-4 shrink-0 rounded-sm ring-offset-background focus-visible:outline-none focus-visible:border-2")}
                                    checked={field.value?.includes(label.name)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, label.name])
                                        : field.onChange(
                                          field.value?.filter((value) => value !== label.name)
                                        );
                                    }}
                                    data-cy={`kummerform-label-checkbox-${label.id}`}
                                  />
                                  <span
                                    className={cn(
                                      'capitalize',
                                      hasTriedToSubmit && form.formState.errors.labels && 'text-destructive'
                                    )}
                                    data-cy={`label-name`}
                                  >
                                    {label.name}
                                  </span>
                                </div>
                              </FormControl>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                )}
                <FormMessage data-cy={'kummerform-labels-message'}/>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({field}) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel className="text-lg">Titel</FormLabel>
                  <span className={cn(
                    "text-sm text-muted-foreground",
                    field.value.length > TITLE_MAX_LENGTH && "text-destructive"
                  )}>
                    {field.value.length} / {TITLE_MAX_LENGTH}
                  </span>
                </div>
                <FormControl>
                  <Input
                    className={cn("bg-background text-foreground")}
                    placeholder="Vorlesung ..."
                    maxLength={TITLE_MAX_LENGTH}
                    data-cy={'kummerform-title-input'}
                    {...field}
                  />
                </FormControl>
                <FormMessage data-cy={'kummerform-title-message'}/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="text"
            render={({field}) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel className="text-lg">Feedback</FormLabel>
                  <span className={cn(
                    "text-sm text-muted-foreground",
                    field.value.length > TEXT_MAX_LENGTH && "text-destructive"
                  )}>
                    {field.value.length} / {TEXT_MAX_LENGTH}
                  </span>
                </div>
                <FormControl>
                  <Textarea
                    placeholder="Deine anonyme Nachricht"
                    maxLength={TEXT_MAX_LENGTH}
                    className={cn("resize-none text-foreground flex min-h-[180px]  bg-background text-sm",
                      "ring-offset-background focus-visible:outline-none focus-visible:ring-2",
                      "focus-visible:ring-ring focus-visible:ring-offset-2 ",)}
                    data-cy="kummerform-text-input"
                    {...field} />
                </FormControl>
                <FormMessage data-cy={'kummerform-text-message'}/>
              </FormItem>
            )}
          />
          <Button
            disabled={!form.formState.isValid && hasTriedToSubmit || loading}
            type="submit"
            className="w-full flex justify-center items-center gap-2"
            data-cy="kummerform-send"
          >
            {loading ? (
              <LoaderCircle className="animate-spin"/>
            ) : (
              <>
                <Send/>
                Absenden
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
