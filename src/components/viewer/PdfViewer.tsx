"use client";

import {
  Document,
  Page,
  pdfjs
} from "react-pdf";

import type {
  AnswerRegion
} from "@/lib/types";

import HighlightOverlay from "./HighlightOverlay";

type Props = {
  fileUrl: string;
  currentPage: number;
  zoom: number;
  regions: AnswerRegion[];
  onLoadSuccess: (data: {
    numPages: number;
  }) => void;
};

pdfjs.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export default function PdfViewer({
  fileUrl,
  currentPage,
  zoom,
  regions,
  onLoadSuccess
}: Props) {
  const currentRegions =
    regions.filter(
      (region) =>
        region.page === currentPage
    );

  return (
    <Document
      file={fileUrl}
      onLoadSuccess={onLoadSuccess}
      loading={
        <div className="pdf-loading">
          Loading answer sheet...
        </div>
      }
      error={
        <div className="pdf-loading">
          Unable to load answer sheet.
        </div>
      }
    >
      <div
        className="sheet-page"
        style={
          {
            "--zoom": zoom
          } as React.CSSProperties
        }
      >
        <div className="sheet-page-inner pdf-page-layer">
          <Page
            pageNumber={currentPage}
            scale={zoom}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />

          <div className="answer-highlight-layer">
            {currentRegions.map(
              (region, index) => (
                <HighlightOverlay
                  key={region.id}
                  region={region}
                  index={index}
                />
              )
            )}
          </div>
        </div>
      </div>
    </Document>
  );
}