"use client"; // Mark as a client component

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; // Import the Accordion components

// Define the structure for an FAQ item
interface FaqItem {
  value: string; // Unique identifier for the accordion item
  question: string;
  answer: string;
}

// Sample FAQ data
const faqData: FaqItem[] = [
  {
    value: "1",
    question: "Wie werden meine Daten verarbeitet?",
    answer: "Wir geben die Joni und der macht daraus Mate"
  },
  {
    value: "2",
    question: "Wer kann meine Daten einsehen?",
    answer: "Ich, und wenn du nochmal so ne dumme Frage stellst petz ich an dein Prof"
  },
  {
    value: "3",
    question: "Was soll ich (nicht) in das Formular schreiben?",
    answer: "bitte kein konstruktives Feedback"
  },
  {
    value: "4",
    question: "Wofür ist der Kummerkasten gedacht?",
    answer: "ich denke generell nicht so viel"
  },
];

const FaqSection: React.FC = () => {
  return (
    <section className="w-full max-w-4xl mx-auto my-12 p-8 bg-kummerkasten-highlight-bg text-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-gray-200 mb-6 text-center">Häufig gestellte Fragen</h2>
      <Accordion type="single" collapsible className="w-full">
        {faqData.map((faq) => (
          <AccordionItem key={faq.value} value={faq.value} className="border-gray-700">
            <AccordionTrigger className="hover:no-underline text-lg text-gray-100">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-gray-300 leading-relaxed">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default FaqSection;
