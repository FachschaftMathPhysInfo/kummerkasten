"use client";

import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { getClient } from "@/lib/graph/client";
import {
  CreateQuestionAnswerPairDocument,
  CreateQuestionAnswerPairMutation,
  UpdateQuestionAnswerPairDocument,
  UpdateQuestionAnswerPairOrderDocument,
  UpdateQuestionAnswerPairOrderMutation,
  QuestionAnswerPair,
} from "@/lib/graph/generated/graphql";
import { toast } from "sonner";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

import {Textarea} from "@/components/ui/textarea";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface FaqFormProps {
  createMode: boolean;
  qap: QuestionAnswerPair | null;
  closeDialog: () => void;
  refreshData: () => void;
  maxOrder: number;
  uniqueQuestion: string[];
}

const faqFormSchema = (maxOrder: number, uniqueQuestion: string[], currentQuestion?: string) => z.object({
  question: z.string().nonempty({ message: "Bitte gib eine Frage ein." }).refine(
        (val) =>
        !uniqueQuestion.includes(val) || val === currentQuestion,
        { message: "Diese Frage existiert bereits." }),
  answer: z.string().nonempty({ message: "Bitte gib eine Antwort ein." }),
  order: z.number().int().min(1, "Position muss mindestens 1 sein.").max(maxOrder + 2, { message: `Position darf höchstens ${maxOrder + 2} sein.` }),
});

type FaqFormValues = z.infer<ReturnType<typeof faqFormSchema>>;

export default function FaqForm({ createMode, qap, closeDialog, refreshData, maxOrder, uniqueQuestion }: FaqFormProps) {
  const [loading, setLoading] = useState(false);
  
  if (!maxOrder) {
    maxOrder = 1;
  }
  
  if (maxOrder < 1) {
    maxOrder = 1;
  }

  const schema = faqFormSchema(maxOrder, uniqueQuestion, qap?.question);
  const form = useForm<FaqFormValues>({
      resolver: zodResolver(schema) as any,
      defaultValues: {
      question: qap?.question ?? "",
      answer: qap?.answer ?? "",
      order: createMode ? maxOrder + 2 : ( qap?.order ?? 0)  + 1,
    },
  });


  useEffect(() => {
    form.setValue("order", createMode ? maxOrder + 1 :  ( qap?.order ?? 0)  + 1,);
  }, [form, createMode, qap, maxOrder]);

   useEffect(() => {
    form.reset({
      question: qap?.question ?? "",
      answer: qap?.answer ?? "",
      order: createMode ? maxOrder + 2 :  ( qap?.order ?? 0)  + 1,
    });
  }, [createMode, qap, maxOrder, form]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeDialog();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeDialog]);

  const submitLabel = loading
  ? "Speichern..."
  : createMode
    ? "Erstellen"
    : "Aktualisieren";


  const onValidSubmit = async (data: FaqFormValues) => {
    setLoading(true);

    const client = getClient();
    const trueOrderValue = data.order - 1;

    try {
      if (createMode) {
        const createResp = await client.request<CreateQuestionAnswerPairMutation>(
          CreateQuestionAnswerPairDocument,
          { questionAnswerPair: { question: data.question, answer: data.answer } }
        );
        const createdId = createResp.createQuestionAnswerPair?.id;
        if (createdId) {
          await client.request<UpdateQuestionAnswerPairOrderMutation>(
            UpdateQuestionAnswerPairOrderDocument,
            { QAPs: [{ id: createdId, order: trueOrderValue }] }
          );
        }
      } else if (qap) {
        if (trueOrderValue !== qap.order) {
          await client.request<UpdateQuestionAnswerPairOrderMutation>(
            UpdateQuestionAnswerPairOrderDocument,
            { QAPs: [{ id: qap.id, order: trueOrderValue }] }
          );
        }
        await client.request(UpdateQuestionAnswerPairDocument, {
          id: qap.id,
          questionAnswerPair: { question: data.question, answer: data.answer },
        });
      }

      closeDialog();
      await refreshData();
    } catch (err: any) {
      console.error(err);
      toast.error("Fehler beim Speichern der FAQ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onValidSubmit)}
        className="space-y-4 w-full"
      >
        <FormField
          control={form.control}
          name="question"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className={fieldState.invalid ? "text-destructive" : ""}>Frage</FormLabel>
              <FormControl>
                <Input
                  placeholder="Frage"
                  {...field}
                  aria-invalid={fieldState.invalid}
                  className={[fieldState.invalid ? "border-destructive ring-1 ring-destructive" : ""].join(" ")}
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="answer"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className={fieldState.invalid ? "text-destructive" : ""}>Antwort</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Antwort"
                  rows={7}
                  {...field}
                  aria-invalid={fieldState.invalid}
                  className={`resize-none ${fieldState.invalid ? "border-destructive ring-1 ring-destructive" : ""}`}
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="order"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className={fieldState.invalid ? "text-destructive" : ""}>
                Position
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  value={Number(field.value ?? 1)}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  aria-invalid={fieldState.invalid}
                  className={`${fieldState.invalid ? "border-destructive ring-1 ring-destructive" : ""}`}
                />
              </FormControl>
              <FormMessage className="w-full text-sm font-medium text-destructive"/>
            </FormItem>
          )}
        />


        <div className="flex justify-between gap-2 mt-4">
          <Button type="button" variant="outline" className="flex-1" onClick={closeDialog}>
            Abbrechen
          </Button>
          <Button type="submit" className="flex-1" disabled={loading}>
          {submitLabel}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
