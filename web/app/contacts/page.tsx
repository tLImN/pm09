"use client";

import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
});

export default function ContactsPage() {
  return (
    <main>
      <h1 style={{ textAlign: "center", fontSize: "2.1875rem", display: "block", height: 70, margin: "0.8em 0" }}>
        Контакты
      </h1>
      <article
        style={{
          padding: "0 160px 30px",
          marginBottom: 160,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
        className="page-article"
      >
        <address>
          <p>
            <b>Телефон:</b> +7 (905) 617-98-52
          </p>
          <p>
            <b>Почта:</b> info@aforklift.ru
          </p>
          <p>
            <b>Адрес:</b> 600033, Владимирская область, город Владимир,
            Мещёрская ул., д. 4, офис 36
          </p>
        </address>
        <LeafletMap />
      </article>
      <style>{`
        @media (max-width: 768px) {
          .page-article {
            padding: 0 20px 30px !important;
            margin-bottom: 40px !important;
          }
        }
      `}</style>
    </main>
  );
}
