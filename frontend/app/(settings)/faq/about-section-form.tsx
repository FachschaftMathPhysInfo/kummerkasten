"use client";

import {z} from "zod";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import React, {useCallback, useEffect, useState} from "react";
import {getClient} from "@/lib/graph/client";
import {AboutSectionSettingsDocument, UpdateAboutSectionTextDocument,} from "@/lib/graph/generated/graphql";
import {toast} from "sonner";
import {FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {useUser} from "@/components/providers/user-provider";
import {Button} from "@/components/ui/button";
import {BookText, Loader2, RotateCcw, Save} from "lucide-react";
import {Textarea} from "@/components/ui/textarea";
import {cn} from "@/lib/utils";
import {useTranslations} from "next-intl";

export const ABOUT_SECTION_TEXT_KEY = "ABOUT_SECTION_TEXT";
const MAX_ABOUT_TEXT_LENGTH = 2000;


export default function AboutSectionForm() {
  const t = useTranslations("Setting.QAPManagementPage.AboutSectionForm")
  const tc = useTranslations("Commons")
  const {user} = useUser();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasTriedToSubmit, setHasTriedToSubmit] = useState(false);

  const aboutSectionSchema = z.object({
    aboutText: z
      .string()
      .nonempty(tc("fields.error.empty"))
      .max(
        MAX_ABOUT_TEXT_LENGTH,
        tc("fields.error.long", {condition: `${MAX_ABOUT_TEXT_LENGTH} ${tc("words.character")}`}),
      ),
  });

  type AboutSectionFormData = z.infer<typeof aboutSectionSchema>;

  const form = useForm<AboutSectionFormData>({
    resolver: zodResolver(aboutSectionSchema),
    defaultValues: {aboutText: ""},
    mode: "onChange",
  });

  const fetchAboutSection = useCallback(async () => {
    const client = getClient();

    try {
      const data = await client.request(AboutSectionSettingsDocument);
      if (!data?.aboutSectionSettings) {
        toast.error(tc("toasts.fetchError"));
        setIsLoading(false);
        return;
      }

      form.reset({
        aboutText:
          data.aboutSectionSettings.find(
            (s) => s?.key === ABOUT_SECTION_TEXT_KEY
          )?.value ?? "",
      });

      setIsLoading(false);
    } catch {
      toast.error(tc("toasts.fetchError"));
      setIsLoading(false);
    }
  }, [form, tc]);

  useEffect(() => {
    void fetchAboutSection();
  }, [fetchAboutSection]);

  async function onValidSubmit(data: AboutSectionFormData) {
    setIsSaving(true);
    const client = getClient();

    if (!user) {
      toast.error(tc("toasts.fetchError"));
      setIsSaving(false);
      return;
    }

    try {
      await client.request(UpdateAboutSectionTextDocument, {text: data.aboutText});

      toast.success(tc("toasts.updateSuccess"));
      await fetchAboutSection();
    } catch {
      toast.error(tc("toasts.generalError"));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="w-full rounded-lg p-4 mb-5 py-3 border bg-card items-end float-end relative">
      <div
        className={cn(
          "absolute top-0 left-0 w-full h-full flex flex-col gap-2 items-center justify-center bg-card",
          !isLoading && "hidden"
        )}
      >
        <Loader2 className="animate-spin w-6 h-6"/>
        {t("loading")}
      </div>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onValidSubmit, () =>
            setHasTriedToSubmit(true)
          )}
          className="space-y-2"
        >
          <div className="flex items-center gap-2 mb-2">
            <BookText className="w-6 h-6 mx-1 my-1"/>
            <span className="text-lg font-semibold text-foreground-muted">
              {t("aboutText.header")}
            </span>
          </div>
          <FormField
            control={form.control}
            name="aboutText"
            render={({field}) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel className="text-sm font-semibold text-foreground-muted">
                    {t("aboutText.description")}
                  </FormLabel>
                  <span
                    className={cn(
                      "text-sm text-muted-foreground",
                      field.value.length > MAX_ABOUT_TEXT_LENGTH &&
                      "text-destructive"
                    )}
                  >
                    {field.value.length} / {MAX_ABOUT_TEXT_LENGTH}
                  </span>
                </div>

                <FormControl>
                  <Textarea
                    placeholder={t("aboutText.placeholder")}
                    rows={4}
                    maxLength={MAX_ABOUT_TEXT_LENGTH}
                    className={cn(
                      "resize-none text-foreground flex min-h-[120px] bg-background text-sm"
                    )}
                    {...field}
                    data-cy="about-text-input"
                  />
                </FormControl>

                <FormMessage data-cy={'about-text-input-message'}/>
              </FormItem>
            )}
          />

          <div className="w-full flex justify-end items-center gap-5 pt-2">
            <Button
              variant="secondary"
              type="button"
              disabled={!form.formState.isDirty}
              onClick={() => fetchAboutSection()}
              className="flex items-center gap-2"
              data-cy={'about-cancel-button'}
            >
              <RotateCcw/>
              {tc("buttons.cancel")}
            </Button>

            <Button
              type="submit"
              disabled={
                (!form.formState.isValid && hasTriedToSubmit) ||
                !form.formState.isDirty ||
                isSaving
              }
              className="flex items-center gap-2"
              data-cy={'about-submit-button'}
            >
              {isSaving ? (
                <Loader2 className="animate-spin"/>
              ) : (
                <>
                  <Save/> {tc("buttons.save")}
                </>
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
