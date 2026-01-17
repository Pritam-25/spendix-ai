import { Prisma } from "@prisma/client";

export function serialize<T extends Record<string, unknown>>(obj: T): T {
  const serialized: Record<string, unknown> = { ...obj };

  for (const key in serialized) {
    const value = serialized[key];

    if (value instanceof Prisma.Decimal) {
      serialized[key] = value.toNumber();
    }
  }

  return serialized as T;
}
