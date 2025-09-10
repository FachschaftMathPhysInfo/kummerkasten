"use client"

import {useUser} from "@/components/providers/user-provider";
import {useEffect, useState} from "react";
import {getClient} from "@/lib/graph/client";
import {FooterSettingsDocument} from "@/lib/graph/generated/graphql";
import {FOOTER_CONTACT_LINK_KEY, FOOTER_LEGAL_NOTICE_KEY} from "@/app/(settings)/app-settings/footer-form";

export function Footer() {
  const {user} = useUser();
  const [legalNoticeLink, setLegalNoticeLink] = useState("")
  const [contactLink, setContactLink] = useState("")

  useEffect(() => {
    const fetchFooterLinks = async () => {
      const client = getClient();
      try {
        const data = await client.request(FooterSettingsDocument)
        if (!data.footerSettings) return;

        setLegalNoticeLink(data.footerSettings.find(s => s?.key === FOOTER_LEGAL_NOTICE_KEY)?.value ?? "")
        setContactLink(data.footerSettings.find(s => s?.key === FOOTER_CONTACT_LINK_KEY)?.value ?? "")
      } catch {
        console.warn('contact and legal notice links are not configured, please notify the administrator')
      }
    }

    void fetchFooterLinks()
  }, []);

  if (user) return null

  return (
    <footer
      data-cy={'footer'}
      className="flex justify-evenly w-full h-fit py-5 px-10 text-sm text-muted-foreground border-t mt-5"
    >
      {contactLink !== "" && (
        <span>
        <a
          data-cy={'footer-contact'}
          className="cursor-pointer underline"
          href={contactLink}
        >
          Kontakt
        </a>
      </span>
      )}

      {legalNoticeLink !== "" && (
        <span>
        <a
          data-cy={'footer-legal'}
          className={"cursor-pointer underline"}
          href={legalNoticeLink}
        >
          Impressum
        </a>
      </span>
      )}

      <span>
        <a
          data-cy={'footer-github'}
          className="cursor-pointer underline"
          href="https://github.com/plebysnacc/kummerkasten"
        >
          Source Code
        </a>
      </span>
    </footer>
  );
}