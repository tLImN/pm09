"use client";

import { useState, useEffect } from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPageRange(page: number, totalPages: number, siblingCount: number): (number | "...")[] {
  const totalSlots = siblingCount * 2 + 5; // first + last + siblings*2 + current + 2 ellipsis
  if (totalPages <= totalSlots) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIdx = Math.max(page - siblingCount, 1);
  const rightSiblingIdx = Math.min(page + siblingCount, totalPages);

  const showLeftEllipsis = leftSiblingIdx > 2;
  const showRightEllipsis = rightSiblingIdx < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftRange = Array.from({ length: rightSiblingIdx }, (_, i) => i + 1);
    return [...leftRange, "...", totalPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightRange = Array.from({ length: totalPages - leftSiblingIdx + 1 }, (_, i) => leftSiblingIdx + i);
    return [1, "...", ...rightRange];
  }

  const middleRange = Array.from({ length: rightSiblingIdx - leftSiblingIdx + 1 }, (_, i) => leftSiblingIdx + i);
  return [1, "...", ...middleRange, "...", totalPages];
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const [siblingCount, setSiblingCount] = useState(2);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 513px)");
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      setSiblingCount(e.matches ? 0 : 2);
    };
    handler(mq);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handlePageChange = (newPage: number) => {
    onPageChange(newPage);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  if (totalPages <= 1) return null;

  const pages = getPageRange(page, totalPages, siblingCount);

  return (
    <div className="pagination-container" style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "nowrap", padding: "10px 0", overflowX: "auto" }}>
      <button
        onClick={() => handlePageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        style={{
          padding: "6px 12px",
          cursor: page === 1 ? "default" : "pointer",
          opacity: page === 1 ? 0.0 : 1,
          outline: "1px solid var(--border-color)",
          borderRadius: 4,
          background: "#fff",
          color: "var(--text-color)"
        }}
      >
        ←
      </button>
      {pages.map((p, idx) =>
        p === "..." ? (
          <span
            key={`ellipsis-${idx}`}
            style={{
              padding: "6px 12px",
              color: "var(--text-color)",
              userSelect: "none",
            }}
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => handlePageChange(p)}
            style={{
              padding: "6px 12px",
              cursor: "pointer",
              outline: p === page ? "1px solid var(--accent-color)" : "1px solid var(--border-color)",
              borderRadius: 4,
              background: p === page ? "var(--accent-color)" : "#fff",
              color: p === page ? "#fff" : "var(--text-color)",
              fontWeight: p === page ? 600 : 400,
            }}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        style={{
          padding: "6px 12px",
          cursor: page === totalPages ? "default" : "pointer",
          opacity: page === totalPages ? 0.0 : 1,
          outline: "1px solid var(--border-color)",
          borderRadius: 4,
          background: "#fff",
          color: "var(--text-color)"
        }}
      >
        →
      </button>
    </div>
  );
}