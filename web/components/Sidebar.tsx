"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Category } from "@/lib/types";

export default function Sidebar({
  categories,
  activeCategorySlug,
}: {
  categories: Category[];
  activeCategorySlug?: string;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Сбрасываем collapsed при смене страницы
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [pathname, isMobile]);

  // Отслеживаем размер экрана
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 900px)");
    setIsMobile(mediaQuery.matches);
    setCollapsed(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
      if (!e.matches) setCollapsed(false);
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Группируем категории: только родительские (parent_category === null)
  const parentCategories = categories.filter(
    (c) => c.parent_category === null || c.parent_category === undefined
  );

  // Подсвечивать родительскую категорию только когда выбрана именно она
  const isParentActive = (parent: Category) => {
    return activeCategorySlug === parent.category_slug;
  };

  const isCollapsed = isMobile && collapsed;

  return (
    <aside
      onClick={isCollapsed ? () => setCollapsed(false) : undefined}
      style={{
        border: "1px solid var(--border-color)",
        width: 344,
        minWidth: 200,
        borderRadius: 5,
        padding: isCollapsed ? "16px 20px 16px" : "20px 20px 40px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        height: "fit-content",
        boxSizing: "border-box",
        cursor: isCollapsed ? "pointer" : "default",
        position: "relative",
        overflow: "hidden",
        maxHeight: isCollapsed ? 60 : 2000,
        transition: "max-height 0.3s ease, padding 0.3s ease",
      }}
    >
      {/* Кнопка свернуть — всегда в одном и том же месте */}
      {isMobile && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCollapsed(!collapsed);
          }}
          style={{
            position: "absolute",
            top: 18,
            right: 18,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-color)",
            zIndex: 1,
          }}
          aria-label={collapsed ? "Развернуть" : "Свернуть"}
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
            style={{
              transition: "transform 0.3s ease",
              transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      )}

      {/* Заголовок в свернутом виде */}
      {isCollapsed && (
        <span
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: "var(--text-color)",
            marginRight: 30,
          }}
        >
          Выбрать категорию
        </span>
      )}

      {/* Все категории */}
      {!isCollapsed &&
        parentCategories.map((parent) => (
          <div key={parent.id}>
            <Link
              href={`/catalog/${parent.category_slug}`}
              style={{
                fontSize: 22,
                fontWeight: 600,
                margin: 0,
                display: "block",
                marginBottom: 8,
                color: isParentActive(parent)
                  ? "var(--accent-hover-color)"
                  : "var(--text-color)",
              }}
            >
              {parent.category_title}
            </Link>
            {parent.children_categories &&
              parent.children_categories.length > 0 && (
                <ul
                  style={{
                    listStyle: "none",
                    paddingLeft: 30,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  {[...parent.children_categories]
                    .sort((a, b) =>
                      a.category_slug.localeCompare(b.category_slug)
                    )
                    .map((child) => (
                      <li key={child.id}>
                        <Link
                          href={`/catalog/${child.category_slug}`}
                          style={{
                            color:
                              activeCategorySlug === child.category_slug
                                ? "var(--accent-hover-color)"
                                : "var(--text-color)",
                          }}
                        >
                          {child.category_title}
                        </Link>
                      </li>
                    ))}
                </ul>
              )}
          </div>
        ))}

      <style>{`
        aside a:hover {
          color: var(--accent-hover-color) !important;
        }
        @media (max-width: 1366px) {
          aside {
            margin-left: 10px;
          }
        }
        @media (max-width: 900px) {
          aside {
            width: 100% !important;
            margin-left: 0;
          }
        }
      `}</style>
    </aside>
  );
}