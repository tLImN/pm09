"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar({
  categorySlug,
}: {
  categorySlug?: string;
}) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      const params = new URLSearchParams();
      params.set("q", trimmed);
      if (categorySlug) {
        params.set("category", categorySlug);
      }
      router.push(`/search?${params.toString()}`);
      setIsOpen(false);
      setQuery("");
      inputRef.current?.blur();
    }
  };

  const closeSearch = () => {
    setIsOpen(false);
    setQuery("");
    inputRef.current?.blur();
  };

  const toggleSearch = () => {
    setIsOpen((prev) => {
      if (!prev) {
        setTimeout(() => inputRef.current?.focus(), 50);
      }
      return !prev;
    });
  };

  // Закрываем при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Закрываем при Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeSearch();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div ref={containerRef} className="search-bar-container">
      {/* Кнопка-иконка поиска (скрывается когда форма открыта) */}
      {!isOpen && (
        <button
          type="button"
          onClick={toggleSearch}
          className="search-toggle-btn"
          aria-label="Поиск"
          aria-expanded={isOpen}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      )}

      {/* Выдвижная строка поиска */}
      {isOpen && (
        <form onSubmit={handleSubmit} className="search-form">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск товаров..."
            className="search-input"
            autoComplete="off"
          />
          <button type="submit" className="search-submit-btn" aria-label="Найти">
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
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span className="btn-text">Искать</span>
          </button>
          {/* Кнопка закрыть (крестик) — видна только на мобильных */}
          <button
            type="button"
            onClick={closeSearch}
            className="search-close-btn"
            aria-label="Закрыть поиск"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </form>
      )}

      <style>{`
        .search-bar-container {
          display: flex;
          align-items: center;
          position: relative;
        }

        .search-toggle-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-color);
          transition: color 0.2s;
        }

        .search-toggle-btn:hover {
          color: var(--accent-hover-color);
          background: none;
        }

        .search-form {
          display: flex;
          align-items: center;
          animation: searchSlideIn 0.2s ease;
        }

        .search-input {
          width: 240px;
          padding: 8px 14px;
          font-size: 15px;
          border: 1px solid var(--border-color);
          border-right: none;
          border-radius: 5px 0 0 5px;
          outline: none;
          background: white;
          color: var(--text-color);
          box-sizing: border-box;
          height: 36px;
        }

        .search-input:focus {
          border-color: var(--accent-color);
        }

        .search-input::placeholder {
          color: var(--subtext-color);
        }

        .search-submit-btn {
          padding: 8px 12px;
          background: var(--accent-color, #0070f3);
          border: 1px solid var(--accent-color, #0070f3);
          border-radius: 0 5px 5px 0;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          color: white;
          transition: background 0.2s;
          height: 40px;
          box-sizing: border-box;
        }

        .search-submit-btn:hover {
          background: var(--accent-hover-color, #005bb5);
          border-color: var(--accent-hover-color, #005bb5);
        }

        .search-submit-btn .btn-text {
          display: none;
        }

        .search-close-btn {
          display: none;
        }

        @keyframes searchSlideIn {
          from {
            opacity: 0;
            transform: translateX(10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @media (max-width: 550px) {
          .search-bar-container {
            position: static !important;
          }

          .search-form {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: white;
            z-index: 2000;
            padding: 20px;
            flex-direction: column;
            justify-content: flex-start;
            padding-top: 50%;
            align-items: stretch;
            animation: searchFadeIn 0.3s ease;
            gap: 12px;
          }

          .search-input {
            width: 100%;
            border-radius: 5px;
            border: 1px solid var(--border-color);
            font-size: 18px;
            padding: 14px;
          }

          .search-submit-btn {
            border-radius: 5px;
            padding: 14px;
            justify-content: center;
            gap: 8px;
          }

          .search-submit-btn .btn-text {
            display: inline;
          }

          /* Показываем кнопку-крестик на мобильных — стилизуем как hamburger */
          .search-close-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: 20px;
            right: 20px;
            background: none;
            border: none;
            cursor: pointer;
            padding: 8px;
            color: var(--text-color);
            z-index: 1001;
          }

          .search-close-btn:hover {
            color: var(--accent-hover-color);
            background: none;
          }

          @keyframes searchFadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        }
      `}</style>
    </div>
  );
}