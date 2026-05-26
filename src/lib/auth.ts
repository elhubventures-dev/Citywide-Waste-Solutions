export const DEFAULT_ADMIN_EMAIL = "wastesolutions80@gmail.com";

export function isClerkConfigured() {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const secretKey = process.env.CLERK_SECRET_KEY;

  return Boolean(
    publishableKey &&
    secretKey &&
    publishableKey.startsWith("pk_") &&
    secretKey.startsWith("sk_") &&
    !publishableKey.includes("...") &&
    !secretKey.includes("...") &&
    publishableKey.length > 20 &&
    secretKey.length > 20
  );
}

export function getAdminEmails() {
  return new Set(
    [DEFAULT_ADMIN_EMAIL, ...(process.env.ADMIN_EMAILS ?? "").split(",")]
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  );
}

export function isAdminEmail(email: string | null | undefined) {
  return Boolean(email && getAdminEmails().has(email.toLowerCase()));
}
