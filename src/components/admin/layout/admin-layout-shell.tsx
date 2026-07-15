"use client";

import React from "react";
import { SidebarProvider, useSidebar } from "./sidebar-context";
import AdminSidebar from "./admin-sidebar";
import AdminHeader from "./admin-header";
import AdminBottomNav from "./admin-bottom-nav";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  
  // Calculate the left margin based on sidebar state
  // On mobile (lg and below), it's always 0 because sidebar is off-canvas
  // On desktop, it matches the sidebar width
  const sidebarWidth = isExpanded || isHovered || isMobileOpen ? "lg:ml-[290px]" : "lg:ml-[90px]";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex text-gray-800 dark:text-white/90">
      <AdminSidebar />
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${sidebarWidth}`}>
        <AdminHeader />
        <main className="flex-1 p-4 md:p-6 2xl:p-10 mx-auto w-full max-w-screen-2xl pb-24 lg:pb-10">
          {children}
        </main>
      </div>
      <AdminBottomNav />
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
