import { Environment } from "@prisma/client";

const ENV: Environment | undefined = process.env.VERCEL_ENV! as Environment;

export function getEnvironment(): Environment {
  if (!ENV || ENV.length === 0) {
    throw new Error("The environment variable ENV is not set.");
  }

  return ENV;
}

/**
 * Emails that get the ADMIN role on registration. Comes from the
 * comma-separated `ADMIN_EMAILS` env var; empty or unset means no admins
 * are assigned automatically.
 */
export function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter((email) => email.length > 0);
}

export function isAdminEmail(email: string): boolean {
  return getAdminEmails().includes(email.trim().toLowerCase());
}
