"use client";

import { useState, useEffect } from "react";

export function useScrollPosition(threshold = 0) {
  const [scrolled, setScrolled] = useState(false);
  const [y,        setY]        = useState(0);

  useEffect(() => {
    const handler = () => {
      const current = window.scrollY;
      setY(current);
      setScrolled(current > threshold);
    };

    window.addEventListener("scroll", handler, { passive: true });
    handler(); // init
    return () => window.removeEventListener("scroll", handler);
  }, [threshold]);

  return { scrolled, y };
}
