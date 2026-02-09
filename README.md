<div align="center">

# Spendix — AI-Powered Personal Finance Management platform

AI powered personal finance management platform to track accounts, income, and expenses in one place, with transaction management, automated recurring payments, monthly budgets, spending dashboards, and a personal AI assistant for personalized, real-time insights based on user financial data.


<a href="https://sped-ix.app" target="_blank" style="text-decoration:none;">
  <button style="
    display:inline-flex;
    align-items:center;
    gap:8px;
    padding:10px 16px;
    background:#22c55e;
    color:#ffffff;
    border:none;
    border-radius:8px;
    font-weight:600;
    cursor:pointer;
  ">
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
      viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z"/>
    </svg>
    Live Demo
  </button>
</a>



</div>


## Visual Tour

Explore key Spendix surfaces directly in the README. Drag horizontally (or swipe on touch) to advance the slideshow.

<div align="center">
    <div style="display:flex; gap:16px; overflow-x:auto; scroll-snap-type:x mandatory; padding:16px; border:1px solid #e5e7eb; border-radius:16px; background:rgba(15,23,42,0.04);">
        <img src="docs/landing-page.png" alt="Spendix marketing homepage" style="height:360px; border-radius:12px; flex:0 0 auto; scroll-snap-align:center; box-shadow:0 12px 24px rgba(15,23,42,0.25);" />
        <img src="docs/dashboard-page.png" alt="Spendix dashboard view" style="height:360px; border-radius:12px; flex:0 0 auto; scroll-snap-align:center; box-shadow:0 12px 24px rgba(15,23,42,0.25);" />
        <img src="docs/accounts-page.png" alt="Accounts overview" style="height:360px; border-radius:12px; flex:0 0 auto; scroll-snap-align:center; box-shadow:0 12px 24px rgba(15,23,42,0.25);" />
        <img src="docs/account-id-page.png" alt="Account detail drill-down" style="height:360px; border-radius:12px; flex:0 0 auto; scroll-snap-align:center; box-shadow:0 12px 24px rgba(15,23,42,0.25);" />
        <img src="docs/ai-imports-page.png" alt="AI imports workspace" style="height:360px; border-radius:12px; flex:0 0 auto; scroll-snap-align:center; box-shadow:0 12px 24px rgba(15,23,42,0.25);" />
        <img src="docs/budget-page.png" alt="Budget insights" style="height:360px; border-radius:12px; flex:0 0 auto; scroll-snap-align:center; box-shadow:0 12px 24px rgba(15,23,42,0.25);" />
        <img src="docs/recurring-page.png" alt="Recurring transaction planner" style="height:360px; border-radius:12px; flex:0 0 auto; scroll-snap-align:center; box-shadow:0 12px 24px rgba(15,23,42,0.25);" />
        <img src="docs/user-porfile-page.png" alt="User profile and entitlements" style="height:360px; border-radius:12px; flex:0 0 auto; scroll-snap-align:center; box-shadow:0 12px 24px rgba(15,23,42,0.25);" />
    </div>
    <sub>Tip: drag sideways on desktop or swipe on mobile to cycle through each view.</sub>
</div>

### Schema Overview

<p align="center">
    <img src="docs/schema.png" alt="Spendix relational schema" width="880" style="border-radius:12px; box-shadow:0 16px 32px rgba(15,23,42,0.2);" />
    <br />
    <sub>Entity relationships powering accounts, budgets, AI memory, and plan entitlements.</sub>
</p>

## Stack Signals

