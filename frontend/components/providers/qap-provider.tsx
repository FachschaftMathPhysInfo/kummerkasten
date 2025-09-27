"use client"

import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {
  AllQuestionAnswerPairDocument,
  QuestionAnswerPair
} from "@/lib/graph/generated/graphql";
import {getClient} from "@/lib/graph/client";

interface QAPContextType {
  qaps: QuestionAnswerPair[];
  triggerQAPRefetch: () => void;
}

const QAPContext = createContext<QAPContextType | null>(null);

export function QAPProvider({children}: { children: ReactNode }) {
  const [qaps, setQaps] = useState<QuestionAnswerPair[]>([]);
  const [refetchKey, setRefetchKey] = useState(false);

  useEffect(() => {
    const fetchQAPs = async () => {
      const client = getClient()
      const data = await client.request(AllQuestionAnswerPairDocument)
      setQaps(data.questionAnswerPairs?.filter(qap => !!qap)
        .map(qap => ({
          id: qap.id,
          question: qap.question,
          answer: qap.answer,
          position: qap.position,
        })) ?? [])
    }

    void fetchQAPs();
  }, [refetchKey]);

  function triggerQAPRefetch() {
    setRefetchKey(!refetchKey);
  }


  return (
    <QAPContext.Provider value={{qaps: qaps, triggerQAPRefetch: triggerQAPRefetch}}>
      {children}
    </QAPContext.Provider>
  );
}

export const useQAPs = (): QAPContextType => {
  const context = useContext(QAPContext);

  if (!context) {
    throw new Error("useQAPs must be used within a QAPProvider");
  }

  return context;
}