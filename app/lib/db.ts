import { prisma } from "./prisma";

// Re-export as prismaClient to avoid breaking existing imports in the API routes
export const prismaClient = prisma;
