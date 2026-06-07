import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prismaInstance: PrismaClient;

if (typeof window === "undefined") {
  if (connectionString) {
    const adapter = new PrismaPg({ connectionString });
    prismaInstance = globalForPrisma.prisma ?? new PrismaClient({ adapter });
  } else {
    // If no DATABASE_URL, do not attempt to use an adapter
    prismaInstance = globalForPrisma.prisma ?? new PrismaClient();
  }
} else {
  // Browser fallback
  prismaInstance = globalForPrisma.prisma ?? new PrismaClient();
}

export const prisma = prismaInstance;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}