"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { getClient } from "@/lib/graph/client";
import { AboutSectionSettingsDocument } from "@/lib/graph/generated/graphql";

export default function AboutSection() {
  const [text, setText] = useState<string>("");

  useEffect(() => {
    const fetchAbout = async () => {
      const client = getClient();
      try {
        const textData = await client.request(AboutSectionSettingsDocument);
        setText(
          textData.aboutSectionSettings?.find(
            (s) => s?.key === "ABOUT_SECTION_TEXT"
          )?.value ?? "Hello World!"
        );
      } catch {
        setText("Eine Beschreibung wurde nicht konfiguriert.");
      }
    };
    void fetchAbout();
  }, []);

  return (
    <Card className="flex flex-col bg-kummerkasten-highlight-bg border-kummerkasten-highlight-bg w-full rounded-lg shadow-lg max-w-4xl mx-auto p-6 my-4">
      <CardTitle className="text-3xl items-center text-center font-semibold text-foreground mb-2">
        Was ist der Kummerkasten?
      </CardTitle>
      <CardContent className="text-left">
        <p
          className="text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap"
          data-cy={'about-text'}
        >
          {text}
        </p>
      </CardContent>
    </Card>
  );
}
