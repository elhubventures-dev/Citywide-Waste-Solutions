import { requireAdminPageAccess } from "@/lib/admin-auth";
import AdminLayoutShell from "@/components/admin/layout/admin-layout-shell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminPageAccess();

  return (
    <AdminLayoutShell>
      {children}
    </AdminLayoutShell>
  );
}
