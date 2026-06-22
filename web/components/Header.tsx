"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useRequestCart } from "@/lib/RequestCartContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { items } = useRequestCart();
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const isActive = (href: string) => {
    if (href === "/catalog") {
      return pathname === "/catalog" || pathname.startsWith("/catalog/");
    }
    return pathname === href;
  };

  const handlePopupOpen = () => {
    window.dispatchEvent(new CustomEvent("open-popup"));
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
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
        <Link href="/"><img src="/Logo-wide.svg" width="433" height="72" alt="Альтернатива Форклифт" loading="eager" fetchPriority="high" /></Link>
        
        {/* Кнопка гамбургер - показывается только на мобильных */}
        <button 
          className="hamburger-btn"
          onClick={toggleMenu}
          aria-label="Открыть меню"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>

        <nav className={`nav-menu ${isMenuOpen ? 'open' : ''}`} style={{ flexGrow: 1 }}>
          <ul
            style={{
              display: "flex",
              listStyle: "none",
              gap: "1rem",
              justifyContent: "flex-end",
              alignItems: "center",
              textAlign: "center",
              margin: 0,
              padding: 0,
            }}
          >
            <li style={{ padding: "22px 23px", fontSize: 18 }}>
              <Link
                href="/catalog"
                style={{ color: "var(--text-color)" }}
                className={`header-link${isActive("/catalog") ? " active" : ""}`}
                onClick={closeMenu}
              >
                Каталог
              </Link>
            </li>
            <li style={{ padding: "22px 23px", fontSize: 18, minWidth: "5.5em" }}>
              <Link
                href="/about"
                style={{ color: "var(--text-color)" }}
                className={`header-link${isActive("/about") ? " active" : ""}`}
                onClick={closeMenu}
              >
                О нас
              </Link>
            </li>
            <li style={{ padding: "22px 23px", fontSize: 18 }}>
              <Link
                href="/payment"
                style={{ color: "var(--text-color)" }}
                className={`header-link${isActive("/payment") ? " active" : ""}`}
                onClick={closeMenu}
              >
                Доставка и оплата
              </Link>
            </li>
            <li style={{ padding: "22px 23px", fontSize: 18 }}>
              <Link
                href="/contacts"
                style={{ color: "var(--text-color)" }}
                className={`header-link${isActive("/contacts") ? " active" : ""}`}
                onClick={closeMenu}
              >
                Контакты
              </Link>
            </li>
            <li style={{ padding: "22px 15px", display: "flex", alignItems: "center" }}>
              <button
                onClick={handlePopupOpen}
                aria-label="Открыть заявку"
                style={{
                  position: "relative",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-color)",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--text-color)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {totalItems > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: -4,
                      right: -6,
                      backgroundColor: "#e63946",
                      color: "#fff",
                      fontSize: 10,
                      fontWeight: 700,
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      lineHeight: 1,
                    }}
                  >
                    {totalItems > 99 ? "99" : totalItems}
                  </span>
                )}
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Overlay для мобильного меню */}
      {isMenuOpen && <div className="menu-overlay" onClick={closeMenu}></div>}
    </header>
  );
}
