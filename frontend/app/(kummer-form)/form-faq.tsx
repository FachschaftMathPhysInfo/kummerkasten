"use client";

import React, {useEffect, useState} from 'react';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/accordion";
import {LoaderCircle} from "lucide-react";
import {getClient} from "@/lib/graph/client";
import {AllQuestionAnswerPairDocument, QuestionAnswerPair} from "@/lib/graph/generated/graphql";


export default function FaqSection() {
  const [faqs, setFaqs] = useState<QuestionAnswerPair[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const client = getClient();
        const data = await client.request(AllQuestionAnswerPairDocument);
        const filteredFaqs = (data.questionAnswerPairs ?? [])
          .filter((faq) => !!faq);

        setFaqs(filteredFaqs);
      } catch (err) {
        console.error("Failed to fetch FAQs:", err);
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
          <LoaderCircle className="animate-spin h-8 w-8 text-foreground"/>
        </div>
      )}
      {!loading && faqs.length > 0 ? (
        <Accordion type="multiple" className="w-full">
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id} className="border-foreground-muted" data-cy={`kummerform-faq-${faq.id}`}>
              <AccordionTrigger className="text-lg text-foreground items-center hover:no-underline" data-cy={`kummerform-faq-question-${faq.id}`}>
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-foreground leading-relaxed transition-all" data-cy={`kummerform-faq-answer-${faq.id}`}>
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="text-center text-foreground py-8" data-cy={'kummerform-faq-empty'}>
          Keine FAQs verfügbar.
        </div>
      )}
    </section>
  );
};
