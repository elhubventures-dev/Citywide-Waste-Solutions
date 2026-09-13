export const DEFAULT_ADMIN_EMAIL = "wastesolutions80@gmail.com";

function hasUsableValue(value: string | undefined): value is string {
  return Boolean(
    value &&
      !value.includes("...") &&
      !value.includes("[") &&
      !value.toLowerCase().includes("placeholder") &&
      !value.toLowerCase().startsWith("your_") &&
      !value.toLowerCase().startsWith("your-")
  );
}

export function getAuthSecret() {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  return hasUsableValue(secret) && secret.length >= 16 ? secret : null;
}

export function isAuthConfigured() {
  return Boolean(getAuthSecret());
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
