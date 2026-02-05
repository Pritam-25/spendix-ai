-- Spendix database schema DDL generated from prisma/schema.prisma
-- This script defines all supporting extensions, enum types, tables, and indexes.

BEGIN;

-- Extensions needed for UUID defaults and vector embeddings.
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS vector;

-- Enum definitions --------------------------------------------------------
CREATE TYPE plan_type AS ENUM ('FREE', 'PRO', 'PREMIUM');
CREATE TYPE transaction_type AS ENUM ('EXPENSE', 'INCOME');
CREATE TYPE subscription_status AS ENUM ('ACTIVE', 'PAST_DUE', 'CANCELED', 'TRIALING', 'ENDED', 'ABANDONED', 'INCOMPLETE', 'UPCOMING');
CREATE TYPE recurring_interval AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');
CREATE TYPE transaction_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED');
CREATE TYPE account_type AS ENUM ('CURRENT', 'SAVING');
CREATE TYPE payment_status AS ENUM ('PAID', 'FAILED', 'PENDING');
CREATE TYPE payment_type AS ENUM ('CHECKOUT', 'RECURRING');
CREATE TYPE import_job_status AS ENUM ('SCANNED', 'SAVED', 'FAILED');

-- Core tables -------------------------------------------------------------
CREATE TABLE users (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	clerk_user_id text NOT NULL,
	email text NOT NULL,
	first_name text,
	last_name text,
	image_url text,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE usage (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	ai_receipt_scans integer NOT NULL DEFAULT 0,
	ai_bulk_imports integer NOT NULL DEFAULT 0,
	period_start timestamptz NOT NULL,
	period_end timestamptz NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now(),
	user_id uuid NOT NULL,
	CONSTRAINT usage_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE "ImportJob" (
	id text NOT NULL,
	user_id uuid NOT NULL,
	account_id uuid,
	status import_job_status NOT NULL DEFAULT 'SCANNED',
	created_at timestamptz NOT NULL DEFAULT now(),
	error_msg text,
	usage_id uuid,
	CONSTRAINT import_job_pkey PRIMARY KEY (id, user_id),
	CONSTRAINT import_job_usage_id_fkey FOREIGN KEY (usage_id) REFERENCES usage(id) ON DELETE CASCADE
);

CREATE TABLE "Subscription" (
	id text PRIMARY KEY,
	user_id uuid NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	CONSTRAINT subscription_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE "SubscriptionItem" (
	id text PRIMARY KEY,
	user_id uuid NOT NULL,
	subscription_id text NOT NULL,
	plan_key text NOT NULL,
	plan_type plan_type NOT NULL,
	status subscription_status NOT NULL,
	period_start timestamptz,
	period_end timestamptz,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	CONSTRAINT subscription_item_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
	CONSTRAINT subscription_item_subscription_id_fkey FOREIGN KEY (subscription_id) REFERENCES "Subscription"(id) ON DELETE CASCADE
);

CREATE TABLE "Payment" (
	id text PRIMARY KEY,
	user_id uuid NOT NULL,
	status payment_status NOT NULL,
	type payment_type NOT NULL,
	amount integer,
	created_at timestamptz NOT NULL,
	CONSTRAINT payment_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE budgets (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	amount numeric NOT NULL,
	last_alert_sent timestamptz,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now(),
	user_id uuid NOT NULL,
	CONSTRAINT budgets_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE accounts (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	name text NOT NULL,
	type account_type NOT NULL,
	balance numeric NOT NULL DEFAULT 0,
	is_default boolean NOT NULL DEFAULT false,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now(),
	user_id uuid NOT NULL,
	CONSTRAINT accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE transactions (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	type transaction_type NOT NULL,
	amount numeric NOT NULL,
	description text,
	date timestamptz NOT NULL,
	category text NOT NULL,
	receipt_url text,
	is_recurring boolean NOT NULL DEFAULT false,
	recurring_interval recurring_interval,
	next_recurring_date timestamptz,
	last_processed timestamptz,
	status transaction_status NOT NULL DEFAULT 'COMPLETED',
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now(),
	user_id uuid NOT NULL,
	account_id uuid NOT NULL,
	CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
	CONSTRAINT transactions_account_id_fkey FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
);

CREATE TABLE account_transaction_rag (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id uuid NOT NULL,
	account_id uuid NOT NULL,
	content text NOT NULL,
	embedding vector(768) NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	CONSTRAINT account_transaction_rag_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
	CONSTRAINT account_transaction_rag_account_id_fkey FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
);

CREATE TABLE account_monthly_transaction_rag (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id uuid NOT NULL,
	account_id uuid NOT NULL,
	summary_month timestamptz NOT NULL,
	content text NOT NULL,
	embedding vector(768) NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	CONSTRAINT account_monthly_transaction_rag_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
	CONSTRAINT account_monthly_transaction_rag_account_id_fkey FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
);

-- Indexes & constraints ---------------------------------------------------
CREATE UNIQUE INDEX users_clerk_user_id_key ON users (clerk_user_id);
CREATE UNIQUE INDEX users_email_key ON users (email);
CREATE UNIQUE INDEX usage_user_id_key ON usage (user_id);
CREATE UNIQUE INDEX budgets_user_id_key ON budgets (user_id);
CREATE UNIQUE INDEX "Subscription_user_id_key" ON "Subscription" (user_id);
CREATE UNIQUE INDEX transactions_user_account_date_amount_description_key ON transactions (user_id, account_id, date, amount, description);
CREATE UNIQUE INDEX account_transaction_rag_user_account_key ON account_transaction_rag (user_id, account_id);
CREATE UNIQUE INDEX account_monthly_transaction_rag_user_account_month_key ON account_monthly_transaction_rag (user_id, account_id, summary_month);

CREATE INDEX "Subscription_user_id_idx" ON "Subscription" (user_id);
CREATE INDEX "SubscriptionItem_user_subscription_status_idx" ON "SubscriptionItem" (user_id, subscription_id, status);
CREATE INDEX "Payment_user_id_idx" ON "Payment" (user_id);
CREATE INDEX budgets_user_id_idx ON budgets (user_id);
CREATE INDEX accounts_user_id_idx ON accounts (user_id);
CREATE INDEX account_transaction_rag_user_account_idx ON account_transaction_rag (user_id, account_id);
CREATE INDEX account_monthly_transaction_rag_user_account_month_idx ON account_monthly_transaction_rag (user_id, account_id, summary_month);

COMMIT;
