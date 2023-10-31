const JWT_ACCESS_SECRET: string | undefined = process.env.JWT_ACCESS_SECRET!;
const JWT_REFRESH_SECRET: string | undefined = process.env.JWT_REFRESH_SECRET!;

export function getJwtAccessSecretKey(): string {
  if (!JWT_ACCESS_SECRET || JWT_ACCESS_SECRET.length === 0) {
    throw new Error("The environment variable JWT_ACCESS_SECRET is not set.");
  }

  return JWT_ACCESS_SECRET;
}

export function getJwtRefreshSecretKey(): string {
  if (!JWT_REFRESH_SECRET || JWT_REFRESH_SECRET.length === 0) {
    throw new Error("The environment variable JWT_REFRESH_SECRET is not set.");
  }

  return JWT_REFRESH_SECRET;
}
