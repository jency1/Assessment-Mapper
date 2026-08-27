import { NextRequest, NextResponse } from "next/server";

import { EXTRACTION_PROMPT } from "@/lib/prompt";

import type {
  AnalysisResult,
  AnswerRegion,
  Mapping,
  MappingStatus,
  Question
} from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 120;

function clamp(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(1, value));
}

function cleanJson(text: string): string {
  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function normalizeMarks(
  value: unknown
): number | undefined {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return undefined;
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return undefined;
  }

  if (number < 0) {
    return 0;
  }

  return number;
}

function fileToPart(file: File) {
  return file.arrayBuffer().then((buffer) => ({
    inline_data: {
      mime_type:
        file.type ||
        "application/octet-stream",
      data: Buffer.from(buffer).toString(
        "base64"
      )
    }
  }));
}

function normalizeResult(
  raw: any
): AnalysisResult {
  const questions =
    Array.isArray(raw?.questions)
      ? raw.questions
      : [];

  const answers =
    Array.isArray(raw?.answers)
      ? raw.answers
      : [];

  const mappings =
    Array.isArray(raw?.mappings)
      ? raw.mappings
      : [];

  const normalizedQuestions =
    questions.map(
      (
        question: any,
        index: number
      ) => ({
        id: String(
          question?.id ||
            `q-${index + 1}`
        ),

        number: String(
          question?.number ||
            index + 1
        ),

        text: String(
          question?.text || ""
        ),

        page: Number(
          question?.page || 1
        ),

        marks: normalizeMarks(
          question?.marks
        ),

        bbox: question?.bbox
          ? {
              x: clamp(
                Number(
                  question.bbox.x
                )
              ),

              y: clamp(
                Number(
                  question.bbox.y
                )
              ),

              width: clamp(
                Number(
                  question.bbox.width
                )
              ),

              height: clamp(
                Number(
                  question.bbox.height
                )
              )
            }
          : undefined
      })
    );

  const normalizedAnswers =
    answers.map(
      (
        answer: any,
        index: number
      ) => ({
        id: String(
          answer?.id ||
            `a-${index + 1}`
        ),

        page: Number(
          answer?.page || 1
        ),

        bbox: {
          x: clamp(
            Number(
              answer?.bbox?.x
            )
          ),

          y: clamp(
            Number(
              answer?.bbox?.y
            )
          ),

          width: clamp(
            Number(
              answer?.bbox?.width
            )
          ),

          height: clamp(
            Number(
              answer?.bbox?.height
            )
          )
        },

        text: String(
          answer?.text || ""
        ),

        detectedLabel:
          answer?.detectedLabel
            ? String(
                answer.detectedLabel
              )
            : null
      })
    );

  const answerIds = new Set(
    normalizedAnswers.map(
      (answer: AnswerRegion) =>
        answer.id
    )
  );

  const normalizedMappings =
    normalizedQuestions.map(
      (question: Question) => {
        const mapping =
          mappings.find(
            (item: any) =>
              String(
                item?.questionId
              ) === question.id
          );

        const mappedAnswerIds =
          Array.isArray(
            mapping?.answerIds
          )
            ? mapping.answerIds
                .map(String)
                .filter(
                  (
                    id: string
                  ) =>
                    answerIds.has(id)
                )
            : [];

        let status: MappingStatus;

        if (
          mapping?.status ===
          "uncertain"
        ) {
          status = "uncertain";
        } else if (
          mappedAnswerIds.length >
          0
        ) {
          status = "answered";
        } else {
          status = "unanswered";
        }

        const questionMarks =
          question.marks;

        const aiMaxMarks =
          normalizeMarks(
            mapping?.maxMarks
          );

        const maxMarks =
          questionMarks ??
          aiMaxMarks ??
          0;

        let awardedMarks =
          normalizeMarks(
            mapping?.awardedMarks
          ) ?? 0;

        if (
          status === "unanswered"
        ) {
          awardedMarks = 0;
        }

        if (
          status === "uncertain"
        ) {
          awardedMarks = Math.min(
            awardedMarks,
            maxMarks
          );
        }

        awardedMarks = Math.min(
          Math.max(
            0,
            awardedMarks
          ),
          maxMarks
        );

        return {
          questionId:
            question.id,

          answerIds:
            mappedAnswerIds,

          status,

          confidence: clamp(
            Number(
              mapping?.confidence ??
                (
                  status ===
                  "answered"
                    ? 0.8
                    : 1
                )
            )
          ),

          reason: String(
            mapping?.reason ||
              (
                status ===
                "unanswered"
                  ? "No matching answer region was found."
                  : "Answer region identified."
              )
          ),

          feedback: String(
            mapping?.feedback ||
              (
                status ===
                "unanswered"
                  ? "No answer was found for this question."
                  : ""
              )
          ),

          awardedMarks,

          maxMarks
        };
      }
    );

  const totalMarks =
    normalizedMappings.reduce(
      (
        total: number,
        mapping: Mapping
      ) =>
        total +
        (mapping.maxMarks ?? 0),
      0
    );

  const obtainedMarks =
    normalizedMappings.reduce(
      (
        total: number,
        mapping: Mapping
      ) =>
        total +
        (mapping.awardedMarks ?? 0),
      0
    );

  const percentage =
    totalMarks > 0
      ? Number(
          (
            (obtainedMarks /
              totalMarks) *
            100
          ).toFixed(2)
        )
      : 0;

  const mappedAnswerIds =
    new Set(
      normalizedMappings.flatMap(
        (mapping: Mapping) =>
          mapping.answerIds
      )
    );

  return {
    questions:
      normalizedQuestions,

    answers:
      normalizedAnswers,

    mappings:
      normalizedMappings,

    summary: {
      totalQuestions:
        normalizedQuestions.length,

      answered:
        normalizedMappings.filter(
          (mapping: Mapping) =>
            mapping.status ===
            "answered"
        ).length,

      unanswered:
        normalizedMappings.filter(
          (mapping: Mapping) =>
            mapping.status ===
            "unanswered"
        ).length,

      uncertain:
        normalizedMappings.filter(
          (mapping: Mapping) =>
            mapping.status ===
            "uncertain"
        ).length,

      unmatchedAnswers:
        normalizedAnswers.filter(
          (
            answer: AnswerRegion
          ) =>
            !mappedAnswerIds.has(
              answer.id
            )
        ).length,

      totalMarks,

      obtainedMarks,

      percentage
    }
  };
}

