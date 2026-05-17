"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getContactPage } from "@/lib/api";
import { ContactPage as ContactPageData } from "@/lib/types";

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
});

export default function ContactsPageClient() {
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
  const workingHours = contact?.working_hours || "пн–пт, 9:00–18:00";
  const lat = contact?.latitude ?? 56.0967;
  const lng = contact?.longitude ?? 40.3477;

  return (
    <section>
      <h1 style={{ textAlign: "center", fontSize: "2.1875rem", display: "block", margin: "0.8em 0" }}>
        Контакты
      </h1>
      <article
        className="page-article contacts-article"
        style={{
            paddingBottom: 160,
            maxWidth: 1440,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
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
          <p>
            <b>Часы работы:</b> {workingHours}
          </p>
        </address>
        <LeafletMap lat={lat} lng={lng} popupText={address} />
      </article>
    </section>
  );
}