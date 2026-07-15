"use client";
import { useSidebar } from "./sidebar-context";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { Menu, Search, X, User } from "lucide-react";
import { AdminUserMenu } from "../admin-user-menu";

export default function AdminHeader() {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 flex w-full bg-white border-b border-slate-200 z-40 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-slate-200 dark:border-slate-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
          <button
            className="flex items-center justify-center w-10 h-10 text-slate-500 border border-slate-200 rounded-lg dark:border-slate-800 dark:text-slate-400 lg:h-11 lg:w-11"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/admin/dashboard" className="lg:hidden flex items-center gap-2">
            <div className="relative h-7 w-auto min-w-7">
              <Image 
                src="/images/logos/logo-header.png" 
                alt="Citywide Waste Solutions"
                width={100}
                height={28}
                className="h-7 w-auto object-contain dark:hidden"
                priority
              />
              <Image 
                src="/images/logos/logo-dark.png" 
                alt="Citywide Waste Solutions"
                width={100}
                height={28}
                className="hidden h-7 w-auto object-contain dark:block"
                priority
              />
            </div>
          </Link>

          <button
            onClick={toggleApplicationMenu}
            className="flex items-center justify-center w-10 h-10 text-slate-700 rounded-lg hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
          >
            <User className="w-5 h-5" />
          </button>

          <div className="hidden lg:block">
            <div className="relative">
              <span className="absolute -translate-y-1/2 left-4 top-1/2 pointer-events-none">
                <Search className="w-4 h-4 text-slate-400" />
              </span>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search..."
                className="h-11 w-full rounded-lg border border-slate-200 bg-transparent py-2.5 pl-11 pr-14 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white/90 dark:focus:border-blue-500 xl:w-[430px]"
              />
              <button className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                <span>⌘</span>
                <span>K</span>
              </button>
            </div>
          </div>
        </div>

        <div
          className={`${
            isApplicationMenuOpen ? "flex" : "hidden"
          } items-center justify-between w-full gap-4 px-5 py-4 lg:flex shadow-sm lg:justify-end lg:px-0 lg:shadow-none`}
        >
          <div className="flex items-center gap-3 ml-auto">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                  <User className="w-6 h-6 text-slate-500 dark:text-slate-400" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-slate-700 dark:text-white">Admin User</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Owner</p>
                </div>
              </div>
              <div className="pl-4 border-l border-slate-200 dark:border-slate-800">
                <AdminUserMenu />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
