# Assessment Extraction & Answer Mapping

A Next.js project for AI Assessment Extraction & Answer Mapping

## What it does

- Upload a question paper and handwritten answer sheet.
- Sends both documents to a vision-capable Gemini model.
- Extracts printed questions in order.
- Treats labelled sub-parts such as `11 (a)` and `11 (b)` as separate questions.
- Extracts answer regions with normalized bounding boxes.
- Maps answers even when they are out of order.
- Tracks unanswered questions and unmatched answer regions.
- Supports multiple physical answer regions for answers spanning pages.
- Highlights mapped regions in the assessment workspace.

## Setup

Requirements:

- Node.js 18+
- A Gemini API key

Install:

```bash
npm install
```

Create `.env`:

```env
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash
```

Run:

```bash
npm run dev
```

Open http://localhost:3000.

## API

`POST /api/analyze`

Multipart fields:

- `questionPaper`
- `answerSheet`

The route returns:

```json
{
  "questions": [],
  "answers": [],
  "mappings": [],
  "summary": {}
}
```
