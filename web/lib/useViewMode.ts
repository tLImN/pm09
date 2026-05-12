"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "viewMode";

export function useViewMode() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // При монтировании читаем из localStorage или определяем по размеру экрана
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "list" || stored === "grid") {
      setViewMode(stored);
    } else if (window.innerWidth <= 768) {
      setViewMode("grid");
    }
  }, []);

  // При изменении режима сохраняем в localStorage
  const changeViewMode = (mode: "list" | "grid") => {
    setViewMode(mode);
    localStorage.setItem(STORAGE_KEY, mode);
  };

  return { viewMode, setViewMode: changeViewMode };
}