export async function POST(
  request: NextRequest
) {
  try {
    const apiKey =
      process.env.GEMINI_API_KEY;

    const model =
      process.env.GEMINI_MODEL ||
      "gemini-2.5-flash";

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "GEMINI_API_KEY is not configured."
        },
        {
          status: 500
        }
      );
    }

    const formData =
      await request.formData();

    const questionPaper =
      formData.get(
        "questionPaper"
      );

    const answerSheet =
      formData.get(
        "answerSheet"
      );

    if (
      !(
        questionPaper instanceof
        File
      ) ||
      !(
        answerSheet instanceof
        File
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Please upload both the question paper and answer sheet."
        },
        {
          status: 400
        }
      );
    }

    const requestBody = {
      contents: [
        {
          role: "user",

          parts: [
            {
              text: EXTRACTION_PROMPT
            },

            {
              text:
                "\nQUESTION PAPER:\n"
            },

            await fileToPart(
              questionPaper
            ),

            {
              text:
                "\nSTUDENT ANSWER SHEET:\n"
            },

            await fileToPart(
              answerSheet
            )
          ]
        }
      ],

      generationConfig: {
        temperature: 0.1,

        responseMimeType:
          "application/json"
      }
    };

    const response =
      await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
          model
        )}:generateContent?key=${encodeURIComponent(
          apiKey
        )}`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify(
            requestBody
          )
        }
      );

    if (!response.ok) {
      const errorText =
        await response.text();

      return NextResponse.json(
        {
          error:
            `Gemini API error: ${errorText}`
        },
        {
          status: 502
        }
      );
    }

    const data =
      await response.json();

    const text =
      data?.candidates?.[0]
        ?.content?.parts
        ?.map(
          (part: any) =>
            part.text || ""
        )
        .join("") || "";

    if (!text) {
      return NextResponse.json(
        {
          error:
            "The AI model returned no extraction result."
        },
        {
          status: 502
        }
      );
    }

    let parsed: any;

    try {
      parsed = JSON.parse(
        cleanJson(text)
      );
    } catch {
      return NextResponse.json(
        {
          error:
            "The AI returned invalid JSON.",

          raw: text
        },
        {
          status: 502
        }
      );
    }

    const result =
      normalizeResult(parsed);

    console.log(
      "QUESTION MARKS:",
      result.questions.map(
        (question: Question) => ({
          number:
            question.number,

          marks:
            question.marks
        })
      )
    );

    console.log(
      "GRADING SUMMARY:",
      result.summary
    );

    return NextResponse.json(
      result
    );
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Unexpected server error."
      },
      {
        status: 500
      }
    );
  }
}