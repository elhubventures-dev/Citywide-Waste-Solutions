"use client";
import React from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/components/admin/icons";

export const EcommerceMetrics = ({
  totalClients = 0,
  totalQuotes = 0,
  totalInvoices = 0,
  totalRevenue = 0,
}: {
  totalClients?: number;
  totalQuotes?: number;
  totalInvoices?: number;
  totalRevenue?: number;
}) => {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
      {/* Metric 1 */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-5 md:size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-3 md:mt-5">
          <div>
            <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Total Clients</span>
            <h4 className="mt-1 font-bold text-gray-800 text-base md:text-title-sm dark:text-white/90">
              {totalClients}
            </h4>
          </div>
        </div>
      </div>

      {/* Metric 2 */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-5 md:size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-3 md:mt-5">
          <div>
            <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Total Quotes</span>
            <h4 className="mt-1 font-bold text-gray-800 text-base md:text-title-sm dark:text-white/90">
              {totalQuotes}
            </h4>
          </div>
        </div>
      </div>

      {/* Metric 3 */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-5 md:size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-3 md:mt-5">
          <div>
            <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Total Invoices</span>
            <h4 className="mt-1 font-bold text-gray-800 text-base md:text-title-sm dark:text-white/90">
              {totalInvoices}
            </h4>
          </div>
        </div>
      </div>

      {/* Metric 4 */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-5 md:size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-3 md:mt-5">
          <div>
            <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Total Revenue</span>
            <h4 className="mt-1 font-bold text-gray-800 text-base md:text-title-sm dark:text-white/90 truncate max-w-[120px] md:max-w-none">
              ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};
