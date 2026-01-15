import { Prisma } from "@prisma/client";

export function serialize<T extends Record<string, any>>(obj: T) {
  const serialized: any = { ...obj };

  for (const key in serialized) {
    const value = serialized[key];

    if (value instanceof Prisma.Decimal) {
      serialized[key] = value.toNumber();
    }
  }

  return serialized;
}
