"use client";

import { useCallback, useEffect, useState } from "react";
import { MessageCircleQuestionMark } from "lucide-react";
import { getClient } from "@/lib/graph/client";
import { toast } from "sonner";
import { AllQuestionAnswerPairDocument, QuestionAnswerPair } from "@/lib/graph/generated/graphql";
import { QAPTable } from "@/app/(settings)/faq/faq-table";
import { ManagementPageHeader } from "@/components/management-page-header";

export default function QAPManagementPage() {
  const [faqs, setFaqs] = useState<QuestionAnswerPair[]>([]);

  const fetchFaqs = useCallback(async () => {
    const client = getClient();
    try {
      const response = await client.request<{ questionAnswerPairs: QuestionAnswerPair[] }>(
        AllQuestionAnswerPairDocument
      );
      if (!response.questionAnswerPairs) {
        setFaqs([]);
        return;
      }
      setFaqs(response.questionAnswerPairs.filter((qap) => !!qap));
    } catch {
      toast.error("Fehler beim Laden der FAQ");
    }
  }, []);

  useEffect(() => {
    void fetchFaqs();
  }, [fetchFaqs]);

  return (
    <div className="w-full h-full flex flex-col grow">
      <ManagementPageHeader
        icon={<MessageCircleQuestionMark/>}
        title="FAQ-Verwaltung"
        description="Sortiere, erstelle und lösche Frequently Asked Questions."
      />
      <div className="w-full h-full flex flex-col gap-6 px-10 pt-4 grow">
        <QAPTable data={faqs} refreshData={fetchFaqs}/>
      </div>
    </div>
  );
}
