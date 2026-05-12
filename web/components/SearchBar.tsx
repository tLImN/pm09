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
      {/* Кнопка-иконка поиска (скрывается на десктопе через CSS) */}
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

      {/* Форма поиска: на десктопе всегда видна, на мобильных — по isOpen */}
      <form
        onSubmit={handleSubmit}
        className={`search-form ${isOpen ? "search-form--open" : ""}`}
      >
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

    </div>
  );
}