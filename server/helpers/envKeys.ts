import { Environment } from "@prisma/client";

const ENV: Environment | undefined = process.env.VERCEL_ENV! as Environment;

export function getEnvironment(): Environment {
  if (!ENV || ENV.length === 0) {
    throw new Error("The environment variable ENV is not set.");
  }

  return ENV;
}
