"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handlePopupOpen = () => {
    window.dispatchEvent(new CustomEvent("open-popup"));
  };

  return (
    <header>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          maxWidth: 1400,
          margin: "0 auto",
          gap: 10,
          padding: "10px 20px",
        }}
      >
        <Link href="/"><Image src="/Logo-wide.svg" width="433" height="72" alt="Альтернатива Форклифт" /></Link>
        <nav style={{ flexGrow: 1 }}>
          <ul
            style={{
              display: "flex",
              listStyle: "none",
              gap: "1rem",
              justifyContent: "flex-end",
              alignItems: "center",
              margin: 0,
              padding: 0,
            }}
          >
            <li style={{ padding: "22px 23px", fontSize: 18 }}>
              <Link
                href="/catalog"
                style={{ color: "var(--text-color)" }}
                className="header-link"
              >
                Каталог
              </Link>
            </li>
            <li style={{ padding: "22px 23px", fontSize: 18, minWidth: "6em" }}>
              <Link
                href="/about"
                style={{ color: "var(--text-color)" }}
                className="header-link"
              >
                О нас
              </Link>
            </li>
            <li style={{ padding: "22px 23px", fontSize: 18 }}>
              <Link
                href="/payment"
                style={{ color: "var(--text-color)" }}
                className="header-link"
              >
                Доставка и оплата
              </Link>
            </li>
            <li style={{ padding: "22px 23px", fontSize: 18 }}>
              <Link
                href="/contacts"
                style={{ color: "var(--text-color)" }}
                className="header-link"
              >
                Контакты
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <style>{`
        header {
          max-height: 122px;
        }
        .header-link:hover {
          color: var(--accent-hover-color) !important;
          transition-duration: 0.2s;
        }
        @media (max-width: 860px) {
          header > div {
            flex-direction: column !important;
            padding: 10px 20px !important;
          }
          header nav ul {
            flex-wrap: wrap !important;
            justify-content: center !important;
            gap: 0.5rem !important;
          }
          header nav ul li {
            padding: 10px 12px !important;
            font-size: 16px !important;
          }
        }
        @media (max-width: 550px) {
          header nav ul li {
            font-size: 14px !important;
          }
        }
      `}</style>
    </header>
  );
}