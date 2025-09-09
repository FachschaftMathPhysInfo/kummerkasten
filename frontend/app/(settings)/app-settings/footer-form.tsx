"use client"

import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import React, {useCallback, useEffect, useState} from "react";
import {getClient} from "@/lib/graph/client";
import {AllSettingsDocument, AllSettingsQuery, Setting, UpdateSettingDocument} from "@/lib/graph/generated/graphql";
import {toast} from "sonner";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {useUser} from "@/components/providers/user-provider";
import {Form} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {Save} from "lucide-react";

const FOOTER_SETTINGS_PREFIX = "FOOTER_"
const CONTACT_LINK_KEY = "FOOTER_CONTACT_LINK"
const LEGAL_NOTICE_KEY = "FOOTER_LEGAL_NOTICE"

const footerSettingsScheme = z.object({
  contactLink: z.url({error: 'Bitte gib eine gültige URL an'}),
  legalNoticeLink: z.url({error: 'Bitte gib eine gültige URL an'}),
});

type FooterSettingsFormData = z.infer<typeof footerSettingsScheme>;

export default function FooterForm() {
  const {user} = useUser();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasTriedToSubmit, setHasTriedToSubmit] = useState(false);

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
      const data = await client.request<AllSettingsQuery>(AllSettingsDocument);
      if (!data.settings) {
        toast.error('Fehler beim Laden der Einstellungen')
        return;
      }
      const footerSettings = data.settings.filter(
        s => !!s && s.key.includes(FOOTER_SETTINGS_PREFIX)
      )

      form.reset({
        contactLink: footerSettings.find(s => s?.key === CONTACT_LINK_KEY)?.value ?? "",
        legalNoticeLink: footerSettings.find(s => s?.key === LEGAL_NOTICE_KEY)?.value ?? "",
      });

      setIsLoading(false);
    } catch (error) {
      toast.error("Fehler beim Laden der Einstellungen");
      console.error(error);
    }
  }, [form, user]);

  useEffect(() => {
    void fetchFooterSettings();
  }, [fetchFooterSettings]);

  async function onValidSubmit(data: FooterSettingsFormData) {
    setIsSaving(true);
    const client = getClient();

    if (!user) {
      toast.error("Ein Fehler ist aufgetreten, melde dich erneut an");
      return;
    }

    try {
      const constactSetting: Setting = {key: CONTACT_LINK_KEY, value: data.contactLink}
      const legalNoticeSetting: Setting = {key: LEGAL_NOTICE_KEY, value: data.legalNoticeLink}
      await client.request(UpdateSettingDocument, {setting: constactSetting})
      await client.request(UpdateSettingDocument, {setting: legalNoticeSetting})

      setIsSaving(false);
      await fetchFooterSettings();
    } catch {
      toast.error('Ein Fehler beim Speichern der Einstellungen ist aufgetreten')
    } finally {
      setIsSaving(false);
    }
  }


  return (
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
                <FormLabel>Kontakt-Link</FormLabel>
                <FormControl>
                  <Input placeholder={"https://..."} {...field} data-cy={'footer-contact-input'}/>
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
                <FormLabel>Nachname</FormLabel>
                <FormControl>
                  <Input placeholder={"https://..."} {...field} data-cy={'footer-legalnotice-input'}/>
                </FormControl>
                <FormMessage data-cy={'footer-legalnotice-input-message'}/>
              </FormItem>
            )}
          />
        <Button
        type="submit"
        disabled={!form.formState.isValid && hasTriedToSubmit || !form.formState.isDirty}
        >
          <Save/>
          Speichern
        </Button>
      </form>
    </Form>
  )
}