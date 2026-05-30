import type { Metadata } from "next";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bell,
  Bot,
  BrainCircuit,
  CheckCircle2,
  CircuitBoard,
  CloudCog,
  Database,
  Layers3,
  LineChart,
  Lock,
  MessageSquareMore,
  PanelsTopLeft,
  ScanSearch,
  Server,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
  Workflow,
  Zap,
} from "lucide-react";

import getDefaultAccountDataForDashboard, {
  CategorySummary,
  getTopCategoriesForDashboard,
} from "@/lib/data/dashboard/queries";
import { KpiTimeRange } from "@/lib/utils/timerange";

import DashboardClient from "../dashboard/_components/DashboardClient";

export const metadata: Metadata = {
  title: "System Architecture",
  description:
    "A full-page architecture showcase for Spendix with live dashboard data, AI automation, ledger flow, and security layers.",
};

const architectureFlow = [
  {
    title: "User Requests",
    icon: Users,
    copy: "User actions, planning prompts, and finance questions enter the system.",
  },
  {
    title: "AI Import",
    icon: ScanSearch,
    copy: "Gemini extracts receipt, statement, and transaction context from files.",
  },
  {
    title: "Validation",
    icon: ShieldCheck,
    copy: "Arcjet, schema checks, and deduplication guard the ingestion path.",
  },
  {
    title: "Ledger",
    icon: Database,
    copy: "Prisma writes normalized transaction records to PostgreSQL.",
  },
  {
    title: "Memory",
    icon: Layers3,
    copy: "Vector embeddings preserve useful finance context for later retrieval.",
  },
  {
    title: "AI Copilot",
    icon: Bot,
    copy: "LangGraph orchestrates responses, suggestions, and next-step actions.",
  },
  {
    title: "Insights",
    icon: Bell,
    copy: "Budgets, charts, and notifications update from the same source of truth.",
  },
];

const techStack = [
  { title: "Next.js", icon: PanelsTopLeft },
  { title: "TypeScript", icon: CircuitBoard },
  { title: "Prisma", icon: Database },
  { title: "PostgreSQL", icon: Server },
  { title: "pgvector", icon: Layers3 },
  { title: "LangChain", icon: Workflow },
  { title: "LangGraph", icon: Activity },
  { title: "Gemini AI", icon: Sparkles },
  { title: "Inngest", icon: Zap },
  { title: "Arcjet", icon: ShieldCheck },
  { title: "Clerk", icon: Lock },
  { title: "Vercel", icon: CloudCog },
];

const featureCards = [
  {
    index: "01",
    title: "AI Receipt Scanner",
    bullets: ["Scan receipts with Gemini", "Auto-fill transaction details", "Reduce manual bookkeeping"],
    icon: ScanSearch,
  },
  {
    index: "02",
    title: "Recurring Payments",
    bullets: ["Scheduled billing flows", "Smart reminders", "Status-aware automation"],
    icon: Workflow,
  },
  {
    index: "03",
    title: "Budget Intelligence",
    bullets: ["Spending alerts", "Category health", "Budget pacing signals"],
    icon: LineChart,
  },
  {
    index: "04",
    title: "AI Finance Copilot",
    bullets: ["Ask natural-language questions", "Get personalized insights", "Surface next best actions"],
    icon: Bot,
  },
  {
    index: "05",
    title: "Security & Reliability",
    bullets: ["Rate limits", "Webhook sync", "Authentication and protection"],
    icon: ShieldCheck,
  },
  {
    index: "06",
    title: "Advanced Analytics",
    bullets: ["Trend charts", "Monthly reports", "Income vs expense tracking"],
    icon: BarChart3,
  },
];

const aiPrompts = [
  "How much did I spend on food this month?",
  "Show my biggest expenses",
  "What is my budget status?",
];

