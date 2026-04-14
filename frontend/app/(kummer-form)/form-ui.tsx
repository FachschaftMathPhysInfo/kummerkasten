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
  FormLabelsQuery, IntConfiguration,
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
import {useTranslations} from "next-intl";
import {useConfiguration} from "@/components/providers/configuration-provider";
import {PUBLIC_CONTENT_LENGTH_KEY, PUBLIC_TITLE_LENGTH_KEY} from "@/lib/constants/configuration-keys";

export default function FormUi() {
  const t = useTranslations("KummerkastenPage.FormUi")
  const tc = useTranslations("Commons")
  const {configuration} = useConfiguration()

  const TITLE_MAX_LENGTH = (configuration.find(c => c.key == PUBLIC_TITLE_LENGTH_KEY) as IntConfiguration).intValue
  const TEXT_MAX_LENGTH = (configuration.find(c => c.key == PUBLIC_CONTENT_LENGTH_KEY) as IntConfiguration).intValue

  const formUiSchema = z.object({
    labels: z.array(z.string()).nonempty({error: tc("fields.errors.empty")}),
    title: z.string().nonempty({error: tc("fields.errors.empty")})
      .max(TITLE_MAX_LENGTH, tc("fields.errors.long", {condition: `${TITLE_MAX_LENGTH} ${tc("words.characters")}`})),
    text: z.string().nonempty({error: tc("fields.errors.empty")})
      .max(TEXT_MAX_LENGTH, tc("fields.errors.long", {condition: `${TEXT_MAX_LENGTH} ${tc("words.characters")}`})),
  });

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

      } catch {
        toast.error(tc("toasts.fetchError"));
      } finally {
        setIsLabelsLoading(false);
      }
    };

    void fetchPublicLabels();
  }, [form, tc]);

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
      toast.success(t("toasts.sendSuccess"));
      setHasTriedToSubmit(false);
      form.reset();
    } catch {
      toast.error(t("toasts.generalError"));
    }
    setLoading(false);
  }

  return (
    <div className="w-full max-w-4xl rounded-lg p-6 my-4 border">
      <h2 className="text-3xl font-semibold text-foreground-muted mb-6 text-center">{t("title")}</h2>
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
                  {t("fields.labels.label")}
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
                  <FormLabel className="text-lg">{t("fields.title.label")}</FormLabel>
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
                    placeholder={t("fields.title.placeholder")}
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
                  <FormLabel className="text-lg">{t("fields.text.label")}</FormLabel>
                  <span className={cn(
                    "text-sm text-muted-foreground",
                    field.value.length > TEXT_MAX_LENGTH && "text-destructive"
                  )}>
                    {field.value.length} / {TEXT_MAX_LENGTH}
                  </span>
                </div>
                <FormControl>
                  <Textarea
                    placeholder={t("fields.text.placeholder")}
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
                {tc("buttons.send")}
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
