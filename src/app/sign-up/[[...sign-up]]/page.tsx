import { SignUp } from "@clerk/nextjs";
import { isClerkConfigured } from "@/lib/auth";

export default function SignUpPage() {
  if (!isClerkConfigured()) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
        <div className="max-w-md rounded-2xl border border-border bg-card p-6 text-center shadow-card">
          <h1 className="text-xl font-bold text-foreground">Admin sign-up is not configured</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Add valid Clerk keys to the environment to enable admin account creation.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        fallbackRedirectUrl="/admin/dashboard"
      />
    </main>
  );
}
