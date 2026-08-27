import type { AnalysisResult } from "@/lib/types";

type Props = {
  result: AnalysisResult;
};

export default function AssessmentSummary({
  result
}: Props) {
  const stats = [
    {
      label: "Questions",
      value: result.summary.totalQuestions
    },
    {
      label: "Answered",
      value: result.summary.answered
    },
    {
      label: "Unanswered",
      value: result.summary.unanswered
    },
    {
      label: "Unmatched",
      value: result.summary.unmatchedAnswers
    }
  ];

  return (
    <div className="summary-grid">
      {stats.map((stat) => (
        <div className="summary-card" key={stat.label}>
          <span>{stat.label}</span>
          <strong>{stat.value}</strong>
        </div>
      ))}
    </div>
  );
}