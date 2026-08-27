"use client";

import {
  CheckCircle2,
  FileQuestion,
  GraduationCap,
  Target
} from "lucide-react";

import type {
  AnalysisResult
} from "@/lib/types";

type Props = {
  result: AnalysisResult;
};

export default function GradingSummary({
  result
}: Props) {
  const {
    totalQuestions,
    answered,
    totalMarks,
    obtainedMarks,
    percentage
  } = result.summary;

  return (
    <div className="grading-summary">
      <div className="grading-card">
        <div className="grading-card-icon">
          <FileQuestion size={16} />
        </div>

        <div>
          <span>Total Questions</span>
          <strong>
            {totalQuestions}
          </strong>
        </div>
      </div>

      <div className="grading-card">
        <div className="grading-card-icon">
          <CheckCircle2 size={16} />
        </div>

        <div>
          <span>Answered</span>
          <strong>
            {answered}
            <small>
              / {totalQuestions}
            </small>
          </strong>
        </div>
      </div>

      <div className="grading-card">
        <div className="grading-card-icon">
          <Target size={16} />
        </div>

        <div>
          <span>Marks</span>
          <strong>
            {formatMarks(obtainedMarks)}
            <small>
              / {formatMarks(totalMarks)}
            </small>
          </strong>
        </div>
      </div>

      <div className="grading-card grading-card-score">
        <div className="grading-card-icon">
          <GraduationCap size={16} />
        </div>

        <div>
          <span>Score</span>
          <strong>
            {formatMarks(percentage)}%
          </strong>
        </div>
      </div>
    </div>
  );
}

function formatMarks(
  value: number
): string {
  if (!Number.isFinite(value)) {
    return "0";
  }

  return Number.isInteger(value)
    ? String(value)
    : value.toFixed(1);
}