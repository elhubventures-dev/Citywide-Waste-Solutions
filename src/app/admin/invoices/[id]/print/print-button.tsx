"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-blue transition-colors hover:bg-blue-600"
    >
      <Printer size={16} />
      Print Document
    </button>
  );
}
