import type {
  AnalysisResult,
  Mapping,
  Question
} from "@/lib/types";

export function getMapping(
  result: AnalysisResult,
  questionId: string
): Mapping | undefined {
  return result.mappings.find(
    (mapping) => mapping.questionId === questionId
  );
}

export function getQuestionsWithStatus(
  result: AnalysisResult
): Array<Question & { status: Mapping["status"] }> {
  return result.questions.map((question) => {
    const mapping = getMapping(result, question.id);

    return {
      ...question,
      status: mapping?.status ?? "unanswered"
    };
  });
}

export function getAnswerCount(
  result: AnalysisResult,
  questionId: string
): number {
  return getMapping(result, questionId)?.answerIds.length ?? 0;
}