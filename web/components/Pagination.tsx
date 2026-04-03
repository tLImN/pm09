interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap", padding: "10px 0" }}>
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
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
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
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
      ))}
      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
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