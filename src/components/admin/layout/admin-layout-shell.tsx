"use client";

import React from "react";
import { SidebarProvider, useSidebar } from "./sidebar-context";
import AdminSidebar from "./admin-sidebar";
import AdminHeader from "./admin-header";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  
  // Calculate the left margin based on sidebar state
  // On mobile (lg and below), it's always 0 because sidebar is off-canvas
  // On desktop, it matches the sidebar width
  const sidebarWidth = isExpanded || isHovered || isMobileOpen ? "lg:ml-[290px]" : "lg:ml-[90px]";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      <AdminSidebar />
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${sidebarWidth}`}>
        <AdminHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
}
