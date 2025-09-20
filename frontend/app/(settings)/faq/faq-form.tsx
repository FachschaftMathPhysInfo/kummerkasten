"use client";

import {z} from "zod";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect, useState} from "react";
import {getClient} from "@/lib/graph/client";
import {
  CreateQuestionAnswerPairDocument,
  QuestionAnswerPair,
  UpdateQuestionAnswerPairDocument,
} from "@/lib/graph/generated/graphql";
import {toast} from "sonner";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useQAPs} from "@/components/providers/qap-provider";
import {CirclePlus, Save} from "lucide-react";

interface FaqFormProps {
  qap: QuestionAnswerPair | null;
  closeDialog: () => void;
}


export default function FaqForm({qap, closeDialog}: FaqFormProps) {
  const [loading, setLoading] = useState(false);
  const {qaps, triggerQAPRefetch} = useQAPs()
  const [maxOrder, setMaxOrder] = useState(Math.max(0, ...qaps.map(q => q.position)))
  const createMode = !qap

  const faqFormSchema = z.object({
    question: z.string().nonempty({error: "Bitte gib eine Frage an"}),
    answer: z.string().nonempty({error: "Bitte gib eine Frage an"}),
    position: z.number()
      .min(1, {error: "Bitte gib einen Wert über 0 an"})
      .max(maxOrder + 1, {error: `Bitte gib einen Wert unter ${maxOrder + 1} an`}),
  })

  const form = useForm<z.infer<typeof faqFormSchema>>({
    resolver: zodResolver(faqFormSchema),
    defaultValues: {
      question: qap?.question ?? "",
      answer: qap?.answer ?? "",
      position: qap?.position ? qap.position + 1 : maxOrder + 1
    },
  });

  useEffect(() => {
    setMaxOrder(Math.max(0, ...qaps.map(q => q.position)))
  }, [qaps])

  const onValidSubmit = async (data: z.infer<typeof faqFormSchema>) => {
    setLoading(true);
    if (createMode) await createQAP(data)
    else await updateQAP(data)

    closeDialog();
    triggerQAPRefetch();
    setLoading(false);
  }

  async function createQAP(data: z.infer<typeof faqFormSchema>) {
    const client = getClient()
    try {
      await client.request(CreateQuestionAnswerPairDocument, {questionAnswerPair: data})
    } catch {
      toast.error('Beim Erstellen ist ein Fehler aufgetreten')
    }
  }

  async function updateQAP(data: z.infer<typeof faqFormSchema>) {
    if(!qap) {
      toast.error('Ein Fehler ist aufgetreten')
      return
    }

    const client = getClient()
    try {
      await client.request(
        UpdateQuestionAnswerPairDocument,
        {id: qap.id, questionAnswerPair: data})
    } catch {
      toast.error('Beim Aktualisieren des FAQ ist ein Fehler aufgetreten')
    }
  }


  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onValidSubmit)}
        className="space-y-4 w-full"
      >
        <FormField
          control={form.control}
          name="question"
          render={({field, fieldState}) => (
            <FormItem>
              <FormLabel className={fieldState.invalid ? "text-destructive" : ""}>Frage</FormLabel>
              <FormControl>
                <Input
                  placeholder="Frage"
                  {...field}
                  aria-invalid={fieldState.invalid}
                  className={[fieldState.invalid ? "border-destructive ring-1" : ""].join(" ")}
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="answer"
          render={({field, fieldState}) => (
            <FormItem>
              <FormLabel className={fieldState.invalid ? "text-destructive" : ""}>Antwort</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Antwort"
                  rows={7}
                  {...field}
                  aria-invalid={fieldState.invalid}
                  className={`resize-none ${fieldState.invalid ? "border-destructive ring-1" : ""}`}
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="position"
          render={({field}) => (
            <FormItem>
              <FormLabel>
                Position
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  value={field.value + 1}
                  onChange={e => {
                    if (Number.isNaN(parseInt(e.target.value))) field.onChange(0)
                    else field.onChange(parseInt(e.target.value) - 1)
                  }}
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />


        <div className="flex justify-between gap-2 mt-4">
          <Button type="button" variant="outline" className="flex-1" onClick={closeDialog}>
            Abbrechen
          </Button>
          <Button type="submit" className="flex-1" disabled={loading}>
            {createMode ? (
              <><CirclePlus/> Erstellen</>
            ) : (
              <><Save/> Speichern</>
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
