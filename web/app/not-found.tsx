export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
        gap: 20,
        padding: "60px 20px",
      }}
    >
      <h1 style={{ fontSize: "4rem", fontWeight: 700, margin: 0 }}>404</h1>
      <p style={{ fontSize: "1.25rem", color: "#666" }}>
        Страница не найдена
      </p>
      <a
        href="/"
        style={{
          color: "var(--accent-color, #007bff)",
          textDecoration: "underline",
          fontSize: 18,
        }}
      >
        Вернуться на главную
      </a>
    </section>
  );
}