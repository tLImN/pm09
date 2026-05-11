"use client";

interface ViewModeToggleProps {
  viewMode: "list" | "grid";
  onChange: (mode: "list" | "grid") => void;
}

export default function ViewModeToggle({
  viewMode,
  onChange,
}: ViewModeToggleProps) {
  return (
    <div
      className="view-mode-toggle"
      style={{
        display: "flex",
        gap: 0,
        marginLeft: "auto",
        border: "1px solid var(--border-color)",
        borderRadius: 5,
        overflow: "hidden",
        height: 40,
      }}
    >
      <button
        type="button"
        onClick={() => onChange("list")}
        className="view-mode-toggle__btn"
        data-active={viewMode === "list"}
        aria-label="Вид список"
        title="Вид список"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 40,
          height: "100%",
          padding: 0,
          border: "none",
          borderRadius: 0,
          background:
            viewMode === "list"
              ? "var(--accent-color)"
              : "var(--inverted-text-color)",
          color:
            viewMode === "list"
              ? "var(--inverted-text-color)"
              : "var(--text-color)",
          cursor: "pointer",
          transition: "background 0.2s, color 0.2s",
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      </button>
      <div
        style={{
          width: 1,
          height: "100%",
          background: "var(--border-color)",
          flexShrink: 0,
        }}
      />
      <button
        type="button"
        onClick={() => onChange("grid")}
        className="view-mode-toggle__btn"
        data-active={viewMode === "grid"}
        aria-label="Вид сетка"
        title="Вид сетка"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 40,
          height: "100%",
          padding: 0,
          border: "none",
          borderRadius: 0,
          background:
            viewMode === "grid"
              ? "var(--accent-color)"
              : "var(--inverted-text-color)",
          color:
            viewMode === "grid"
              ? "var(--inverted-text-color)"
              : "var(--text-color)",
          cursor: "pointer",
          transition: "background 0.2s, color 0.2s",
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
      </button>
    </div>
  );
}