"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                className="header-link"
                onClick={closeMenu}
              >
                Каталог
              </Link>
            </li>
            <li style={{ padding: "22px 23px", fontSize: 18, minWidth: "5.5em" }}>
              <Link
                href="/about"
                style={{ color: "var(--text-color)" }}
                className="header-link"
                onClick={closeMenu}
              >
                О нас
              </Link>
            </li>
            <li style={{ padding: "22px 23px", fontSize: 18 }}>
              <Link
                href="/payment"
                style={{ color: "var(--text-color)" }}
                className="header-link"
                onClick={closeMenu}
              >
                Доставка и оплата
              </Link>
            </li>
            <li style={{ padding: "22px 23px", fontSize: 18 }}>
              <Link
                href="/contacts"
                style={{ color: "var(--text-color)" }}
                className="header-link"
                onClick={closeMenu}
              >
                Контакты
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Overlay для мобильного меню */}
      {isMenuOpen && <div className="menu-overlay" onClick={closeMenu}></div>}

      <style>{`
        header {
          max-height: 122px;
        }
        .header-link:hover {
          color: var(--accent-hover-color) !important;
          transition-duration: 0.2s;
        }

        /* Скрываем кнопку гамбургер на десктопе */
        .hamburger-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          color: var(--text-color);
          z-index: 1001;
        }

        /* Overlay скрыт по умолчанию */
        .menu-overlay {
          display: none;
        }

        @media (max-width: 860px) {
          header {
            max-height: 140px !important;
          }
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
          header {
            max-height: none !important;
            position: relative;
          }

          header > div {
            flex-direction: row !important;
            justify-content: space-between !important;
            padding: 10px 15px !important;
          }

          /* Показываем кнопку гамбургер на мобильных */
          .hamburger-btn {
            display: flex !important;
            align-items: center;
            justify-content: center;
          }

          .hamburger-btn:hover {
            color: var(--accent-hover-color);
            background: none;
          }

          /* Скрываем навигацию по умолчанию */
          .nav-menu {
            display: none !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            background: white !important;
            z-index: 1000 !important;
            padding: 80px 20px 20px !important;
            overflow-y: auto !important;
          }

          /* Показываем навигацию при открытии */
          .nav-menu.open {
            display: flex !important;
            animation: slideIn 0.3s ease;
          }

          .nav-menu ul {
            flex-direction: column !important;
            gap: 0 !important;
            width: 100% !important;
          }

          .nav-menu ul li {
            padding: 15px 0 !important;
            font-size: 18px !important;
            border-bottom: 1px solid #eee !important;
            min-width: auto !important;
          }

          .nav-menu ul li:last-child {
            border-bottom: none !important;
          }

          /* Overlay при открытом меню */
          .menu-overlay {
            display: block !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            background: rgba(0, 0, 0, 0.5) !important;
            z-index: 999 !important;
            animation: fadeIn 0.3s ease;
          }

          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        }
      `}</style>
    </header>
  );
}
