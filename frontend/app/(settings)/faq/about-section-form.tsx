"use client";

import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useEffect, useState } from "react";
import { getClient } from "@/lib/graph/client";
import {
  AboutSectionSettingsDocument,
  Setting,
  UpdateSettingDocument,
} from "@/lib/graph/generated/graphql";
import { toast } from "sonner";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useUser } from "@/components/providers/user-provider";
import { Button } from "@/components/ui/button";
import { Loader2, Save, RotateCcw } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const ABOUT_SECTION_TEXT_KEY = "ABOUT_SECTION_TEXT";

const aboutSectionSchema = z.object({
  aboutText: z
    .string()
    .min(1, "Bitte gib einen Text ein")
    .max(2000, "Der Text darf maximal 2000 Zeichen lang sein."),
});

type AboutSectionFormData = z.infer<typeof aboutSectionSchema>;

export default function AboutSectionForm() {
  const { user } = useUser();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasTriedToSubmit, setHasTriedToSubmit] = useState(false);

  const form = useForm<AboutSectionFormData>({
    resolver: zodResolver(aboutSectionSchema),
    defaultValues: { aboutText: "" },
    mode: "onChange",
  });

  const textWatch = form.watch("aboutText", "");

  const fetchAboutSection = useCallback(async () => {
    if (!user) return;
    const client = getClient();

    try {
      const data = await client.request(AboutSectionSettingsDocument);
      if (!data?.aboutSectionSettings) {
        toast.error("Fehler beim Laden der About-Section");
        setIsLoading(false);
        return;
      }

      form.reset({
        aboutText:
          data.aboutSectionSettings.find((s) => s?.key === ABOUT_SECTION_TEXT_KEY)
            ?.value ?? "",
      });

      setIsLoading(false);
    } catch (error) {
      toast.error("Fehler beim Laden der About-Section");
      console.error(error);
      setIsLoading(false);
    }
  }, [form, user]);

  useEffect(() => {
    void fetchAboutSection();
  }, [fetchAboutSection]);

  async function onValidSubmit(data: AboutSectionFormData) {
    setIsSaving(true);
    const client = getClient();

    if (!user) {
      toast.error("Ein Fehler ist aufgetreten, melde dich erneut an");
      setIsSaving(false);
      return;
    }

    try {
      const setting: Setting = { key: ABOUT_SECTION_TEXT_KEY, value: data.aboutText };
      await client.request(UpdateSettingDocument, { setting });

      toast.success("About-Section erfolgreich aktualisiert");
      await fetchAboutSection();
    } catch (err) {
      console.error(err);
      toast.error("Ein Fehler beim Speichern ist aufgetreten");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div>
        <div className="w-full rounded-lg p-4 my-3 border bg-background items-end float-end">
        <FormProvider {...form}>
            <form
            onSubmit={form.handleSubmit(onValidSubmit, () => setHasTriedToSubmit(true))}
            className="space-y-4"
            >
            <FormField
  control={form.control}
  name="aboutText"
  render={({ field }) => (
    <FormItem>
      <div className="flex justify-between items-center">
        <FormLabel className="text-lg font-semibold text-foreground-muted mb-1 mt-2">About-Text bearbeiten</FormLabel>
        <span
          className={cn(
            "text-sm text-muted-foreground",
            textWatch.length > 2000 && "text-destructive"
          )}
        >
          {textWatch.length} / 2000
        </span>
      </div>

      <FormControl>
        <Textarea
          placeholder="Beschreibe hier den Kummerkasten..."
          rows={8}
          maxLength={2000}
          className={cn(
            "resize-none text-foreground flex min-h-[180px] bg-background text-sm"
          )}
          {...field}
          data-cy="about-section-input"
        />
      </FormControl>

      <FormMessage />
    </FormItem>
  )}
/>


            <div className="w-full flex justify-end items-center gap-4 pt-2">
                <Button
                variant="secondary"
                type="button"
                disabled={!form.formState.isDirty}
                onClick={() => fetchAboutSection()}
                className="flex items-center gap-2"
                >
                <RotateCcw className="w-4 h-4" />
                Abbrechen
                </Button>

                <Button
                type="submit"
                disabled={(!form.formState.isValid && hasTriedToSubmit) || !form.formState.isDirty || isSaving}
                className="flex items-center gap-2"
                >
                {isSaving ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                    <>
                    <Save className="w-4 h-4" />
                    Speichern
                    </>
                )}
                </Button>
            </div>
            </form>
        </FormProvider>
        </div>
    </div>
  );
}
