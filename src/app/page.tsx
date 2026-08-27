"use client";

import { useState } from "react";

import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import UploadSection from "@/components/upload/UploadSection";
import ProcessingProgress from "@/components/upload/ProcessingProgress";
import AssessmentResults from "@/components/assessment/AssessmentResults";

import type { AnalysisResult } from "@/lib/types";

type Stage =
  | "idle"
  | "processing"
  | "done";

export default function Home() {
  const [stage, setStage] =
    useState<Stage>("idle");

  const [progressStep, setProgressStep] =
    useState(0);

  const [result, setResult] =
    useState<AnalysisResult | null>(null);

  const [answerSheet, setAnswerSheet] =
    useState<File | null>(null);

  const [error, setError] =
    useState("");

  async function startMapping(
    questionPaper: File,
    studentAnswerSheet: File
  ) {
    setError("");
    setStage("processing");
    setAnswerSheet(studentAnswerSheet);

    const formData = new FormData();

    formData.append(
      "questionPaper",
      questionPaper
    );

    formData.append(
      "answerSheet",
      studentAnswerSheet
    );

    setProgressStep(0);

    const progressTimer =
      setInterval(() => {
        setProgressStep((step) =>
          step < 3 ? step + 1 : step
        );
      }, 900);

    try {
      const response = await fetch(
        "/api/analyze",
        {
          method: "POST",
          body: formData
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Assessment processing failed."
        );
      }

      setResult(data);
      setProgressStep(4);
      setStage("done");
    } catch (error: any) {
      setError(
        error?.message ||
          "Something went wrong."
      );
      setStage("idle");
    } finally {
      clearInterval(progressTimer);
    }
  }

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="main-area">
        <Header />

        {stage === "idle" && (
          <>
            <UploadSection
              onStart={startMapping}
            />

            {error && (
              <div className="global-error">
                {error}
              </div>
            )}
          </>
        )}

        {stage === "processing" && (
          <ProcessingProgress
            currentStep={progressStep}
          />
        )}

        {stage === "done" &&
          result &&
          answerSheet && (
            <AssessmentResults
              result={result}
              answerSheet={answerSheet}
            />
          )}
      </div>
    </div>
  );
}