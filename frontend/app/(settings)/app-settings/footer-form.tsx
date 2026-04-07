"use client"

import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import React, {useCallback, useEffect, useState} from "react";
import {getClient} from "@/lib/graph/client";
import {FooterSettingsDocument, Setting, UpdateSettingDocument} from "@/lib/graph/generated/graphql";
import {toast} from "sonner";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {useUser} from "@/components/providers/user-provider";
import {Button} from "@/components/ui/button";
import {ExternalLink, Loader2, RotateCcw, Save} from "lucide-react";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {cn} from "@/lib/utils";
import {useTranslations} from "next-intl";

export const FOOTER_CONTACT_LINK_KEY = "FOOTER_CONTACT_LINK"
export const FOOTER_LEGAL_NOTICE_KEY = "FOOTER_LEGAL_NOTICE_LINK"

export default function FooterForm() {
  const t = useTranslations("Settings.AppPage.FooterForm")
  const tc = useTranslations("Commons")
  const {user} = useUser();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasTriedToSubmit, setHasTriedToSubmit] = useState(false);

  const footerSettingsScheme = z.object({
    contactLink: z.url({error: t("fields.errors.urlFormat")}),
    legalNoticeLink: z.url({error: t("fields.errors.urlFormat")}),
  });

  type FooterSettingsFormData = z.infer<typeof footerSettingsScheme>;
  const form = useForm<z.infer<typeof footerSettingsScheme>>({
    resolver: zodResolver(footerSettingsScheme),
    defaultValues: {
      contactLink: "",
      legalNoticeLink: "",
    }
  })

  const fetchFooterSettings = useCallback(async () => {
    if (!user) return;
    const client = getClient();

    try {
      const data = await client.request(FooterSettingsDocument);
      if (!data.footerSettings) {
        toast.error(tc("toasts.fetchError"))
        return;
      }

      form.reset({
        contactLink: data.footerSettings.find(s => s?.key === FOOTER_CONTACT_LINK_KEY)?.value ?? "",
        legalNoticeLink: data.footerSettings.find(s => s?.key === FOOTER_LEGAL_NOTICE_KEY)?.value ?? "",
      });

      setIsLoading(false);
    } catch  {
      toast.error(tc("toasts.fetchError"));
    }
  }, [form, tc, user]);

  useEffect(() => {
    void fetchFooterSettings();
  }, [fetchFooterSettings]);

  async function onValidSubmit(data: FooterSettingsFormData) {
    setIsSaving(true);
    const client = getClient();

    if (!user) {
      toast.error(tc("toasts.loginAgainError"));
      return;
    }

    try {
      const constactSetting: Setting = {key: FOOTER_CONTACT_LINK_KEY, value: data.contactLink.trim()}
      const legalNoticeSetting: Setting = {key: FOOTER_LEGAL_NOTICE_KEY, value: data.legalNoticeLink.trim()}
      await client.request(UpdateSettingDocument, {setting: constactSetting})
      await client.request(UpdateSettingDocument, {setting: legalNoticeSetting})

      setIsSaving(false);
      toast.success(tc("toasts.updateSuccess"))
      await fetchFooterSettings();
    } catch {
      toast.error(tc("toasts.updateError"))
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card className={'w-full'}>
      <CardHeader className={'flex items-center gap-2'}>
        <ExternalLink/> {t("title")}
      </CardHeader>
      <CardContent className={'relative'}>
        <div
          className={cn(
            'absolute top-0 left-0 w-full h-full flex flex-col gap-2 items-center justify-center bg-card',
            !isLoading && "hidden"
          )}
        >
          <Loader2 className={'animate-spin'}/>
          {t("loading")}
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onValidSubmit, () => setHasTriedToSubmit(true))}
            className="space-y-4 w-full"
          >
            <FormField
              control={form.control}
              name="contactLink"
              render={({field}) => (
                <FormItem className={"flex-grow"}>
                  <FormLabel>{t("fields.contact.label")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("fields.contact.placeholder")} {...field} data-cy={'footer-contact-input'}/>
                  </FormControl>
                  <FormMessage data-cy={'footer-contact-input-message'}/>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="legalNoticeLink"
              render={({field}) => (
                <FormItem className={"flex-grow"}>
                  <FormLabel>{t("fields.legalNotice.label")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("fields.legalNotice.placeholder")} {...field} data-cy={'footer-legalnotice-input'}/>
                  </FormControl>
                  <FormMessage data-cy={'footer-legalnotice-input-message'}/>
                </FormItem>
              )}
            />

            <div className={cn('w-full flex flex-col items-center gap-4 md:justify-end md:flex-row')}>
              <Button
                className={'w-full md:w-fit'}
                variant={'secondary'}
                type={'button'}
                disabled={!form.formState.isDirty}
                onClick={() => fetchFooterSettings()}
                data-cy={'footer-cancel-button'}
              >
                <RotateCcw/>
                {tc("buttons.cancel")}
              </Button>

              <Button
                type="submit"
                disabled={!form.formState.isValid && hasTriedToSubmit || !form.formState.isDirty}
                className={cn(isLoading && 'hidden', 'w-full md:w-fit')}
                data-cy={'footer-save-button'}
              >
                {isSaving ? (
                  <Loader2 className={'animate-spin'}/>
                ) : (
                  <>
                    <Save/>
                    {tc("buttons.save")}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}