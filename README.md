<div align="center">

# Spendix — AI-Powered Personal Finance OS

**Spendix** is a type-safe, AI-native personal finance platform that fuses **Next.js 16**, **LangChain/LangGraph**, **pgvector on Neon**, and **event-driven automations** to remove manual bookkeeping, keep recurring cashflows in sync, and deliver conversational financial intelligence.

[Live Demo](https://spedix.app) · [Product Site](https://spedix.app) · Built with ❤️ using **pnpm**

![Spendix dashboard screenshot](public/screenshots/dashboard.png)

</div>

## Stack Signals

![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-111827?logo=radixui&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-1572B6?logo=css3&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3C3C3C?logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)
![Neon PostgreSQL](https://img.shields.io/badge/Neon%20PostgreSQL-1B212D?logo=postgresql&logoColor=white)
![pgvector](https://img.shields.io/badge/pgvector-0C4A6E?logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-2F855A?logoColor=white)
![LangGraph](https://img.shields.io/badge/LangGraph-18181B?logoColor=white)
![Vercel%20AI%20SDK](https://img.shields.io/badge/Vercel%20AI%20SDK-000000?logo=vercel&logoColor=white)
![Vercel%20AI%20Elements](https://img.shields.io/badge/Vercel%20AI%20Elements-0F172A?logo=vercel&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-2855C5?logo=google&logoColor=white)
![Nodemailer](https://img.shields.io/badge/Nodemailer-1D4ED8?logoColor=white)
![Inngest](https://img.shields.io/badge/Inngest-0F766E?logoColor=white)
![Arcjet](https://img.shields.io/badge/Arcjet-312E81?logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-1F2933?logo=clerk&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=white)

## Highlights

- Multi-account ledger with granular CRUD and **bank-statement bulk ingestion**.
- **Subscription-aware UX** where every feature is mapped to plan requirements via [config/plan-mapping.ts](config/plan-mapping.ts) and [config/features.ts](config/features.ts).
- **AI-powered flows**: LangGraph agent, Gemini tooling, LangChain tools, and Vercel AI Elements chat surface in [components/ai-elements](components/ai-elements).
- **Event-driven automations** using Inngest workers in [inngest/functions](inngest/functions) for recurring transactions, memory updates, and spend alerts.
- **pgvector-backed Retrieval-Augmented Generation** defined in [data/accounts/rag.ts](data/accounts/rag.ts) and [lib/ai/tools/accountRag.tool.ts](lib/ai/tools/accountRag.tool.ts).
- **Arcjet bot protection** wired through [lib/arcjet.ts](lib/arcjet.ts) to throttle scripted abuse.

## Feature Focus

### Subscription Plans & Usage Gates

- Plans, feature matrices, and ordering rules live in [config/plan-mapping.ts](config/plan-mapping.ts), [config/feature-requirements.ts](config/feature-requirements.ts), and [config/plan-order.ts](config/plan-order.ts).
- Clerk webhooks in [app/api/webhooks/clerk/auth/route.ts](app/api/webhooks/clerk/auth/route.ts) and [app/api/webhooks/clerk/billing/route.ts](app/api/webhooks/clerk/billing/route.ts) keep subscription state, billing metadata, and entitlements synced.
- UI gates reuse `useFeature()` and plan hooks under [hooks](hooks) to hide/disable premium affordances automatically.

### Recurring Transactions Engine

- Recurrence schemas live in [utils/recurring.ts](utils/recurring.ts) and [schemas/transaction.schema.ts](schemas/transaction.schema.ts).
- Scheduler + generator logic is wrapped in [inngest/functions/transaction.ts](inngest/functions/transaction.ts) with monthly summaries handled via [inngest/functions/transactionMonthlySummary.ts](inngest/functions/transactionMonthlySummary.ts).
- Users manage schedules through [app/(dashboard)/recurrings/page.tsx](<app/(dashboard)/recurrings/page.tsx>) with optimistic updates handled by [actions/transactions.action.ts](actions/transactions.action.ts).

### AI Imports & Bulk Bank Statements

- The dedicated workspace in [app/(dashboard)/ai-imports/page.tsx](<app/(dashboard)/ai-imports/page.tsx>) orchestrates uploading, Gemini parsing, and human-in-the-loop review.
- Components such as [app/(dashboard)/ai-imports/\_components/AiBulkRecieptScan.tsx](<app/(dashboard)/ai-imports/_components/AiBulkRecieptScan.tsx>) and [app/(dashboard)/ai-imports/\_components/BulkScanTransactionTable.tsx](<app/(dashboard)/ai-imports/_components/BulkScanTransactionTable.tsx>) pair Vercel AI Elements with LangChain tools to reconcile imported rows before commit.
- Data normalization uses helpers in [utils/serialize.ts](utils/serialize.ts) and duplicate-prevention constraints defined in [prisma/migrations/20260125165256_add_unique_constraints_to_prevent_duplicate_transaction/migration.sql](prisma/migrations/20260125165256_add_unique_constraints_to_prevent_duplicate_transaction/migration.sql).

### Transactions Workspace

- Core ledger UI is implemented in [app/(dashboard)/transactions/page.tsx](<app/(dashboard)/transactions/page.tsx>) with reusable grids in [components/web/TransactionTable.tsx](components/web/TransactionTable.tsx).
- Form flows reuse [app/(dashboard)/transactions/\_components/addTransactionForm.tsx](<app/(dashboard)/transactions/_components/addTransactionForm.tsx>) plus Zod schemas in [schemas/transaction.schema.ts](schemas/transaction.schema.ts) for type-safe validation.
- Screenshot above references this module; drop in your own asset under `public/screenshots/dashboard.png` if you’d like to customize the preview.

### AI Finance Copilot

- Chat surfaces reuse Vercel AI Elements across [components/ai-elements/conversation.tsx](components/ai-elements/conversation.tsx), [components/ai-elements/message.tsx](components/ai-elements/message.tsx), and [components/ai-elements/prompt-input.tsx](components/ai-elements/prompt-input.tsx).
- LangGraph orchestration runs through [lib/ai/graph/chat.graph.ts](lib/ai/graph/chat.graph.ts), [lib/ai/graph/memory.graph.ts](lib/ai/graph/memory.graph.ts), and routed nodes in [lib/ai/graph/nodes](lib/ai/graph/nodes).
- Gemini-hosted reasoning models are set up in [lib/gemini.ts](lib/gemini.ts) while domain-specific tools sit under [lib/ai/tools](lib/ai/tools). Conversational + long-term memory persists via [lib/ai/graph/memory/store.ts](lib/ai/graph/memory/store.ts) and Inngest workers in [inngest/functions/memory.ts](inngest/functions/memory.ts).

### Notifications & Safeguards

- Budget alert emails trigger off Inngest events and are delivered through **Nodemailer** (SMTP credentials in `.env`).
- Arcjet rules in [lib/arcjet.ts](lib/arcjet.ts) classify abusive traffic before it ever reaches sensitive routes such as [app/api/agent/route.ts](app/api/agent/route.ts).

## System Architecture

```mermaid
flowchart LR
    subgraph Client
        UI[Next.js + shadcn/ui]
        AIAgent[Vercel AI Elements]
    end

    subgraph Edge
        Clerk[(Clerk Auth & Billing)]
        Arcjet[(Arcjet Shield)]
    end

    subgraph App
        Actions[Server Actions]
        API[Route Handlers]
        LangGraph[LangGraph Orchestrator]
    end

    subgraph Data
        Prisma[(Prisma ORM)]
        Neon[(Neon PostgreSQL + pgvector)]
    end

    subgraph Workers
        Inngest[(Inngest Cron & Events)]
        Nodemailer[(Email Alerts)]
    end

    UI --> Clerk --> Actions
    AIAgent --> LangGraph --> Prisma
    Actions --> Prisma --> Neon
    API --> Arcjet --> Actions
    Inngest --> Prisma
    Inngest --> Nodemailer
    LangGraph --> Inngest
```

- **Type Safety Everywhere:** shared Zod schemas in [schemas](schemas) drive React Hook Form, server actions, and Prisma input types.
- **Vector Intelligence:** pgvector columns defined in [prisma/schema.prisma](prisma/schema.prisma) back RAG helpers in [data/accounts/rag.ts](data/accounts/rag.ts).
- **Event Sourcing:** Inngest orchestrates cron-style jobs (`transactionMonthlySummary`, `memory`) ensuring deterministic retries.
- **Edge Hardening:** Arcjet + Clerk secure ingress; Arcjet throttles bots, Clerk signs users + webhooks to sync premium status.

## Repository Guide

| Area                                             | Why it matters                                                                               |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| [app/(dashboard)](<app/(dashboard)>)             | App Router routes for authenticated experiences (accounts, budgets, recurrings, AI imports). |
| [components/ui](components/ui)                   | shadcn/ui primitives themed via `globals.css` and tokens for consistent UX.                  |
| [components/ai-elements](components/ai-elements) | Vercel AI Elements chat surfaces wired into LangGraph outputs.                               |
| [actions](actions)                               | Next.js Server Actions for mutations with optimistic UI + Prisma writes.                     |
| [data](data)                                     | Query/mutation helpers and export pipelines (CSV/Excel/PDF).                                 |
| [lib/ai](lib/ai)                                 | LangChain tools, Gemini drivers, LangGraph graphs, and memory stores.                        |
| [inngest/functions](inngest/functions)           | Event-driven jobs for recurring financial logic.                                             |
| [prisma/schema.prisma](prisma/schema.prisma)     | Database schema (accounts, transactions, pgvector embeddings, subscription metadata).        |
| [utils](utils)                                   | Cross-cutting helpers (recurrence math, time ranges, serialization, Clerk mappers).          |
| [config](config)                                 | Feature gating, plan ordering, and requirement enforcement.                                  |

## Getting Started

### Prerequisites

- Node.js 20+, pnpm 9+.
- Neon PostgreSQL database with the `pgvector` extension enabled.
- Clerk application (publishable + secret keys, billing & webhook URLs).
- Gemini + Google API keys, Arcjet key, Inngest event + signing keys.
- SMTP credentials for Nodemailer (SES, Resend, custom SMTP, etc.).

### Installation

1. `pnpm install`
2. `pnpm prisma generate`
3. Apply schema: `pnpm exec prisma migrate deploy`
4. Seed local data (optional): `pnpm seed`
5. Start dev server: `pnpm dev`
6. Run background workers (optional but recommended): `npx inngest-cli@latest dev --env-file=.env`

### Example `.env`

```dotenv
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
CLERK_WEBHOOK_SIGNING_SECRET=whsec_xxxxx
CLERK_BILLING_WEBHOOK_SIGNING_SECRET=whsec_xxxxx

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_APP_URL=http://localhost:3000

DATABASE_URL=postgresql://USER:PASSWORD@neon-host/db?sslmode=require
DIRECT_URL=postgresql://USER:PASSWORD@neon-host/db?sslmode=require

PGVECTOR_EXTENSION=pgvector
ARCJET_KEY=ajkey_xxxxx
INNGEST_EVENT_KEY=inngest_event_xxxxx
INNGEST_SIGNING_KEY=inngest_sign_xxxxx

GEMINI_API_KEY=AIzaSy...xxxx
GOOGLE_API_KEY=AIzaSy...xxxx

NODEMAILER_SMTP_HOST=smtp.gmail.com
NODEMAILER_SMTP_PORT=465
NODEMAILER_USER=alerts@spendix.app
NODEMAILER_PASS=app-specific-password
EMAIL_ALERT_FROM="Spendix Alerts <alerts@spendix.app>"
```

> ⚠️ Never commit secrets. Use `.env.local` for local dev and provider secrets for deployments.

### Useful Scripts

- `pnpm dev` – Next.js dev server with hot reload.
- `pnpm lint` – ESLint over the entire repo.
- `pnpm build` – Production build (detects type errors).
- `pnpm start` – Run the compiled app.
- `pnpm format` / `pnpm format:check` – Prettier helpers.

## Operational Notes

- **Bank Statement Imports:** CSV/XLS/PDF data is streamed via [data/exports](data/exports) utilities and reconciled against duplicates before Prisma writes.
- **Budget Alerts:** Budget thresholds (75%+, breach) trigger Inngest budget flows which then call Nodemailer to produce branded alerts.
- **AI Memory:** Inngest `memory` function consolidates agent recaps into pgvector embeddings so LangGraph can ground future conversations.
- **Bot Defense:** Arcjet rules run before API handlers to enforce rate limits and anomaly detection even on server actions.

## Roadmap

- Predictive cashflow forecasting and anomaly detection.
- Direct bank connections (Plaid, Teller, Belvo) feeding AI imports.
- Shared workspaces (family / teams) with scoped permissions.
- Tax-ready exports and advanced reporting packages.

## Author

**Pritam Maity — Full-Stack & AI Engineer**  
🔗 [https://sped-ix.app](https://spedix.app)

Always open to collaboration, code reviews, or deep dives into Spendix’s architecture—reach out!
