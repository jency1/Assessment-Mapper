"use client";

import {
  useEffect,
  useState
} from "react";

import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus
} from "lucide-react";

import type {
  AnswerRegion
} from "@/lib/types";

import HighlightOverlay from "./HighlightOverlay";
import PdfViewer from "./PdfViewer";
import { getFileType } from "@/utils/file";

type Props = {
  file: File;
  regions: AnswerRegion[];
  focusPage?: number;
};

export default function AnswerSheetViewer({
  file,
  regions,
  focusPage = 1
}: Props) {

  const isMobile = window.innerWidth < 768;
  
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(focusPage);
  const [zoom, setZoom] = useState(isMobile ? 0.3 : 0.7);
  const [fileUrl, setFileUrl] = useState("");

  const type = getFileType(file);

  useEffect(() => {
    const url =
      URL.createObjectURL(file);

    setFileUrl(url);
    setCurrentPage(focusPage);
    setPageCount(0);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file, focusPage]);

  useEffect(() => {
    setCurrentPage(focusPage);
  }, [focusPage]);

  const currentRegions =
    regions.filter(
      (region) =>
        region.page === currentPage
    );

  function handleDocumentLoad({
    numPages
  }: {
    numPages: number;
  }) {
    setPageCount(numPages);
  }

  function previousPage() {
    setCurrentPage((page) =>
      Math.max(1, page - 1)
    );
  }

  function nextPage() {
    setCurrentPage((page) =>
      Math.min(pageCount, page + 1)
    );
  }

  function decreaseZoom() {
    setZoom((value) =>
      Math.max(
        0.2,
        Number(
          (value - 0.1).toFixed(1)
        )
      )
    );
  }

  function increaseZoom() {
    setZoom((value) =>
      Math.min(
        2,
        Number(
          (value + 0.1).toFixed(1)
        )
      )
    );
  }

  return (
    <div className="viewer-wrapper">
      <div className="viewer-toolbar">
        <div className="viewer-title">
          <strong>
            Answer Sheet
          </strong>

          <span>
            {type === "pdf"
              ? `${currentPage} of ${
                  pageCount || "-"
                }`
              : "Image"}
          </span>
        </div>

        <div className="viewer-controls">
          <button
            type="button"
            onClick={decreaseZoom}
            disabled={zoom <= 0.2}
            aria-label="Zoom out"
          >
            <Minus size={14} />
          </button>

          <span>
            {Math.round(zoom * 100)}%
          </span>

          <button
            type="button"
            onClick={increaseZoom}
            disabled={zoom >= 2}
            aria-label="Zoom in"
          >
            <Plus size={14} />
          </button>

          {type === "pdf" && (
            <>
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={previousPage}
                aria-label="Previous page"
              >
                <ChevronLeft size={15} />
              </button>

              <button
                type="button"
                disabled={
                  currentPage >= pageCount
                }
                onClick={nextPage}
                aria-label="Next page"
              >
                <ChevronRight size={15} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="viewer-scroll">
        {fileUrl &&
          type === "pdf" && (
            <PdfViewer
              fileUrl={fileUrl}
              currentPage={currentPage}
              zoom={zoom}
              regions={regions}
              onLoadSuccess={
                handleDocumentLoad
              }
            />
          )}

        {fileUrl &&
          type === "image" && (
            <div
              className="sheet-page"
              style={
                {
                  "--zoom": zoom
                } as React.CSSProperties
              }
            >
              <div className="sheet-page-inner">
                <img
                  src={fileUrl}
                  alt="Student answer sheet"
                  className="answer-image"
                  style={{
                    width: `${zoom * 100}%`,
                    maxWidth: "none"
                  }}
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
          )}
      </div>
    </div>
  );
}