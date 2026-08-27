import type { AnswerRegion } from "@/lib/types";

type Props = {
  region: AnswerRegion;
  index: number;
};

export default function HighlightOverlay({
  region,
  index
}: Props) {
  return (
    <div
      className="answer-highlight"
      style={{
        left: `${region.bbox.x * 100}%`,
        top: `${region.bbox.y * 100}%`,
        width: `${region.bbox.width * 100}%`,
        height: `${region.bbox.height * 100}%`
      }}
    >
      <span className="highlight-label">
        {region.detectedLabel ||
          `Answer ${index + 1}`}
      </span>
    </div>
  );
}