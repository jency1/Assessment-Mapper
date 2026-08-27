"use client";

import { useMemo, useState } from "react";
import { FileText, UploadCloud, CheckCircle2, CircleAlert, Circle, Loader2, Sparkles } from "lucide-react";
import type { AnalysisResult, Question } from "@/lib/types";

type Stage = "idle" | "uploading" | "questions" | "answers" | "mapping" | "done";

const stages: { key: Stage; label: string }[] = [
  { key: "uploading", label: "Uploading files" },
  { key: "questions", label: "Extracting questions" },
  { key: "answers", label: "Reading answers" },
  { key: "mapping", label: "Mapping answers" },
  { key: "done", label: "Complete" }
];

function fmtSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function AssessmentApp() {
  const [questionPaper, setQuestionPaper] = useState<File | null>(null);
  const [answerSheet, setAnswerSheet] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [error, setError] = useState("");

  const selectedQuestion = useMemo(
    () => result?.questions.find(q => q.id === selectedId) || result?.questions[0],
    [result, selectedId]
  );

  const selectedMapping = useMemo(
    () => result?.mappings.find(m => m.questionId === selectedQuestion?.id),
    [result, selectedQuestion]
  );

  const selectedAnswers = useMemo(() => {
    if (!result || !selectedMapping) return [];
    return result.answers.filter(a => selectedMapping.answerIds.includes(a.id));
  }, [result, selectedMapping]);

  async function analyze() {
    if (!questionPaper || !answerSheet) return;
    setError("");
    setResult(null);
    setStage("uploading");

    const fd = new FormData();
    fd.append("questionPaper", questionPaper);
    fd.append("answerSheet", answerSheet);

    setTimeout(() => setStage("questions"), 500);
    setTimeout(() => setStage("answers"), 1400);
    setTimeout(() => setStage("mapping"), 2500);

    try {
      const res = await fetch("/api/analyze", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed.");
      setResult(data);
      setSelectedId(data.questions?.[0]?.id || null);
      setStage("done");
    } catch (e: any) {
      setError(e.message || "Something went wrong.");
      setStage("idle");
    }
  }

  const progressIndex = stages.findIndex(s => s.key === stage);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">V</div>
          <span>Assessment Platform</span>
          <span className="brand-sub">Assessment Mapper</span>
        </div>
        <span className="brand-sub">AI-powered extraction & answer mapping</span>
      </header>

      <main className="content">
        <section className="hero">
          <div>
            <div className="eyebrow">Teacher workspace</div>
            <h1>Assess handwritten answers faster.</h1>
            <p className="subtitle">
              Upload a question paper and a student answer sheet. The system extracts questions,
              finds handwritten answers, maps them—even when answered out of order—and highlights the exact regions.
            </p>
          </div>
        </section>

        <section className="upload-grid">
          <UploadCard
            title="Question paper"
            hint="PDF, JPG or PNG"
            file={questionPaper}
            onChange={setQuestionPaper}
          />
          <UploadCard
            title="Student answer sheet"
            hint="PDF, JPG or PNG"
            file={answerSheet}
            onChange={setAnswerSheet}
          />
        </section>

        <div className="action-row">
          {error && <div className="error">{error}</div>}
          <button className="primary" disabled={!questionPaper || !answerSheet || stage !== "idle"} onClick={analyze}>
            {stage !== "idle" && stage !== "done" ? <><Loader2 size={15} className="spin" /> Processing...</> : <><Sparkles size={15} /> Process assessment</>}
          </button>
        </div>

        {stage !== "idle" && (
          <div className="progress">
            {stages.map((s, i) => (
              <div key={s.key} className={`step ${i < progressIndex ? "done" : ""} ${i === progressIndex ? "active" : ""}`}>
                {i < progressIndex ? "✓ " : i === progressIndex ? "● " : "○ "}{s.label}
              </div>
            ))}
          </div>
        )}

        {result && (
          <section className="results">
            <div className="summary">
              <Stat label="Questions" value={result.summary.totalQuestions} />
              <Stat label="Answered" value={result.summary.answered} />
              <Stat label="Unanswered" value={result.summary.unanswered} />
              <Stat label="Unmatched answers" value={result.summary.unmatchedAnswers} />
            </div>

            <div className="workspace">
              <div className="card question-panel">
                <div className="panel-header">
                  <strong>Questions</strong>
                  <span>{result.questions.length} total</span>
                </div>
                <div className="question-list">
                  {result.questions.map(q => {
                    const mapping = result.mappings.find(m => m.questionId === q.id);
                    return (
                      <button
                        key={q.id}
                        className={`question-row ${selectedQuestion?.id === q.id ? "selected" : ""}`}
                        onClick={() => setSelectedId(q.id)}
                      >
                        <div className="q-number">{q.number}</div>
                        <div className="q-preview">{q.text || "Question text unavailable"}</div>
                        <StatusIcon status={mapping?.status || "unanswered"} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="card viewer">
                <div className="viewer-head">
                  <strong>{selectedQuestion?.number || "Question"} {selectedQuestion ? "— answer location" : ""}</strong>
                  <span>
                    {selectedAnswers.length
                      ? `${selectedAnswers.length} region${selectedAnswers.length > 1 ? "s" : ""} highlighted`
                      : "No answer region found"}
                  </span>
                </div>
                <div className="document-stage">
                  {selectedQuestion ? (
                    <div className="page">
                      <div className="fake-page-content">
                        <div style={{ fontWeight: 800, marginBottom: 22 }}>Student Answer Sheet</div>
                        <div className="fake-line" />
                        <div className="fake-line short" />
                        <div className="fake-line" />
                        <div className="fake-line" />
                        <div className="fake-line short" />
                        <div className="fake-line" />
                        <div className="fake-line short" />
                        <p style={{ marginTop: 40, color: "#8b909c", fontSize: 12 }}>
                          Page {selectedAnswers[0]?.page || selectedQuestion.page}
                        </p>
                      </div>
                      {selectedAnswers.map((a, idx) => (
                        <div
                          key={a.id}
                          className="answer-highlight"
                          style={{
                            left: `${a.bbox.x * 100}%`,
                            top: `${a.bbox.y * 100}%`,
                            width: `${a.bbox.width * 100}%`,
                            height: `${a.bbox.height * 100}%`
                          }}
                        >
                          <div className="highlight-label">
                            {a.detectedLabel || selectedQuestion.number} · region {idx + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-view">
                      <div>
                        <FileText size={35} />
                        <p>Select a question to view its answer.</p>
                      </div>
                    </div>
                  )}
                </div>
                {selectedQuestion && (
                  <div style={{ padding: "14px 18px", borderTop: "1px solid #ececf1" }}>
                    <div style={{ fontWeight: 800, fontSize: 13 }}>{selectedQuestion.number}</div>
                    <div style={{ color: "#737885", fontSize: 12, lineHeight: 1.55, marginTop: 5 }}>{selectedQuestion.text}</div>
                    {selectedMapping?.reason && <div className="note"><b>Mapping:</b> {selectedMapping.reason}</div>}
                    {selectedAnswers.length > 0 && (
                      <div className="note"><b>Extracted answer:</b> {selectedAnswers.map(a => a.text).join(" ")}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {!result && stage === "idle" && (
          <div className="card" style={{ padding: 20, marginTop: 5 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", fontWeight: 800, fontSize: 13 }}>
              <CircleAlert size={17} />
              Recommended test cases
            </div>
            <div className="note" style={{ marginTop: 10 }}>
              Test with numbered answers, out-of-order answers, 11(a)/11(b), unanswered questions,
              answers continuing onto another page, and extra handwritten content without a matching question.
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function UploadCard({
  title, hint, file, onChange
}: {
  title: string;
  hint: string;
  file: File | null;
  onChange: (f: File | null) => void;
}) {
  return (
    <div className="card upload-card">
      <div className="card-title">
        <strong>{title}</strong>
        <span>{hint}</span>
      </div>
      <label className="dropzone">
        <div className="upload-icon"><UploadCloud size={21} /></div>
        {file ? (
          <>
            <div className="file-name">{file.name}</div>
            <div className="file-meta">{fmtSize(file.size)}</div>
            <div className="choose">Choose another</div>
          </>
        ) : (
          <>
            <div style={{ fontWeight: 750, fontSize: 13 }}>Drop your file here</div>
            <div className="file-meta">or click to browse</div>
            <div className="choose">Choose file</div>
          </>
        )}
        <input
          type="file"
          accept=".pdf,image/png,image/jpeg,image/jpg"
          hidden
          onChange={e => onChange(e.target.files?.[0] || null)}
        />
      </label>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card stat">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}

function StatusIcon({ status }: { status: "answered" | "unanswered" | "uncertain" }) {
  if (status === "answered") return <span className="badge answered"><CheckCircle2 size={13} /></span>;
  if (status === "uncertain") return <span className="badge uncertain"><CircleAlert size={13} /></span>;
  return <span className="badge unanswered"><Circle size={13} /></span>;
}
