"use client";

import {z} from "zod";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect, useState} from "react";
import {QuestionAnswerPair, UpdateQuestionAnswerPair,} from "@/lib/graph/generated/graphql";
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

const QUESTION_MAX_LENGTH = 100
const ANSWER_MAX_LENGTH = 700


export default function FaqForm({qap, closeDialog}: FaqFormProps) {
  const [loading, setLoading] = useState(false);
  const {qaps, createQap, updateQap} = useQAPs()
  // maxPosition is the highest OCCUPIED zero-based index
  const [maxPosition, setMaxPosition] = useState(qaps.length - 1)
  const createMode = !qap

  const faqFormSchema = z.object({
    question: z.string().nonempty({error: "Bitte gib eine Frage an"}),
    answer: z.string().nonempty({error: "Bitte gib eine Antwort an"}),
    position: z.int({error: "Bitte gib eine ganze Zahl an"})
      .min(0, {error: "Bitte gib einen Wert über 0 an"}),
  })

  const form = useForm<z.infer<typeof faqFormSchema>>({
    resolver: zodResolver(faqFormSchema),
    defaultValues: {
      question: qap?.question ?? "",
      answer: qap?.answer ?? "",
      position: qap?.position ? qap.position : maxPosition + 1
    },
  });

  useEffect(() => {
    setMaxPosition(qaps.length - 1)
  }, [qaps])

  useEffect(() => {
    if (qap) {
      form.reset({
        question: qap.question,
        answer: qap.answer,
        position: qap.position,
      });
    } else {
      form.reset({
        question: "",
        answer: "",
        position: maxPosition + 1,
      });
    }
  }, [qap, maxPosition]);

  const onValidSubmit = async (data: z.infer<typeof faqFormSchema>) => {
    setLoading(true);
    let ok: boolean
    const trimmedData = {
      question: data.question.trim(),
      answer: data.answer.trim(),
      position: data.position,
    }
    if (createMode) ok = await createQAPHandler(trimmedData)
    else ok = await updateQAPHandler(trimmedData)

    if (ok) {
      form.reset()
      closeDialog();
    }

    setLoading(false);
  }

  async function createQAPHandler(data: z.infer<typeof faqFormSchema>) {
    const error = await createQap(data)

    if (!error) {
      return true
    } else {
      if (String(error).includes('already exists')) form.setError('question', {message: 'Diese Frage existiert bereits'})
      else toast.error('Beim Erstellen ist ein Fehler aufgetreten')
      return false
    }
  }

  async function updateQAPHandler(data: z.infer<typeof faqFormSchema>) {
    if (!qap) {
      toast.error('Ein Fehler ist aufgetreten')
      return false
    }

    const qapObject: UpdateQuestionAnswerPair = {
      question: data.question === qap.question ? null : data.question,
      answer: data.answer === qap.answer ? null : data.answer,
      position: data.position === qap.position ? null : data.position
    }

    const error = await updateQap(qap.id, qapObject)

    if (!error) {
      return true
    } else {
      if (String(error).includes('already exists')) form.setError('question', {message: 'Diese Frage existiert bereits'})
      else toast.error('Beim Aktualisieren des FAQ ist ein Fehler aufgetreten')
      return false
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
                  maxLength={QUESTION_MAX_LENGTH}
                  {...field}
                  aria-invalid={fieldState.invalid}
                  className={[fieldState.invalid ? "border-destructive ring-1" : ""].join(" ")}
                />
              </FormControl>
              <div className={'w-full flex justify-between'}>
                <div>
                  <FormMessage/>
                </div>
                <div className={'text-xs text-muted-foreground'}>
                  {field.value.length} / {QUESTION_MAX_LENGTH}
                </div>
              </div>
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
                  maxLength={ANSWER_MAX_LENGTH}
                  {...field}
                  aria-invalid={fieldState.invalid}
                  className={`resize-none ${fieldState.invalid ? "border-destructive ring-1" : ""}`}
                />
              </FormControl>
              <div className={'w-full flex justify-between'}>
                <div>
                  <FormMessage/>
                </div>
                <div className={'text-xs text-muted-foreground'}>
                  {field.value.length} / {ANSWER_MAX_LENGTH}
                </div>
              </div>
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
                  type="text"
                  {...field}
                  value={Number.isNaN(field.value) ? "" : field.value + 1}
                  onChange={e => {
                    const val = e.target.value
                    if (Number.isNaN(val)) field.onChange("")
                    else field.onChange(parseInt(val) - 1)
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