<div style="display:flex; justify-content:center; width:100%;">
  <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:18px; width:100%; max-width:1080px; margin:0 auto; padding:12px 0;">
    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:18px; padding:16px; text-align:center; display:flex; flex-direction:column; align-items:center; gap:8px; box-shadow:0 8px 20px rgba(15,23,42,0.08);">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" alt="Next.js" height="44" style="padding:8px; background:#ffffff; border-radius:12px;" />
        <div><strong>Next.js 16</strong></div>
        <sub>App Router + Server Actions</sub>
    </div>
    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:18px; padding:16px; text-align:center; display:flex; flex-direction:column; align-items:center; gap:8px; box-shadow:0 8px 20px rgba(15,23,42,0.08);">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" alt="TypeScript" height="44" />
        <div><strong>TypeScript</strong></div>
        <sub>Type-safe finance primitives</sub>
    </div>
    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:18px; padding:16px; text-align:center; display:flex; flex-direction:column; align-items:center; gap:8px; box-shadow:0 8px 20px rgba(15,23,42,0.08);">
        <img src="https://avatars.githubusercontent.com/u/139895814?s=200&v=4" alt="shadcn" height="44" style="border-radius:12px;" />
        <div><strong>shadcn/ui</strong></div>
        <sub>Composable design system</sub>
    </div>
    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:18px; padding:16px; text-align:center; display:flex; flex-direction:column; align-items:center; gap:8px; box-shadow:0 8px 20px rgba(15,23,42,0.08);">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" alt="CSS" height="44" />
        <div><strong>Tailored CSS</strong></div>
        <sub>Tokenized theming</sub>
    </div>
    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:18px; padding:16px; text-align:center; display:flex; flex-direction:column; align-items:center; gap:8px; box-shadow:0 8px 20px rgba(15,23,42,0.08);">
        <img src="https://raw.githubusercontent.com/colinhacks/zod/master/logo.svg" alt="Zod" height="44" />
        <div><strong>Zod</strong></div>
        <sub>Validation + inference</sub>
    </div>
    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:18px; padding:16px; text-align:center; display:flex; flex-direction:column; align-items:center; gap:8px; box-shadow:0 8px 20px rgba(15,23,42,0.08);">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg" alt="Prisma" height="44" />
        <div><strong>Prisma</strong></div>
        <sub>Typed ORM</sub>
    </div>
    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:18px; padding:16px; text-align:center; display:flex; flex-direction:column; align-items:center; gap:8px; box-shadow:0 8px 20px rgba(15,23,42,0.08);">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" alt="Neon" height="44" />
        <div><strong>Neon + pgvector</strong></div>
        <sub>Vectorized storage</sub>
    </div>
    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:18px; padding:16px; text-align:center; display:flex; flex-direction:column; align-items:center; gap:8px; box-shadow:0 8px 20px rgba(15,23,42,0.08);">
        <img src="docs/icons/langgraph-color.svg" alt="LangChain" height="44" />
        <div><strong>LangChain / LangGraph</strong></div>
        <sub>Agent routing</sub>
    </div>
    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:18px; padding:16px; text-align:center; display:flex; flex-direction:column; align-items:center; gap:8px; box-shadow:0 8px 20px rgba(15,23,42,0.08);">
        <img src="https://cdn.brandfetch.io/idDpCfN4VD/w/400/h/400/theme/dark/icon.png?c=1bxid64Mup7aczewSAYMX&t=1759982772575" alt="Vercel AI" height="44" style="border-radius:12px;" />
        <div><strong>Vercel AI SDK</strong></div>
        <sub>Chat UX surface</sub>
    </div>
    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:18px; padding:16px; text-align:center; display:flex; flex-direction:column; align-items:center; gap:8px; box-shadow:0 8px 20px rgba(15,23,42,0.08);">
        <img src="docs/icons/gemini-color.svg" alt="Gemini" height="44" />
        <div><strong>Gemini</strong></div>
        <sub>Reasoning models</sub>
    </div>
    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:18px; padding:16px; text-align:center; display:flex; flex-direction:column; align-items:center; gap:8px; box-shadow:0 8px 20px rgba(15,23,42,0.08);">
        <img src="https://cdn.brandfetch.io/idK0lowSpn/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1765345250251" alt="Inngest" height="44" />
        <div><strong>Inngest</strong></div>
        <sub>Deterministic automations</sub>
    </div>
    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:18px; padding:16px; text-align:center; display:flex; flex-direction:column; align-items:center; gap:8px; box-shadow:0 8px 20px rgba(15,23,42,0.08);">
        <img src="https://cdn.brandfetch.io/idwI9Qq-AB/w/128/h/129/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1766936314312" alt="Arcjet" height="44" style="border-radius:12px; background:#ffffff;" />
        <div><strong>Arcjet</strong></div>
        <sub>Bot defense + rate limits</sub>
    </div>
  </div>
