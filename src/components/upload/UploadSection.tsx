"use client";

import { useState } from "react";
import {
  ArrowRight,
  UploadCloud
} from "lucide-react";

import FileUploadCard from "./FileUploadCard";

type Props = {
  onStart: (
    questionPaper: File,
    answerSheet: File
  ) => void;
  disabled?: boolean;
};

export default function UploadSection({
  onStart,
  disabled = false
}: Props) {
  const [questionPaper, setQuestionPaper] =
    useState<File | null>(null);

  const [answerSheet, setAnswerSheet] =
    useState<File | null>(null);

  const ready =
    Boolean(questionPaper && answerSheet);

  return (
    <section className="upload-page">
      <div className="upload-heading">
        <h1>
          Upload{" "}
          <span>
            Question Paper &amp; Answer Sheets
          </span>
        </h1>

        <p>
          Upload both files to get started
        </p>

        <div className="upload-illustration">
          <div className="illustration-person">
            👩🏻‍🏫
          </div>
        </div>
      </div>

      <div className="upload-container">
        <FileUploadCard
          title="Question Paper"
          file={questionPaper}
          onChange={setQuestionPaper}
        />

        <FileUploadCard
          title="Answer Sheet"
          file={answerSheet}
          onChange={setAnswerSheet}
        />
      </div>

      <button
        className="mapping-button"
        disabled={!ready || disabled}
        onClick={() => {
          if (questionPaper && answerSheet) {
            onStart(
              questionPaper,
              answerSheet
            );
          }
        }}
      >
        Start Mapping
        <ArrowRight size={17} />
      </button>

      <p className="upload-help">
        Once both files are uploaded, you&apos;ll be
        able to map answers with questions
      </p>
    </section>
  );
}