"use client";

import {
  FileText,
  Upload,
  X
} from "lucide-react";

import {
  formatFileSize,
  isAcceptedFile,
  isFileTooLarge
} from "@/utils/file";

type Props = {
  title: string;
  file: File | null;
  onChange: (file: File | null) => void;
};

export default function FileUploadCard({
  title,
  file,
  onChange
}: Props) {
  function handleFile(
    selectedFile?: File
  ) {
    if (!selectedFile) return;

    if (!isAcceptedFile(selectedFile)) {
      alert("Please upload a PDF, JPG or PNG file.");
      return;
    }

    if (isFileTooLarge(selectedFile)) {
      alert("Maximum file size is 10MB.");
      return;
    }

    onChange(selectedFile);
  }

  return (
    <label className="upload-card">
      {!file ? (
        <>
          <div className="upload-icon">
            <Upload size={20} />
          </div>

          <div className="upload-title">
            Upload <span>{title}</span>
          </div>

          <div className="upload-limit">
            Max 10MB
          </div>
        </>
      ) : (
        <div className="selected-file">
          <div className="file-icon">
            <FileText size={18} />
          </div>

          <div className="file-details">
            <strong>{file.name}</strong>
            <span>
              {formatFileSize(file.size)}
            </span>
          </div>

          <button
            type="button"
            className="remove-file"
            onClick={(event) => {
              event.preventDefault();
              onChange(null);
            }}
          >
            <X size={13} />
          </button>
        </div>
      )}

      <input
        type="file"
        hidden
        accept=".pdf,image/png,image/jpeg,image/jpg"
        onChange={(event) =>
          handleFile(event.target.files?.[0])
        }
      />
    </label>
  );
}