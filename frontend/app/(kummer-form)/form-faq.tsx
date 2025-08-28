"use client";

import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LoaderCircle } from "lucide-react";
import { getClient } from "@/lib/graph/client";
import { AllQuestionAnswerPairDocument, AllQuestionAnswerPairQuery, QuestionAnswerPair } from "@/lib/graph/generated/graphql";


 export default function FaqSection() {
  const [faqs, setFaqs] = useState<QuestionAnswerPair[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const client = getClient();
        const data = await client.request<AllQuestionAnswerPairQuery>(AllQuestionAnswerPairDocument);
        const filteredFaqs = (data.questionAnswerPairs ?? [])
          .filter((faq): faq is QuestionAnswerPair => faq !== null);

        setFaqs(filteredFaqs);
      } catch (err) {
        console.error("Failed to fetch FAQs:", err);
        setError("Die FAQs konnten nicht geladen werden.");
      } finally {
        setLoading(false);
      }
    };
    void fetchFaqs();
  }, []);

  return (
    <section className="w-full max-w-4xl mx-auto p-6 my-4 bg-kummerkasten-highlight-bg rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-foreground-muted mb-6 text-center">Häufig gestellte Fragen</h2>
      {loading && (
        <div className="flex justify-center items-center py-8">
          <LoaderCircle className="animate-spin h-8 w-8 text-foreground" />
        </div>
      )}
      {error && (
        <div className="text-center text-destructive py-8">
          {error}
        </div>
      )}
      {!loading && !error && faqs.length > 0 ? (
        <Accordion type="multiple" className="w-full">
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id} className="border-foreground-muted">
              <AccordionTrigger className="text-lg text-foreground items-center hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-foreground leading-relaxed transition-all">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        !loading && !error && (
          <div className="text-center text-foreground py-8">
            Keine FAQs verfügbar.
          </div>
        )
      )}
    </section>
  );
};
