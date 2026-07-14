"use client";

import { useEffect } from "react";

export function AutoPrint() {
  useEffect(() => {
    // Small delay to ensure styles and fonts are fully loaded
    const timer = setTimeout(() => {
      window.print();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
