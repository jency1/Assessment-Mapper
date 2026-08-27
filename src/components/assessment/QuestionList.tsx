"use client";

import { useState } from "react";

import {
  getAnswerCount
} from "@/utils/assessment";

import type {
  AnalysisResult,
  MappingStatus
} from "@/lib/types";

import QuestionItem from "./QuestionItem";

type Props = {
  result: AnalysisResult;
  selectedQuestionId: string | null;
  onSelect: (id: string) => void;
};

export default function QuestionList({
  result,
  selectedQuestionId,
  onSelect
}: Props) {
  const [
    expandedQuestionId,
    setExpandedQuestionId
  ] = useState<string | null>(null);

  function toggleQuestion(
    questionId: string
  ) {
    setExpandedQuestionId(
      (current) =>
        current === questionId
          ? null
          : questionId
    );
  }

  return (
    <aside className="question-panel">
      <div className="panel-title">
        <strong>
          Extracted Questions
        </strong>

        <span>
          {result.questions.length}
        </span>
      </div>

      <div className="question-list">
        {result.questions.map(
          (question) => {
            const mapping =
              result.mappings.find(
                (item) =>
                  item.questionId ===
                  question.id
              );

            const status: MappingStatus =
              mapping?.status ??
              "unanswered";

            return (
              <QuestionItem
                key={question.id}
                question={question}
                status={status}
                answerCount={getAnswerCount(
                  result,
                  question.id
                )}
                selected={
                  selectedQuestionId ===
                  question.id
                }
                expanded={
                  expandedQuestionId ===
                  question.id
                }
                feedback={
                  mapping?.feedback ||
                  mapping?.reason
                }
                awardedMarks={
                  mapping?.awardedMarks
                }
                maxMarks={
                  mapping?.maxMarks ??
                  question.marks
                }
                onClick={() =>
                  onSelect(question.id)
                }
                onToggle={() =>
                  toggleQuestion(
                    question.id
                  )
                }
              />
            );
          }
        )}
      </div>
    </aside>
  );
}