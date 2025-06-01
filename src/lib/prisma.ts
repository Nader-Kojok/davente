// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.NODE_ENV === 'development' 
          ? `${process.env.DATABASE_URL}?pgbouncer=true&connection_limit=5&pool_timeout=20&connect_timeout=10`
          : `${process.env.DATABASE_URL}?pgbouncer=true&connection_limit=10&pool_timeout=20`,
      },
    },
    errorFormat: 'minimal',
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
