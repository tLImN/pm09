interface DetailsItemProps {
  question: string;
  children: React.ReactNode;
}

export default function DetailsItem({ question, children }: DetailsItemProps) {
  return (
    <details
      style={{
        border: "1px solid var(--border-color)",
        borderRadius: 5,
        padding: "28px 31px",
      }}
    >
      <summary
        style={{
          fontSize: "1.375rem",
          listStyle: "none",
          display: "flex",
          justifyContent: "space-between",
          cursor: "pointer",
          fontWeight: 600
        }}
      >
        {question}
        <button
          className="expand-button"
          type="button"
          aria-label="Развернуть"
        ></button>
      </summary>
      <p style={{ margin: "16px 0", }}>{children}</p>
    </details>
  );
}