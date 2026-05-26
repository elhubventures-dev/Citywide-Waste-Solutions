import { SignIn } from "@clerk/nextjs";
import { isClerkConfigured } from "@/lib/auth";

export default function SignInPage() {
  if (!isClerkConfigured()) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
        <div className="max-w-md rounded-2xl border border-border bg-card p-6 text-center shadow-card">
          <h1 className="text-xl font-bold text-foreground">Admin sign-in is not configured</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Add valid Clerk keys to the environment to enable secure admin access.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/admin/dashboard"
      />
    </main>
  );
}
