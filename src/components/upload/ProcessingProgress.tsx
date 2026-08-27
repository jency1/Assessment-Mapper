"use client";

type Props = {
  currentStep: number;
};

const steps = [
  "Uploading files",
  "Extracting questions",
  "Reading answers",
  "Mapping answers",
  "Complete"
];

export default function ProcessingProgress({
  currentStep
}: Props) {
  return (
    <div className="processing-wrapper">
      <div className="processing-card">
        <div className="processing-title">
          Processing assessment
        </div>

        <div className="processing-steps">
          {steps.map((step, index) => {
            const done = index < currentStep;
            const active = index === currentStep;

            return (
              <div
                key={step}
                className={`processing-step ${
                  done ? "done" : ""
                } ${active ? "active" : ""}`}
              >
                <span className="processing-dot">
                  {done ? "✓" : index + 1}
                </span>

                <span>{step}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}