import Link from "next/link";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="max-w-md rounded-2xl border border-border bg-card p-6 text-center shadow-card">
        <h1 className="text-xl font-bold text-foreground">Admin sign-up is disabled</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Create or invite admin users from the Supabase dashboard, then sign in with the approved
          admin email.
        </p>
        <Link
          href="/sign-in"
          className="mt-5 inline-flex rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700"
        >
          Back to Sign In
        </Link>
      </div>
    </main>
  );
}
