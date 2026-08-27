"use client";

import {
  useEffect,
  useRef,
  useState
} from "react";

import {
  Document,
  Page,
  pdfjs
} from "react-pdf";

import type { AnswerRegion } from "@/lib/types";
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
  const viewerRef =
    useRef<HTMLDivElement | null>(null);

  const [pageWidth, setPageWidth] =
    useState<number | null>(null);

  const [viewerWidth, setViewerWidth] =
    useState(0);

  const currentRegions =
    regions.filter(
      (region) =>
        region.page === currentPage
    );

  useEffect(() => {
    const element =
      viewerRef.current;

    if (!element) {
      return;
    }

    const updateWidth = () => {
      setViewerWidth(
        element.clientWidth
      );
    };

    updateWidth();

    const observer =
      new ResizeObserver(updateWidth);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    setPageWidth(null);
  }, [fileUrl, currentPage]);

  const isMobile =
    typeof window !== "undefined" &&
    window.innerWidth <= 900;

  /*
   * At mobile width, calculate the scale
   * required to fit the complete paper
   * inside the available answer-view box.
   *
   * Desktop keeps the existing zoom behavior.
   */
  const fitScale =
    isMobile &&
    pageWidth &&
    viewerWidth > 0
      ? Math.min(
          1,
          (viewerWidth - 24) /
            pageWidth
        )
      : 1;

  const effectiveScale =
    isMobile
      ? fitScale * zoom
      : zoom;

  function handlePageLoadSuccess(
    page: {
      getViewport: (options: {
        scale: number;
      }) => {
        width: number;
        height: number;
      };
    }
  ) {
    const viewport =
      page.getViewport({
        scale: 1
      });

    setPageWidth(viewport.width);
  }

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
        ref={viewerRef}
        className="pdf-viewer-container"
      >
        <div
          className="sheet-page"
          style={
            {
              "--zoom": effectiveScale
            } as React.CSSProperties
          }
        >
          <div className="sheet-page-inner">
            <Page
              pageNumber={currentPage}
              scale={effectiveScale}
              onLoadSuccess={
                handlePageLoadSuccess
              }
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />

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