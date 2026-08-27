export type BBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Question = {
  id: string;
  number: string;
  text: string;
  page: number;
  bbox?: BBox;
  marks?: number;
};

export type AnswerRegion = {
  id: string;
  page: number;
  bbox: BBox;
  text: string;
  detectedLabel?: string | null;
};

export type MappingStatus =
  | "answered"
  | "unanswered"
  | "uncertain";

export type Mapping = {
  questionId: string;
  answerIds: string[];
  status: MappingStatus;
  confidence: number;
  reason: string;
  feedback?: string;
  awardedMarks?: number;
  maxMarks?: number;
};

export type AssessmentSummary = {
  totalQuestions: number;
  answered: number;
  unanswered: number;
  uncertain: number;
  unmatchedAnswers: number;
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
};

export type AnalysisResult = {
  questions: Question[];
  answers: AnswerRegion[];
  mappings: Mapping[];
  summary: AssessmentSummary;
};