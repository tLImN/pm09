"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { getFilterData } from "@/lib/api";
import Button from "@/components/Button";

export default function FilterPanel({
  categorySlug,
}: {
  categorySlug?: string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [manufacturers, setManufacturers] = useState<string[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [hasPrices, setHasPrices] = useState(false);

  // Локальные состояния для полей (до применения)
  const [priceMin, setPriceMin] = useState(
    searchParams.get("priceMin") || ""
  );
  const [priceMax, setPriceMax] = useState(
    searchParams.get("priceMax") || ""
  );
  const [selectedManufacturer, setSelectedManufacturer] = useState(
    searchParams.get("manufacturer") || ""
  );

  // Отслеживаем размер экрана
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 900px)");
    setIsMobile(mediaQuery.matches);
    setCollapsed(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
      if (e.matches) setCollapsed(true);
      else setCollapsed(false);
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Сбрасываем collapsed при смене страницы на мобильных
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [pathname, isMobile]);

  // Загружаем данные для фильтров
  useEffect(() => {
    setLoadingData(true);
    getFilterData(categorySlug)
      .then((data) => {
        setManufacturers(data.manufacturers);
        setHasPrices(data.hasPrices);
      })
      .finally(() => setLoadingData(false));
  }, [categorySlug]);

  // Синхронизируем локальное состояние с URL при навигации (например, сброс)
  useEffect(() => {
    setPriceMin(searchParams.get("priceMin") || "");
    setPriceMax(searchParams.get("priceMax") || "");
    setSelectedManufacturer(searchParams.get("manufacturer") || "");
  }, [searchParams]);

  // Применить фильтры
  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (priceMin.trim()) {
      params.set("priceMin", priceMin.trim());
    } else {
      params.delete("priceMin");
    }

    if (priceMax.trim()) {
      params.set("priceMax", priceMax.trim());
    } else {
      params.delete("priceMax");
    }

    if (selectedManufacturer) {
      params.set("manufacturer", selectedManufacturer);
    } else {
      params.delete("manufacturer");
    }

    // Сбрасываем на первую страницу при изменении фильтров
    params.delete("page");

    router.push(`${pathname}?${params.toString()}`);
  };

  // Сбросить фильтры
  const resetFilters = () => {
    setPriceMin("");
    setPriceMax("");
    setSelectedManufacturer("");

    const params = new URLSearchParams(searchParams.toString());
    params.delete("priceMin");
    params.delete("priceMax");
    params.delete("manufacturer");
    params.delete("page");

    router.push(`${pathname}?${params.toString()}`);
  };

  // Есть ли активные фильтры
  const hasActiveFilters =
    searchParams.has("priceMin") ||
    searchParams.has("priceMax") ||
    searchParams.has("manufacturer");

  // Скрываем панель если нет данных для фильтрации и нет активных фильтров
  // Для расширяемости: добавляйте новые условия через ||
  if (!loadingData && !hasPrices && manufacturers.length === 0 && !hasActiveFilters) {
    return null;
  }

  return (
    <div
      style={{
        border: "1px solid var(--border-color)",
        borderRadius: 5,
        padding: collapsed ? "16px 20px 16px" : "20px 20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        height: "fit-content",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        maxHeight: collapsed ? 56 : 600,
        transition: "max-height 0.3s ease, padding 0.3s ease",
      }}
    >
      {/* Заголовок и кнопка сворачивания */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={() => setCollapsed(!collapsed)}
      >
        <span
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: "var(--text-color)",
          }}
        >
          Фильтры
          {hasActiveFilters && (
            <span
              style={{
                display: "inline-block",
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "var(--accent-color)",
                marginLeft: 8,
                verticalAlign: "middle",
              }}
            />
          )}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCollapsed(!collapsed);
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-color)",
          }}
          aria-label={collapsed ? "Развернуть фильтры" : "Свернуть фильтры"}
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
      </div>

      {!collapsed && (
        <>
          {/* Фильтр по цене */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text-color)" }}>
              Цена, ₽
            </span>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="number"
                placeholder="от"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                style={{
                  width: "100%",
                  fontSize: 14,
                  padding: "0 10px",
                  minHeight: 36,
                }}
              />
              <span style={{ color: "var(--subtext-color)", flexShrink: 0 }}>—</span>
              <input
                type="number"
                placeholder="до"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                style={{
                  width: "100%",
                  fontSize: 14,
                  padding: "0 10px",
                  minHeight: 36,
                }}
              />
            </div>
          </div>

          {/* Фильтр по стране производителя */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text-color)" }}>
              Страна производителя
            </span>
            {loadingData ? (
              <span style={{ fontSize: 14, color: "var(--subtext-color)" }}>
                Загрузка...
              </span>
            ) : manufacturers.length === 0 ? (
              <span style={{ fontSize: 14, color: "var(--subtext-color)" }}>
                Нет данных
              </span>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {manufacturers.map((m) => (
                  <label
                    key={m}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      cursor: "pointer",
                      fontSize: 15,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedManufacturer === m}
                      onChange={() =>
                        setSelectedManufacturer(selectedManufacturer === m ? "" : m)
                      }
                      style={{ margin: 0 }}
                    />
                    <span>{m}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Кнопки */}
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <Button
              size="small"
              onClick={applyFilters}
              style={{ flex: 1 }}
            >
              Применить
            </Button>
            {hasActiveFilters && (
              <Button
                size="small"
                outlined
                onClick={resetFilters}
              >
                Сбросить
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}