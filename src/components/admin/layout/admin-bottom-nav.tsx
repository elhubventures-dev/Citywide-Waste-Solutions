"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GridIcon, PageIcon, MailIcon } from "../icons";

export default function AdminBottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + "/");
  };

  const navItems = [
    {
      name: "Dashboard",
      icon: <GridIcon className="w-5 h-5" />,
      path: "/admin/dashboard",
    },
    {
      name: "Invoices",
      icon: <PageIcon className="w-5 h-5" />,
      path: "/admin/invoices",
    },
    {
      name: "Submissions",
      icon: <MailIcon className="w-5 h-5" />,
      path: "/admin/submissions",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-4 py-2 pb-4 flex justify-around items-center">
      {navItems.map((item) => {
        const active = isActive(item.path);
        return (
          <Link
            key={item.name}
            href={item.path}
            className={`flex flex-col items-center justify-center gap-1.5 py-1 px-4 rounded-xl transition-all duration-200 ${
              active
                ? "text-green-600 dark:text-green-400 font-semibold"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            <span className={`transition-transform duration-200 ${active ? "scale-110" : "scale-100"}`}>
              {item.icon}
            </span>
            <span className="text-[11px] tracking-wide">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
