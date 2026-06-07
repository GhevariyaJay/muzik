import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prismaInstance: PrismaClient;

if (typeof window === "undefined" && connectionString) {
  // Use custom adapter in server environments with a DB URL
  const adapter = new PrismaPg({ connectionString });
  prismaInstance = globalForPrisma.prisma ?? new PrismaClient({ adapter });
} else {
  // Fallback for build-time or other environments
  prismaInstance = globalForPrisma.prisma ?? new PrismaClient();
}

export const prismaClient = prismaInstance;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prismaClient;