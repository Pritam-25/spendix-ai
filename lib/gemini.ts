import { GoogleGenerativeAI } from "@google/generative-ai";

const DEFAULT_EMBEDDING_MODEL = "gemini-embedding-001";

let cachedEmbeddingModel: ReturnType<
  GoogleGenerativeAI["getGenerativeModel"]
> | null = null;

function getEmbeddingModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  if (cachedEmbeddingModel) {
    return cachedEmbeddingModel;
  }

  const modelName = process.env.GEMINI_EMBED_MODEL ?? DEFAULT_EMBEDDING_MODEL;
  const genAI = new GoogleGenerativeAI(apiKey);
  cachedEmbeddingModel = genAI.getGenerativeModel({ model: modelName });
  return cachedEmbeddingModel;
}

export async function generateEmbedding(content: string) {
  const trimmed = content.trim();
  if (!trimmed) {
    throw new Error("Cannot generate embedding for empty content");
  }

  const model = getEmbeddingModel();
  const response = await model.embedContent(trimmed);
  const values = response.embedding?.values;

  if (!values?.length) {
    throw new Error("Embedding response missing values");
  }

  return values;
}
