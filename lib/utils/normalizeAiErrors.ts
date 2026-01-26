export function normalizeAiImportError(error: unknown): string {
  if (error instanceof Error) {
    const msg = error.message;

    // AI errors
    if (msg.includes("429")) return "Too many AI requests — try again later";
    if (msg.includes("404")) return "AI model unavailable";
    if (msg.includes("413")) return "Uploaded image too large";

    return msg;
  }

  return "Something went wrong during AI processing";
}
