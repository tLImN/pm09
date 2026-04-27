"use client";

import { ReactNode } from "react";

interface PopupTriggerProps {
  children: ReactNode;
}

export default function PopupTrigger({ children }: PopupTriggerProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("open-popup"));
  };

  return (
    <a href="#" onClick={handleClick} style={{ cursor: "pointer" }}>
      {children}
    </a>
  );
}