export const APP_CONFIG = {
  name: "Assessment Mapper",
  subtitle: "AI Teacher's Toolkit",

  maxFileSizeMB: 10,

  acceptedFileTypes: [
    ".pdf",
    "image/png",
    "image/jpeg",
    "image/jpg"
  ],

  pdfMimeType: "application/pdf",

  processingSteps: [
    "Uploading files",
    "Extracting questions",
    "Reading answers",
    "Mapping answers",
    "Complete"
  ]
} as const;

export const NAV_ITEMS = [
  { label: "Home", icon: "grid" },
  { label: "My Classroom", icon: "classroom" },
  { label: "Assignments", icon: "assignment" },
  { label: "Exams", icon: "exam", active: true },
  { label: "My Library", icon: "library" }
] as const;