"use client";

import {z} from "zod";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState, useEffect} from "react";
import { cn } from "@/lib/utils"
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
    .min(1, "Bitte wähle mindestens ein Label aus."),
  title: z.string().min(1, "Die Zusammenfassung darf nicht leer sein.").max(70, "Die Zusammenfassung ist zu lang."),
  text: z.string().min(1, "Die Nachricht darf nicht leer sein.").max(3000, "Die Nachricht ist zu lang"),
});

export default function FormUi() {
  const form = useForm<z.infer<typeof formUiSchema>>({
    resolver: zodResolver(formUiSchema),
    defaultValues: {
      labels: [],
      title: "",
      text: "",
    },
    mode: "onChange", 
  });
  const [hasTriedToSubmit, setHasTriedToSubmit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [formLabels, setFormLabels] = useState<Label[]>([]);
  const [isLabelsLoading, setIsLabelsLoading] = useState<boolean>(true);
  const {formState: {isSubmitSuccessful, errors} } = form;

  const titleWatch = form.watch("title", "");
  const textWatch = form.watch("text", "");

  useEffect(() => {
    if (isSubmitSuccessful) {
      form.reset();
      setHasTriedToSubmit(false);
    }
    const fetchLabels = async () => {
      try {
        setIsLabelsLoading(true);
        const client = getClient();
        const data = await client.request<FormLabelsQuery>(FormLabelsDocument);
        if (data.formLabels) {
          const filteredLabels = data.formLabels
            .filter((label): label is Label => label !== null)
            .filter(label => label.formLabel);
          setFormLabels(filteredLabels);
        } else {
          setFormLabels([]);
        }
      } catch (err) {
        console.error("Failed to fetch form labels:", err);
        toast.error("Form labels could not be loaded.");
      } finally {
        setIsLabelsLoading(false);
      }
    };
    void fetchLabels();
  }, [form, isSubmitSuccessful]);

  async function onValidSubmit(data: z.infer<typeof formUiSchema>) {
    setLoading(true);
    const client = getClient();

    const newTicket: NewTicket = {
      labels: data.labels,
      originalTitle: data.title,
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
        "Beim Senden des Feedbacks ist ein Fehler aufgetreten."
      );
      console.error(error);
    }
    setLoading(false);
  }

  return (
    <div className="w-full max-w-4xl rounded-lg p-6 my-4 border">
      <h2 className="text-3xl font-semibold text-foreground-muted mb-6 text-center">Deine anonyme Nachricht</h2>
      <FormProvider {...form}>
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
                  <FormLabel className={cn('data-[error=true]:text-destructive text-lg ')}>Worum geht es in deinem Feedback?</FormLabel>
                  {isLabelsLoading && 
                    <div className="flex items-center justify-center">
                      <LoaderCircle className="animate-spin" />
                    </div>}
                  {!isLabelsLoading && formLabels.length> 0 &&  (
                    <div className="flex flex-row flex-wrap">
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
                                <div className={'flex items-center gap-2 mx-2'}>
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
                                  />
                                  <span className={cn('capitalize', hasTriedToSubmit && errors.labels ? 'text-destructive' : '')}>{label.name}</span>
                                </div>
                              </FormControl>
                          </FormItem>
                          );
                      }}
                      />
                  ))}
                    </div>
                  )}
                  <FormMessage/>
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
                    titleWatch.length > 70 && "text-destructive"
                  )}>
                    {titleWatch.length} / 70
                  </span>
                </div>
                <FormControl>
                  <Input className={cn("bg-background text-foreground")}
                    placeholder="Vorlesung ..." 
                    maxLength={70}
                    {...field} />
                </FormControl>
                <FormMessage/>
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
                    textWatch.length > 3000 && "text-destructive"
                  )}>
                    {textWatch.length} / 3000
                  </span>
                </div>
                <FormControl>
                  <Textarea
                    placeholder="Deine anonyme Nachricht"
                    maxLength={3000}
                    className={cn("resize-none text-foreground flex min-h-[180px]  bg-background text-sm",
                                "ring-offset-background focus-visible:outline-none focus-visible:ring-2",
                                "focus-visible:ring-ring focus-visible:ring-offset-2 ",)}
                    {...field} />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <Button
            disabled={!form.formState.isValid || loading}
            type="submit"
            className="w-full flex justify-center items-center gap-2"
          >
            {loading ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <Send/>
            )}
            Absenden
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}
