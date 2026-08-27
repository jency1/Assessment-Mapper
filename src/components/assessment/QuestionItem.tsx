"use client";

import {
  Check,
  ChevronDown,
  CircleAlert,
  Circle
} from "lucide-react";

import type {
  MappingStatus,
  Question
} from "@/lib/types";

type Props = {
  question: Question;
  status: MappingStatus;
  answerCount: number;
  selected: boolean;
  expanded: boolean;

  feedback?: string;

  awardedMarks?: number;
  maxMarks?: number;

  onClick: () => void;
  onToggle: () => void;
};

export default function QuestionItem({
  question,
  status,
  answerCount,
  selected,
  expanded,
  feedback,
  awardedMarks,
  maxMarks,
  onClick,
  onToggle
}: Props) {
  return (
    <div
      className={`question-item-wrapper ${
        selected ? "selected" : ""
      }`}
    >
      <div
        className={`question-item ${
          selected ? "selected" : ""
        }`}
        onClick={onClick}
      >
        <div className="question-number">
          {question.number}
        </div>

        <div className="question-content">
          <p>
            {question.text}
          </p>

          <div className="question-meta">
            {status === "answered" && (
              <>
                <span className="score-badge">
                  {formatMarks(
                    awardedMarks
                  )}{" "}
                  /{" "}
                  {formatMarks(
                    maxMarks ??
                      question.marks ??
                      0
                  )}{" "}
                  marks
                </span>

                {answerCount > 1 && (
                  <span className="regions-badge">
                    {answerCount} regions
                  </span>
                )}
              </>
            )}

            {status === "uncertain" && (
              <span className="uncertain-badge">
                Review
              </span>
            )}

            {status === "unanswered" && (
              <span className="unanswered-badge">
                0 /{" "}
                {formatMarks(
                  maxMarks ??
                    question.marks ??
                    0
                )}{" "}
                marks
              </span>
            )}
          </div>
        </div>

        <div className="question-action">
          {status === "answered" && (
            <span className="status-icon success">
              <Check size={13} />
            </span>
          )}

          {status === "uncertain" && (
            <span className="status-icon warning">
              <CircleAlert size={13} />
            </span>
          )}

          {status === "unanswered" && (
            <span className="status-icon muted">
              <Circle size={13} />
            </span>
          )}

          <button
            type="button"
            className="question-expand-button"
            onClick={(event) => {
              event.stopPropagation();

              onToggle();
            }}
            aria-label={
              expanded
                ? "Collapse feedback"
                : "Show feedback"
            }
          >
            <ChevronDown
              size={15}
              className={
                expanded
                  ? "rotate-180"
                  : ""
              }
            />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="question-feedback">
          <div className="feedback-header">
            <strong>
              AI Feedback
            </strong>

            {status === "answered" && (
              <span className="feedback-score">
                {formatMarks(
                  awardedMarks
                )}{" "}
                /{" "}
                {formatMarks(
                  maxMarks ??
                    question.marks ??
                    0
                )}
              </span>
            )}
          </div>

          <p>
            {feedback ||
              getDefaultFeedback(
                status
              )}
          </p>
        </div>
      )}
    </div>
  );
}

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

function getDefaultFeedback(
  status: MappingStatus
): string {
  if (status === "unanswered") {
    return "No answer was found for this question.";
  }

  if (status === "uncertain") {
    return "The answer mapping is uncertain and should be reviewed.";
  }

  return "No AI feedback is available for this question.";
}