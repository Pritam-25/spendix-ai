export default function Page() {
  return (
    <main className="pt-30 flex items-center justify-center bg-background px-4">
      <section className="max-w-xl text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Spendix helps you stay on top of your money.
        </h1>
        <p className="text-muted-foreground text-lg">
          Track accounts, budgets, and transactions in one simple dashboard.
        </p>
        <div className="pt-2">
          <a
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
            href="/auth/sign-in"
          >
            Get started
          </a>
        </div>
      </section>
    </main>
  );
}
