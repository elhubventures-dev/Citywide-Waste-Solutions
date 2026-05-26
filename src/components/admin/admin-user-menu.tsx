"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function AdminUserMenu() {
  const router = useRouter();

  async function handleSignOut() {
    await fetch("/api/admin/sign-out", { method: "POST" }).catch(() => undefined);
    router.replace("/sign-in");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleSignOut}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </div>
  );
}
