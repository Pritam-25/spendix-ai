import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import {
  processRecurringTransaction,
  triggerRecurringTransactions,
} from "@/inngest/transaction";
import { storeUserMemory } from "@/inngest/memory";
import { createTransactionRag } from "@/inngest/functions/createTransactionRag";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    triggerRecurringTransactions,
    processRecurringTransaction,
    storeUserMemory,
    createTransactionRag,
  ],
});
