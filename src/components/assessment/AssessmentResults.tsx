"use client";

import {
  useMemo,
  useState
} from "react";

import type {
  AnalysisResult
} from "@/lib/types";

import QuestionList from "./QuestionList";
import GradingSummary from "./GradingSummary";
import AnswerSheetViewer from "../viewer/AnswerSheetViewer";

type Props = {
  result: AnalysisResult;
  answerSheet: File;
};

export default function AssessmentResults({
  result,
  answerSheet
}: Props) {
  const [
    selectedQuestionId,
    setSelectedQuestionId
  ] = useState(
    result.questions[0]?.id ?? null
  );

  const [
    mobileTab,
    setMobileTab
  ] = useState<"questions" | "answers">(
    "answers"
  );

  const selectedQuestion = useMemo(
    () =>
      result.questions.find(
        (question) =>
          question.id ===
          selectedQuestionId
      ),
    [
      result.questions,
      selectedQuestionId
    ]
  );

  const selectedMapping = useMemo(
    () =>
      result.mappings.find(
        (mapping) =>
          mapping.questionId ===
          selectedQuestionId
      ),
    [
      result.mappings,
      selectedQuestionId
    ]
  );

  const selectedRegions = useMemo(
    () =>
      result.answers.filter(
        (answer) =>
          selectedMapping?.answerIds.includes(
            answer.id
          )
      ),
    [
      result.answers,
      selectedMapping
    ]
  );

  const focusPage =
    selectedRegions[0]?.page ??
    selectedQuestion?.page ??
    1;

  return (
    <section className="results-page">
      <GradingSummary
        result={result}
      />

      {/* =========================
          MOBILE TABS
      ========================= */}

      <div className="mobile-tabs">
        <button
          type="button"
          className={
            mobileTab === "questions"
              ? "active"
              : ""
          }
          onClick={() =>
            setMobileTab("questions")
          }
        >
          Questions
        </button>

        <button
          type="button"
          className={
            mobileTab === "answers"
              ? "active"
              : ""
          }
          onClick={() =>
            setMobileTab("answers")
          }
        >
          Answer Sheet
        </button>
      </div>

      {/* =========================
          MAPPING LAYOUT
      ========================= */}

      <div
        className={`mapping-layout ${
          mobileTab === "questions"
            ? "mobile-questions"
            : "mobile-answers"
        }`}
      >
        <QuestionList
          result={result}
          selectedQuestionId={
            selectedQuestionId
          }
          onSelect={
            setSelectedQuestionId
          }
        />

        <main className="answer-panel">
          <AnswerSheetViewer
            file={answerSheet}
            regions={selectedRegions}
            focusPage={focusPage}
          />

          {selectedQuestion && (
            <div className="question-detail">
              <div>
                <strong>
                  {selectedQuestion.number}
                </strong>

                <p>
                  {selectedQuestion.text}
                </p>
              </div>

              {selectedMapping && (
                <div className="mapping-feedback">
                  <strong>
                    AI Feedback
                  </strong>

                  <p>
                    {selectedMapping.feedback ||
                      selectedMapping.reason ||
                      getFallbackFeedback(
                        selectedMapping.status
                      )}
                  </p>

                  {selectedMapping.status ===
                    "answered" && (
                    <div className="detail-score">
                      {formatMarks(
                        selectedMapping.awardedMarks
                      )}{" "}
                      /{" "}
                      {formatMarks(
                        selectedMapping.maxMarks ??
                          selectedQuestion.marks
                      )}{" "}
                      marks
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </section>
  );
}

/* =========================
   HELPERS
========================= */

function formatMarks(
  value?: number
): string {
  if (
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return "0";
  }

  return Number.isInteger(value)
    ? String(value)
    : value.toFixed(1);
}

function getFallbackFeedback(
  status:
    | "answered"
    | "unanswered"
    | "uncertain"
): string {
  if (status === "unanswered") {
    return "No answer was found for this question.";
  }

  if (status === "uncertain") {
    return "The answer mapping is uncertain and should be reviewed.";
  }

  return "No AI feedback is available.";
}