</div>

## Product Pillars

- **Unified Ledger Control** — Multi-account books, high-fidelity CRUD, and tight reconciliation keep every inflow/outflow auditable.
- **AI-Assisted Imports** — Gemini-powered parsing plus human-in-the-loop review accelerate bulk bank statement ingestion.
- **Recurring Cashflow Engine** — Deterministic schedulers project subscriptions, loans, and bills into actionable calendars.
- **Budget Intelligence** — Envelope-style tracking, alert thresholds, and visualizations surface overspend before it escalates.
- **Finance Copilot** — Conversational agents grounded in private vector memory translate intents into secure actions.
- **Governed Access** — Plan-aware UX, entitlement gating, and webhook-synced billing data keep monetization trustworthy.

## Feature Spotlight

### Subscription Intelligence

**Plan graphs**, **feature matrices**, and **plan-order logic** ensure every surface knows what a member can access. Clerk webhooks synchronize lifecycle events, while experience toggles automatically hide, disable, or upsell premium affordances.

### Recurring Transactions Engine

**Recurrence schemas** encode daily to custom cadences, while Inngest orchestrators expand those rules into dated invoices, autopay reminders, and monthly summaries. Optimistic UI states keep editing silky even before workers confirm the schedule.

### AI Imports & Bulk Bank Statements

A dedicated **AI imports workspace** combines drag-and-drop uploads, Gemini extraction, and LangChain tooling to normalize CSV, XLS, or PDF statements. **Duplicate guards** and semantic similarity checks protect the ledger before final commit.

### Transactions Workspace

The **core ledger canvas** features rapid filters, inline edits, and a transaction drawer tuned for keyboard-first workflows. Zod-backed forms guarantee category, amount, and metadata integrity while delivering real-time totals and context chips.

### AI Finance Copilot

**Vercel AI Elements** drive a conversational surface that blends short-term context with long-term embeddings. LangGraph routes between analysis, insight, and action nodes so Spendix can summarize budgets, draft next steps, or queue transactions just by chatting.

### Safeguards & Notifications

**Arcjet threat intelligence** filters abusive clients before API or server actions execute, while **Nodemailer alerts** broadcast budget breaches or anomaly pings with branded templates. Every sensitive route stays wrapped in authenticated, rate-limited handlers.

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

- **Type Safety Everywhere** — Shared schemas span forms, server actions, and persistence layers.
- **Vector Intelligence** — pgvector-backed memory ensures AI answers are grounded in first-party data.
- **Event Sourcing** — Inngest flows provide durable retries and idempotent ledger mutations.
- **Edge Hardening** — Clerk verifies identity, Arcjet throttles anomalies, and secret rotation keeps ingress secure.



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
3. `pnpm exec prisma migrate deploy`
4. (Optional) `pnpm seed`
5. `pnpm dev`
6. (Optional) `npx inngest-cli@latest dev --env-file=.env`

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



### Useful Scripts

- `pnpm dev` — Next.js dev server with hot reload.
- `pnpm lint` — ESLint across the monorepo.
- `pnpm build` — Production bundle with type checks.
- `pnpm start` — Launch compiled output.
- `pnpm format` / `pnpm format:check` — Prettier helpers.

## Operational Notes

- **Bank Statement Imports** deduplicate by account, institution, amount, and timestamp windows before persisting.
- **Budget Alerts** evaluate soft (75%) and hard (100%+) thresholds with context-specific advice in every email.
- **AI Memory** batches LangGraph recaps so embeddings stay fresh and storage lean.
- **Bot Defense** leans on Arcjet fingerprints, rate ceilings, and challenge flows to protect APIs and server actions.

## Roadmap

- Predictive cashflow forecasting and anomaly detection.
- Direct bank connections (Plaid, Teller, Belvo) feeding AI imports.
- Shared workspaces (family / teams) with scoped permissions.
- Tax-ready exports and advanced reporting packages.

## Author

**Pritam Maity — Full-Stack & AI Engineer**  
🔗 [https://sped-ix.app](https://spedix.app)

Always open to collaboration, code reviews, or deep dives into Spendix’s architecture—reach out!
