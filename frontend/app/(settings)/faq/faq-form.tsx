"use client";

import { z } from "zod";
import { FormProvider, useForm} from "react-hook-form";
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
}

const faqFormSchema = z.object({
  question: z.string().nonempty({ message: "Bitte gib eine Frage ein." }),
  answer: z.string().nonempty({ message: "Bitte gib eine Antwort ein." }),
  order: z.number().min(0),
});

type FaqFormValues = z.infer<typeof faqFormSchema>;

export default function FaqForm({ createMode, qap, closeDialog, refreshData, maxOrder }: FaqFormProps) {
  const [hasTriedToSubmit, setHasTriedToSubmit] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<FaqFormValues>({
    resolver: zodResolver(faqFormSchema),
    defaultValues: {
      question: qap?.question ?? "",
      answer: qap?.answer ?? "",
      order: createMode ? maxOrder + 1 : qap?.order ?? 0,
    },
  });

  useEffect(() => {
    form.setValue("order", createMode ? maxOrder + 1 : qap?.order ?? 0);
  }, [createMode, qap, maxOrder]);

  useEffect(() => {
    const handler = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === "Escape") {
        closeDialog();
      }
    };
    window.addEventListener("keydown", handler as any);
    return () => window.removeEventListener("keydown", handler as any);
  }, [closeDialog]);

  const onValidSubmit = async (data: FaqFormValues) => {
    setLoading(true);

    const client = getClient();
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
            { QAPs: [{ id: createdId, order: data.order }] }
          );
        }
        toast.success("FAQ erfolgreich erstellt.");
      } else if (qap) {
        if (data.order !== qap.order) {
          await client.request<UpdateQuestionAnswerPairOrderMutation>(
            UpdateQuestionAnswerPairOrderDocument,
            { QAPs: [{ id: qap.id, order: data.order }] }
          );
        }
        await client.request(UpdateQuestionAnswerPairDocument, {
          id: qap.id,
          questionAnswerPair: { question: data.question, answer: data.answer },
        });
        toast.success("FAQ erfolgreich aktualisiert.");
      }

      closeDialog();
      await refreshData();
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
        onSubmit={form.handleSubmit(onValidSubmit, () => setHasTriedToSubmit(true))}
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
              <FormMessage />
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
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="order"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormLabel className="text-lg w-2/3">Reihenfolge</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  min={0}
                  max={createMode ? maxOrder + 1 : maxOrder}
                  className="w-1/3"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-between gap-2 mt-4">
          <Button type="button" variant="outline" className="flex-1" onClick={closeDialog}>
            Abbrechen
          </Button>
          <Button type="submit" className="flex-1">
            {createMode ? "Erstellen" : "Aktualisieren"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
