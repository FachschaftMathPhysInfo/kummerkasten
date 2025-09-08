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

const faqFormSchema = (maxOrder: number, uniqueQuestion: string[], currentQuestion?: string, createMode?: boolean) => z.object({
  question: z.string().nonempty({ message: "Bitte gib eine Frage ein." }).refine(
        (val) =>
        !uniqueQuestion.includes(val) || val === currentQuestion,
        { message: "Diese Frage existiert bereits." }),
  answer: z.string().nonempty({ message: "Bitte gib eine Antwort ein." }),
  order: z.union([z.string(), z.number()])
          .transform((val, ctx) => {
          if (val === "") {
            ctx.addIssue({
              code: "custom",
              message: "Bitte gib eine Position ein.",
            });
            return z.NEVER;
          }

          const num = typeof val === "number" ? val : Number(val);

          if (isNaN(num) || !Number.isInteger(num)) {
            ctx.addIssue({
              code: "custom",
              message: `Bitte gib eine Position zwischen 1 und ${createMode ? maxOrder + 2 : maxOrder + 1} ein.`,
              });
            return z.NEVER;
          }

          return num;
          })
      .pipe(
        z.number().int().min(1, "Position muss mindestens 1 sein.").max(createMode ? maxOrder + 2 : maxOrder + 1, {message: `Position darf höchstens ${createMode ? maxOrder + 2 : maxOrder + 1} sein.`,})
      ),
    }
  );

type FaqFormValues = z.infer<ReturnType<typeof faqFormSchema>>;

export default function FaqForm({ createMode, qap, closeDialog, refreshData, maxOrder, uniqueQuestion }: FaqFormProps) {
  const [loading, setLoading] = useState(false);
  
  if (maxOrder < 0) {
    maxOrder = 0
  }

  const defaultOrder = createMode ? (maxOrder > 0 ? maxOrder + 2 : 1) : (qap?.order ?? 0) + 1;

  const schema = faqFormSchema(maxOrder, uniqueQuestion, qap?.question, createMode);
  const form = useForm<FaqFormValues>({
      resolver: zodResolver(schema as any), // eslint-disable-line
      defaultValues: {
      question: qap?.question ?? "",
      answer: qap?.answer ?? "",
      order: defaultOrder,
    },
  });

  useEffect(() => {
    form.setValue("order", defaultOrder,);
  }, [form, defaultOrder]);

   useEffect(() => {
    form.reset({
      question: qap?.question ?? "",
      answer: qap?.answer ?? "",
      order: defaultOrder,
    });
  }, [qap, defaultOrder, form]);

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
            { qaps: [{ id: createdId, order: trueOrderValue }] }
          );
        }
      } else if (qap) {
        if (trueOrderValue !== qap.order) {
          await client.request<UpdateQuestionAnswerPairOrderMutation>(
            UpdateQuestionAnswerPairOrderDocument,
            { qaps: [{ id: qap.id, order: trueOrderValue }] }
          );
        }
        await client.request(UpdateQuestionAnswerPairDocument, {
          id: qap.id,
          questionAnswerPair: { question: data.question, answer: data.answer },
        });
      }

      closeDialog();
      refreshData();
    } catch (err) {
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
          render={({ field, fieldState }) => (
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
          name="order"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className={fieldState.invalid ? "text-destructive" : ""}>
                Position
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  value={Number.isNaN(field.value as number) ? "": field.value ?? ""}
                  onChange={(e) => {
                    field.onChange(e.target.value)
                  }}
                  aria-invalid={fieldState.invalid}
                  className={`${fieldState.invalid ? "border-destructive ring-1" : ""}`}
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
