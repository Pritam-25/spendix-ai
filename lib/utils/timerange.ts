export enum KpiTimeRange {
  THIS_WEEK = "THIS_WEEK",
  THIS_MONTH = "THIS_MONTH",
  THIS_YEAR = "THIS_YEAR",
  ALL_TIME = "ALL_TIME",
}

export function getKpiDateRange(timeRange: KpiTimeRange) {
  // Current timestamp – used as the upper bound for all KPI ranges
  const now = new Date();

  switch (timeRange) {
    case KpiTimeRange.THIS_WEEK: {
      /**
       * "This Week" KPI logic
       *
       * Finance apps typically treat Monday as the start of the week.
       * JS Date.getDay():
       *   0 = Sunday
       *   1 = Monday
       *   ...
       *   6 = Saturday
       *
       * If today is Sunday (0), we go back 6 days to reach Monday.
       * Otherwise, we go back (day - 1) days.
       */
      const day = now.getDay();
      const diff = day === 0 ? -6 : 1 - day;

      // Start of the current week (Monday, 00:00:00.000)
      const start = new Date(now);
      start.setDate(now.getDate() + diff);
      start.setHours(0, 0, 0, 0);

      // KPI range: Monday → current moment
      return { gte: start, lte: now };
    }

    case KpiTimeRange.THIS_MONTH: {
      /**
       * "This Month" KPI logic
       *
       * Uses calendar month boundaries:
       *   - Start: 1st day of the current month at 00:00
       *   - End: current moment
       *
       * This aligns with budgeting and monthly spending expectations.
       */
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      start.setHours(0, 0, 0, 0);

      return { gte: start, lte: now };
    }

    case KpiTimeRange.THIS_YEAR: {
      /**
       * "This Year" KPI logic
       *
       * Uses calendar year boundaries:
       *   - Start: January 1st of the current year at 00:00
       *   - End: current moment
       *
       * Commonly used for yearly summaries and tax-related metrics.
       */
      const start = new Date(now.getFullYear(), 0, 1);
      start.setHours(0, 0, 0, 0);

      return { gte: start, lte: now };
    }

    case KpiTimeRange.ALL_TIME:
    default:
      /**
       * "All Time" KPI logic
       *
       * No date filtering is applied.
       * The database query will return data from the first transaction onward.
       */
      return undefined;
  }
}
