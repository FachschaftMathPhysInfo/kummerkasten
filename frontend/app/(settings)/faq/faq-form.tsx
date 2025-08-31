"use client"

import {z} from "zod";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";
import {getClient} from "@/lib/graph/client";
import {
    CreateQuestionAnswerPairDocument,
    CreateQuestionAnswerPairMutation,
    QuestionAnswerPair,
    NewQuestionAnswerPair,
    UpdateQuestionAnswerPairDocument,
    UpdateQuestionAnswerPairMutation,
    UpdateQuestionAnswerPairOrderDocument,
    UpdateQuestionAnswerPairOrderMutation,
} from "@/lib/graph/generated/graphql";
import {toast} from "sonner";
import {LoaderCircle, PlusCircle, Save} from "lucide-react";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";

interface QAPFormProps {
    createMode: boolean;
    qap: QuestionAnswerPair | null;
    closeDialog: () => void
    refreshData: () => void
    maxOrder: number
}

const qapFormSchema = z.object({
    question: z.string().min(1, {
        message: "Bitte gib eine Frage ein.",
    }),
    answer: z.string().min(1, {
        message: "Bitte gib eine Antwort ein.",
    }),
    order: z.number().int().min(0).optional(),
})

export default function QAPForm(props: QAPFormProps) {
    const [hasTriedToSubmit, setHasTriedToSubmit] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const form = useForm<z.infer<typeof qapFormSchema>>({
        resolver: zodResolver(qapFormSchema),
        defaultValues: {
            question: props.qap?.question ?? "",
            answer: props.qap?.answer ?? "",
            order: props.createMode ? props.maxOrder + 1 : (props.qap?.order ?? 0),
        }
    })

    async function onValidSubmit(data: z.infer<typeof qapFormSchema>) {
        setLoading(true)

        try {
            if (props.createMode) {
                await createQAP(data.question, data.answer)
            } else {
                if (!props.qap) return;
                
                const questionAnswerPair: NewQuestionAnswerPair = {
                    question: data.question,
                    answer: data.answer,
                };
                if (data.order !== props.qap.order) {
                    await updateQAPOrder(props.qap.id, data.order!);
                }
                
                await updateQAP(props.qap.id, questionAnswerPair);
            }
        } catch (error) {
            toast.error("Ein Fehler ist aufgetreten")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    async function createQAP(question: string, answer: string) {
        const client = getClient();
        const qap: NewQuestionAnswerPair = {question, answer};

        try {
            await client.request<CreateQuestionAnswerPairMutation>(CreateQuestionAnswerPairDocument, {questionAnswerPair: qap})
            toast.success("Frage und Antwort erstellt!")
            props.refreshData()
            props.closeDialog()
        } catch (error) {
            toast.error("Ein Fehler beim Erstellen ist aufgetreten")
            console.error(error)
        }
    }

    async function updateQAP(id: string, qap: NewQuestionAnswerPair) {
        const client = getClient();
        try {
            await client.request<UpdateQuestionAnswerPairMutation>(UpdateQuestionAnswerPairDocument, {id: id, questionAnswerPair: qap})
            toast.success("Frage und Antwort erfolgreich aktualisiert!")
            props.refreshData()
            props.closeDialog()
        } catch (error) {
            toast.error("Ein Fehler beim Aktualisieren ist aufgetreten")
            console.error(error)
        }
    }

    async function updateQAPOrder(id: string, order: number) {
        const client = getClient();
        try {
            await client.request<UpdateQuestionAnswerPairOrderMutation>(
                UpdateQuestionAnswerPairOrderDocument,
                {
                    QAPs: [{ id, order }],
                }
            );
            toast.success("Reihenfolge erfolgreich aktualisiert!");
        } catch (error) {
            toast.error("Fehler beim Aktualisieren der Reihenfolge aufgetreten")
            console.error(error);
        }
    }
    
    return (
        <FormProvider {...form}>
            <form
                onSubmit={form.handleSubmit(onValidSubmit, () => setHasTriedToSubmit(true))}
                className="space-y-4 w-full"
            >
                <FormField
                    control={form.control}
                    name="question"
                    render={({field}) => (
                        <FormItem className={"flex-grow"}>
                            <FormLabel>Frage</FormLabel>
                            <FormControl>
                                <Input
                                    data-cy={'qap-question-input'}
                                    placeholder={props.qap?.question ?? "Gib eine Frage ein"}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="answer"
                    render={({field}) => (
                        <FormItem className={"flex-grow"}>
                            <FormLabel>Antwort</FormLabel>
                            <FormControl>
                                <Textarea
                                    data-cy={'qap-answer-input'}
                                    placeholder={props.qap?.answer ?? "Gib eine Antwort ein"}
                                    className="resize-y min-h-[100px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="order"
                    render={({field}) => (
                        <FormItem className={"flex-grow"}>
                            <FormLabel>Position</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    data-cy={'qap-order-input'}
                                    min={0}
                                    max={props.maxOrder +1}
                                    value={field.value}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      const parsedValue = parseInt(value, 10);
                                      field.onChange(isNaN(parsedValue) ? 0 : parsedValue);
                                    }}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <div className={"flex justify-between items-center gap-x-12 mt-8"}>
                    <Button
                        data-cy={'close-dialog-button'}
                        onClick={props.closeDialog}
                        variant={"outline"}
                        type={"button"}
                        className={"flex-grow-[0.5]"}
                    >
                        Abbrechen
                    </Button>

                    <Button
                        data-cy={'submit-button'}
                        disabled={(!form.formState.isValid && hasTriedToSubmit) || loading}
                        type="submit"
                        className={"flex-grow"}
                    >
                        {loading ? (<LoaderCircle className="animate-spin" />) : props.createMode ?
                            (
                                <PlusCircle/>
                            ) : (
                                <Save/>
                            )}
                        {props.createMode ? "Erstellen" : "Speichern"}
                    </Button>
                </div>
            </form>
        </FormProvider>
    )
}
