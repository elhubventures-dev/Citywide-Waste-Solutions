"use client";
import React, { useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "./sidebar-context";
import { LayoutDashboard, FileText, Mail, ChevronLeft } from "lucide-react";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
};

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    path: "/admin/dashboard",
  },
  {
    name: "Invoices",
    icon: <FileText className="w-5 h-5" />,
    path: "/admin/invoices",
  },
  {
    name: "Submissions",
    icon: <Mail className="w-5 h-5" />,
    path: "/admin/submissions",
  },
];

export default function AdminSidebar() {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, toggleMobileSidebar } = useSidebar();
  const pathname = usePathname();

  const isActive = useCallback((path: string) => pathname.startsWith(path), [pathname]);

  const sidebarWidth = isExpanded || isMobileOpen || isHovered ? "w-[290px]" : "w-[90px]";
  const mobileTransform = isMobileOpen ? "translate-x-0" : "-translate-x-full";

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      <aside
        className={`fixed flex flex-col top-0 left-0 bg-white dark:bg-slate-900 dark:border-slate-800 text-slate-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-slate-200 ${sidebarWidth} ${mobileTransform} lg:translate-x-0`}
        onMouseEnter={() => !isExpanded && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`py-8 px-5 flex items-center h-[90px] ${(!isExpanded && !isHovered) ? "justify-center" : "justify-between"}`}>
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="relative h-8 w-auto min-w-8">
              <Image 
                src="/images/logos/logo-header.png" 
                alt="Citywide Waste Solutions"
                width={120}
                height={32}
                className={`h-8 w-auto object-contain dark:hidden ${!isExpanded && !isHovered && !isMobileOpen ? "hidden" : ""}`}
                priority
              />
              <Image 
                src="/images/logos/logo-dark.png" 
                alt="Citywide Waste Solutions"
                width={120}
                height={32}
                className={`hidden h-8 w-auto object-contain dark:block ${!isExpanded && !isHovered && !isMobileOpen ? "dark:hidden" : ""}`}
                priority
              />
              {(!isExpanded && !isHovered && !isMobileOpen) && (
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-xl leading-none">C</span>
                </div>
              )}
            </div>
          </Link>

          {/* Close button for mobile */}
          {isMobileOpen && (
            <button onClick={toggleMobileSidebar} className="lg:hidden text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
        </div>

        <div className="flex flex-col flex-1 overflow-y-auto px-5 no-scrollbar pb-8">
          <nav className="mt-4">
            <h2
              className={`mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400 ${
                !isExpanded && !isHovered ? "text-center" : "text-left"
              }`}
            >
              {isExpanded || isHovered || isMobileOpen ? "Menu" : "•••"}
            </h2>

            <ul className="flex flex-col gap-2">
              {navItems.map((nav) => {
                const active = isActive(nav.path);
                
                return (
                  <li key={nav.name}>
                    <Link
                      href={nav.path}
                      className={`relative flex items-center w-full gap-3 px-3 py-2.5 font-medium rounded-lg text-sm transition-colors
                        ${active 
                          ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" 
                          : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                        }
                        ${!isExpanded && !isHovered ? "justify-center" : "justify-start"}
                      `}
                    >
                      <span className={`shrink-0 ${active ? "text-blue-600 dark:text-blue-400" : "text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-300"}`}>
                        {nav.icon}
                      </span>
                      {(isExpanded || isHovered || isMobileOpen) && (
                        <span className="whitespace-nowrap">{nav.name}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