export default async function SystemArchitecturePage() {
  const data = await getDefaultAccountDataForDashboard(KpiTimeRange.THIS_MONTH);
  const { topExpenseCategories, topIncomeCategories } =
    await getTopCategoriesForDashboard(KpiTimeRange.THIS_MONTH);

  const categories: {
    topExpenseCategories: CategorySummary[];
    topIncomeCategories: CategorySummary[];
  } = {
    topExpenseCategories,
    topIncomeCategories,
  };

  return (
    <section className="relative w-full overflow-hidden text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent_24%),linear-gradient(180deg,rgba(3,7,18,1)_0%,rgba(3,17,12,1)_50%,rgba(2,6,23,1)_100%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1680px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="grid gap-6 xl:grid-cols-[1.05fr_1.75fr_0.9fr]">
          <div className="rounded-[32px] border border-emerald-400/20 bg-black/40 p-6 shadow-[0_0_0_1px_rgba(16,185,129,0.06),0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <div className="flex items-center gap-3 text-sm font-medium text-emerald-300">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-400/25 bg-emerald-400/10">
                <Sparkles className="h-5 w-5" />
              </span>
              Spendix System Design
            </div>

            <div className="mt-6 space-y-4">
              <p className="text-sm uppercase tracking-[0.35em] text-emerald-300/80">
                Full Architecture View
              </p>
              <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                AI-powered personal finance architecture, presented as a live product story.
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                This page combines your live dashboard component with the end-to-end system flow, security
                layers, automation, and analytics that power Spendix.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              {[
                "Smart expense tracking",
                "AI receipt scanner",
                "Recurring automation",
                "Budget intelligence",
                "Vector memory",
                "Real-time analytics",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-emerald-400/15 bg-white/5 px-4 py-3 text-sm text-slate-100 shadow-sm shadow-black/20"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-3xl border border-emerald-400/15 bg-emerald-400/5 p-4">
              <div className="flex items-center gap-3 text-sm font-medium text-emerald-200">
                <Wallet className="h-4 w-4" />
                Default account overview
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3 text-sm text-slate-300">
                <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
                  <div className="text-xs uppercase tracking-[0.25em] text-slate-400">Ledger</div>
                  <div className="mt-2 text-lg font-semibold text-white">Prisma</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
                  <div className="text-xs uppercase tracking-[0.25em] text-slate-400">Memory</div>
                  <div className="mt-2 text-lg font-semibold text-white">pgvector</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
                  <div className="text-xs uppercase tracking-[0.25em] text-slate-400">Automation</div>
                  <div className="mt-2 text-lg font-semibold text-white">Inngest</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-emerald-400/20 bg-black/35 p-4 shadow-[0_0_0_1px_rgba(16,185,129,0.05),0_30px_80px_rgba(0,0,0,0.48)] backdrop-blur-xl xl:min-h-[900px]">
            <div className="mb-4 flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-4 py-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-300/80">Dashboard</p>
                <h2 className="mt-1 text-xl font-semibold text-white">Live finance surface</h2>
              </div>
              <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
                Powered by your dashboard component
              </div>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(4,8,20,0.92),rgba(3,7,18,0.82))] p-3">
              <DashboardClient data={data} categories={categories} />
            </div>
          </div>

          <div className="rounded-[32px] border border-emerald-400/20 bg-black/40 p-5 shadow-[0_0_0_1px_rgba(16,185,129,0.05),0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <div className="rounded-[28px] border border-emerald-400/20 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.2),rgba(2,6,23,0.95)_58%)] p-5">
              <div className="flex items-center justify-between text-sm text-emerald-200">
                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 font-medium">
                  AI Finance Copilot
                </span>
                <span className="rounded-full border border-emerald-400/20 px-3 py-1 text-emerald-300/90">
                  BETA
                </span>
              </div>

              <div className="mt-6 flex items-center justify-center">
                <div className="relative flex h-36 w-36 items-center justify-center rounded-full border border-emerald-300/25 bg-emerald-400/5 shadow-[0_0_60px_rgba(74,222,128,0.24)]">
                  <div className="absolute inset-2 rounded-full border border-emerald-300/20" />
                  <div className="absolute inset-6 rounded-full border border-emerald-300/30 bg-emerald-300/10 blur-sm" />
                  <Bot className="relative h-14 w-14 text-emerald-200" />
                </div>
              </div>

              <div className="mt-6 space-y-2 text-center">
                <p className="text-lg font-medium text-white">Hi there, let&apos;s understand your money.</p>
                <p className="text-sm leading-6 text-slate-300">
                  Ask for spending summaries, budget health, or the next best action across your accounts.
                </p>
              </div>

              <div className="mt-5 space-y-3">
                {aiPrompts.map((prompt) => (
                  <div
                    key={prompt}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-slate-100"
                  >
                    <MessageSquareMore className="h-4 w-4 text-emerald-300" />
                    <span>{prompt}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-slate-400">
                Ask anything about your finance...
              </div>
            </div>

            <div className="mt-5 rounded-[28px] border border-emerald-400/15 bg-white/5 p-4">
              <div className="flex items-center gap-3 text-sm font-medium text-emerald-200">
                <Activity className="h-4 w-4" />
                Runtime signals
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                {[
                  "Arcjet protects public endpoints and AI traffic.",
                  "Clerk handles identity for authenticated dashboard routes.",
                  "Inngest jobs keep the ledger and summaries synchronized.",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/25 p-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_1.8fr_0.9fr]">
          <div className="rounded-[28px] border border-emerald-400/20 bg-black/40 p-5 shadow-[0_0_0_1px_rgba(16,185,129,0.05)] backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-300/80">Tech Stack</p>
                <h3 className="mt-1 text-lg font-semibold text-white">Foundation layers</h3>
              </div>
              <PanelsTopLeft className="h-5 w-5 text-emerald-300" />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {techStack.map(({ title, icon: Icon }) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-slate-200">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-emerald-300" />
                    <span>{title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-emerald-400/20 bg-black/40 p-5 shadow-[0_0_0_1px_rgba(16,185,129,0.05)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-300/80">Architecture Flow</p>
                <h3 className="mt-1 text-lg font-semibold text-white">From prompt to insight</h3>
              </div>
              <Workflow className="h-5 w-5 text-emerald-300" />
            </div>

            <div className="mt-5 flex flex-wrap items-stretch gap-3">
              {architectureFlow.map((step, index) => {
                const Icon = step.icon;

                return (
                  <div key={step.title} className="flex min-w-[170px] flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-200">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-white">{step.title}</div>
                      <div className="mt-1 text-xs leading-5 text-slate-400">{step.copy}</div>
                    </div>
                    {index < architectureFlow.length - 1 ? <ArrowRight className="hidden h-4 w-4 text-emerald-300 xl:block" /> : null}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[28px] border border-emerald-400/20 bg-black/40 p-5 shadow-[0_0_0_1px_rgba(16,185,129,0.05)] backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-300/80">Signals</p>
                <h3 className="mt-1 text-lg font-semibold text-white">Operational health</h3>
              </div>
              <Activity className="h-5 w-5 text-emerald-300" />
            </div>

            <div className="mt-5 space-y-3 text-sm text-slate-300">
              {[
                ["Income processing", "+12.5%", "up"],
                ["Expense detection", "-4.1%", "down"],
                ["Budget usage", "72%", "steady"],
                ["Sync latency", "< 1s", "healthy"],
              ].map(([label, value, tone]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-black/25 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span>{label}</span>
                    <span className={tone === "down" ? "text-rose-300" : "text-emerald-300"}>{value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {featureCards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.title}
                className="group rounded-[28px] border border-emerald-400/20 bg-black/35 p-5 shadow-[0_0_0_1px_rgba(16,185,129,0.05)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300/80">{card.index}</p>
                    <h3 className="mt-2 text-lg font-semibold text-white">{card.title}</h3>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-200">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <ul className="mt-4 space-y-2 text-sm text-slate-300">
                  {card.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-300" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
          <div className="rounded-[28px] border border-emerald-400/20 bg-black/40 p-5 shadow-[0_0_0_1px_rgba(16,185,129,0.05)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-300/80">How it works</p>
                <h3 className="mt-1 text-lg font-semibold text-white">System principles</h3>
              </div>
              <BrainCircuit className="h-5 w-5 text-emerald-300" />
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Vector-powered memory",
                  copy: "Stash previous finance context for richer retrieval and more personal answers.",
                },
                {
                  title: "Event-driven workflows",
                  copy: "Inngest handles ingestion, summary generation, and follow-up automation.",
                },
                {
                  title: "Built for performance",
                  copy: "Fast reads, guarded writes, and small response payloads keep the UX responsive.",
                },
                {
                  title: "Security first",
                  copy: "Arcjet, Clerk, and webhook verification keep sensitive finance flows protected.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-medium text-white">{item.title}</div>
                  <div className="mt-2 text-sm leading-6 text-slate-300">{item.copy}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-emerald-400/20 bg-black/40 p-5 shadow-[0_0_0_1px_rgba(16,185,129,0.05)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-300/80">Health Check</p>
                <h3 className="mt-1 text-lg font-semibold text-white">Compliance and runtime</h3>
              </div>
              <ShieldCheck className="h-5 w-5 text-emerald-300" />
            </div>

            <div className="mt-5 space-y-3">
              {[
                "Authentication enforced for private finance routes.",
                "Rate limits reduce abuse on AI and webhook endpoints.",
                "Mutations are validated before they touch the ledger.",
                "Summary jobs run independently from the UI thread.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/25 p-3 text-sm text-slate-300">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">
              <div className="font-medium">Live status</div>
              <div className="mt-1 text-emerald-200/85">
                The dashboard and architecture views pull from the same authenticated account data.
              </div>
            </div>
          </div>
        </div>

        <footer className="rounded-[28px] border border-emerald-400/15 bg-black/45 px-5 py-4 text-sm text-slate-300 shadow-[0_0_0_1px_rgba(16,185,129,0.04)] backdrop-blur-xl">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-emerald-200">
                Spendix architecture
              </span>
              <span>Live dashboard, AI import, ledger, and insights all in one view.</span>
            </div>
            <a href="/dashboard" className="inline-flex items-center gap-2 text-emerald-300 transition-colors hover:text-emerald-200">
              Back to dashboard
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </footer>
      </div>
    </section>
  );
}