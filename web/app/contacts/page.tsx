"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getContactPage } from "@/lib/api";
import { ContactPage as ContactPageData } from "@/lib/types";

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
});

export default function ContactsPage() {
  const [contact, setContact] = useState<ContactPageData | null>(null);

  useEffect(() => {
    getContactPage().then((data) => {
      if (data) setContact(data);
    });
  }, []);

  const phone = contact?.phone || "+7 (905) 617-98-52";
  const email = contact?.email || "info@aforklift.ru";
  const address =
    contact?.address ||
    "600033, Владимирская область, город Владимир, Мещёрская ул., д. 4, офис 36";
  const lat = contact?.latitude ?? 56.0967;
  const lng = contact?.longitude ?? 40.3477;

  return (
    <main>
      <h1 style={{ textAlign: "center", fontSize: "2.1875rem", display: "block", height: 70, margin: "0.8em 0" }}>
        Контакты
      </h1>
      <article
        style={{
            padding: "0 60px 30px",
            paddingBottom: 160,
            maxWidth: 1440,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        className="page-article"
      >
        <address>
          <p>
            <b>Телефон:</b> {phone}
          </p>
          <p>
            <b>Почта:</b> {email}
          </p>
          <p>
            <b>Адрес:</b> {address}
          </p>
        </address>
        <LeafletMap lat={lat} lng={lng} popupText={address} />
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
