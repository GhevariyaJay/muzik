import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Lazy initialization using a Proxy to prevent crashes during Next.js build-time static analysis
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop, receiver) {
    if (!globalForPrisma.prisma) {
      if (typeof window !== "undefined") {
        globalForPrisma.prisma = new PrismaClient();
      } else if (connectionString) {
        const adapter = new PrismaPg({ connectionString });
        globalForPrisma.prisma = new PrismaClient({ adapter });
      } else {
        // Only throw error if someone ACTUALLY tries to use the DB without a URL
        throw new Error(
          "PrismaClient could not be initialized: DATABASE_URL is missing. Check your environment variables."
        );
      }
    }
    return Reflect.get(globalForPrisma.prisma, prop, receiver);
  },
});

if (process.env.NODE_ENV !== "production") {
  // Persistence for development HMR
}