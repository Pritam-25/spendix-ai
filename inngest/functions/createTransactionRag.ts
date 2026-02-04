import { randomUUID } from "crypto";
import { TransactionType } from "@prisma/client";
import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/prisma";
import { generateEmbedding } from "@/lib/gemini";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "long",
});

type TransactionCreatedEvent = {
  transaction?: TransactionPayload;
};

type TransactionPayload = {
  id: string;
  userId: string;
  accountId: string;
  accountName: string;
  amount: number;
  category: string;
  description?: string | null;
  date: string;
  type: TransactionType;
};

function transactionToText(tx: TransactionPayload, date: Date) {
  const humanAmount = currencyFormatter.format(tx.amount);
  const humanDate = dateFormatter.format(date);
  const description = tx.description?.trim() || "No description";

  return `Transaction of ${humanAmount} in category ${tx.category} (${tx.type.toLowerCase()}) on ${humanDate}. Description: ${description}. Account: ${tx.accountId}(name: ${tx.accountName}).`;
}

export const createTransactionRag = inngest.createFunction(
  {
    id: "create-transaction-rag",
    name: "Create Transaction RAG",
    retries: 3,
  },
  { event: "transaction.created" },
  async ({ event, step }) => {
    const payload = event.data as TransactionCreatedEvent;
    const tx = payload.transaction;

    if (!tx) {
      console.warn("[create-transaction-rag] Missing transaction payload", {
        eventId: event.id,
      });
      return;
    }

    const parsedDate = new Date(tx.date);
    if (Number.isNaN(parsedDate.getTime())) {
      console.warn("[create-transaction-rag] Invalid transaction date", {
        transactionId: tx.id,
        date: tx.date,
      });
      return;
    }

    const content = transactionToText(tx, parsedDate);

    // Generate embedding
    const embedding = await step.run("generate-transaction-embedding", () =>
      generateEmbedding(content),
    );

    // Insert or update transaction RAG
    await step.run("upsert-transaction-rag", async () => {
      const vectorLiteral = `[${embedding.join(",")}]`;
      const ragId = randomUUID();

      await prisma.$queryRaw`
        INSERT INTO transaction_rag (id, "userId", "transactionId", content, embedding)
        VALUES (${ragId}, ${tx.userId}, ${tx.id}, ${content}, ${vectorLiteral}::vector(768))
        ON CONFLICT ("transactionId")
        DO UPDATE SET content = EXCLUDED.content, embedding = EXCLUDED.embedding;
      `;
    });
  },
);
