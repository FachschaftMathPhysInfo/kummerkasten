"use client"

import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {
  AllQuestionAnswerPairDocument,
  CreateQuestionAnswerPairDocument,
  DeleteQuestionAnswerPairDocument,
  NewQuestionAnswerPair,
  QuestionAnswerPair,
  UpdateQuestionAnswerPair,
  UpdateQuestionAnswerPairDocument, UpdateQuestionAnswerPairPosition, UpdateQuestionAnswerPairPositionsDocument
} from "@/lib/graph/generated/graphql";
import {getClient} from "@/lib/graph/client";

interface QAPContextType {
  qaps: QuestionAnswerPair[];
  createQap: (qap: NewQuestionAnswerPair) => Promise<string | null>
  updateQap: (id: string, qap: UpdateQuestionAnswerPair) => Promise<string | null>
  updateQapPositions: (qap: UpdateQuestionAnswerPairPosition[]) => Promise<string | null>
  deleteQaps: (ids: string[]) => Promise<string | null>
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

  async function createQap(qap: NewQuestionAnswerPair) {
    const client = getClient()

    try {
      await client.request(CreateQuestionAnswerPairDocument, {questionAnswerPair: qap})
      return null
    } catch (e) {
      return String(e)
    } finally {
      triggerQAPRefetch()
    }
  }

  async function updateQap(id: string, qap: UpdateQuestionAnswerPair) {
    const client = getClient()

    try {
      await client.request(UpdateQuestionAnswerPairDocument, {id, questionAnswerPair: qap})
      return null
    } catch (e) {
      return String(e)
    } finally {
      triggerQAPRefetch()
    }
  }

  async function updateQapPositions(qaps: UpdateQuestionAnswerPairPosition[]) {
    const client = getClient()

    try {
      await client.request(UpdateQuestionAnswerPairPositionsDocument, {qaps})
      return null
    } catch(e) {
      return String(e)
    } finally {
      triggerQAPRefetch()
    }
  }

  async function deleteQaps(ids: string[]) {
    const client = getClient()

    try {
      await client.request(DeleteQuestionAnswerPairDocument, {ids})
      return null
    } catch (e) {
      return String(e)
    } finally {
      triggerQAPRefetch()
    }
  }


  return (
    <QAPContext.Provider value={{qaps, createQap, updateQap, updateQapPositions, deleteQaps, triggerQAPRefetch}}>
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