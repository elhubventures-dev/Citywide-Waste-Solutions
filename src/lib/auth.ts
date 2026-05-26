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

export function isSupabaseAuthConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return Boolean(
    hasUsableValue(url) &&
    hasUsableValue(anonKey) &&
    /^https?:\/\//.test(url) &&
    anonKey.length > 20
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
