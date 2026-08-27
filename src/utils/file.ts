import { APP_CONFIG } from "@/constants/app";

export function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function isAcceptedFile(file: File): boolean {
  const accepted = APP_CONFIG.acceptedFileTypes;

  return accepted.some((type) => {
    if (type.startsWith(".")) {
      return file.name.toLowerCase().endsWith(type);
    }

    return file.type === type;
  });
}

export function isFileTooLarge(file: File): boolean {
  return file.size > APP_CONFIG.maxFileSizeMB * 1024 * 1024;
}

export function getFileType(file: File): "pdf" | "image" {
  return file.type === "application/pdf" ? "pdf" : "image";
}