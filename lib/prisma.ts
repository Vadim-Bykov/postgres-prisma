import { PrismaClient } from "@prisma/client";
import { withOptimize } from "@prisma/extension-optimize";

declare global {
  var prisma: PrismaClient | undefined;
}

let prisma;

if (process.env.NODE_ENV !== "development") {
  prisma = new PrismaClient();
} else {
  prisma = new PrismaClient().$extends(
    withOptimize({
      apiKey:
        "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJ3aWQiOiJjbHVjczhsZTUwMGZuMWMwdmJkOXFjbzM0IiwidWlkIjoiY2x1Y3M4a3NkMDBmajFjMHY3aXNsbnRiOSIsInRzIjoxNzI2MTMwNzE2NjM1fQ.c_erDaLNR0OhsWG4tOiDnZZaObN3Pq7MO6VQ1gvrT9CE1SLRM710ZObXE4N4bdXbhP5AOTDRUENORv9ks5U9AA",
    })
  );
}

// @ts-ignore
if (process.env.NODE_ENV === "development") global.prisma = prisma;

export default prisma as PrismaClient;
