"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { getFilterData } from "@/lib/api";
import Button from "@/components/Button";

const VISIBLE_MANUFACTURERS_COUNT = 6;

function PriceInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const measureRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [textWidth, setTextWidth] = useState(0);

  const formatNumber = (digits: string): string => {
    if (!digits) return "";
    return Number(digits).toLocaleString("ru-RU");
  };

  const displayValue = formatNumber(value);

  useEffect(() => {
    if (measureRef.current) {
      measureRef.current.textContent = displayValue;
      setTextWidth(measureRef.current.offsetWidth);
    }
  }, [displayValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Считаем пробелы до курсора в старом значении
    const cursorPos = e.target.selectionStart ?? raw.length;
    
    const digits = raw.replace(/[^\d]/g, "");
    onChange(digits);

    // Восстанавливаем позицию курсора после форматирования
    requestAnimationFrame(() => {
      const input = inputRef.current;
      if (!input) return;
      const newFormatted = formatNumber(digits);
      // Считаем количество пробелов до курсора в новом значении
      const spacesBeforeOld = (raw.slice(0, cursorPos).match(/\s/g) || []).length;
      const digitsBeforeCursor = cursorPos - spacesBeforeOld;
      // Находим позицию в новой строке после digitsBeforeCursor цифр
      let newPos = 0;
      let digitCount = 0;
      for (let i = 0; i < newFormatted.length; i++) {
        if (digitCount === digitsBeforeCursor) break;
        if (/\d/.test(newFormatted[i])) digitCount++;
        newPos = i + 1;
      }
      if (digitsBeforeCursor === 0) newPos = 0;
      if (digitsBeforeCursor >= digits.length) newPos = newFormatted.length;
      input.setSelectionRange(newPos, newPos);
    });
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* Hidden measurer — same font as input */}
      <span
        ref={measureRef}
        style={{
          position: "absolute",
          visibility: "hidden",
          whiteSpace: "pre",
          fontSize: 14,
          fontFamily: "inherit",
          fontWeight: "inherit",
          letterSpacing: "inherit",
          padding: 0,
          margin: 0,
        }}
      />
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        placeholder={placeholder}
        value={displayValue}
        onChange={handleChange}
        style={{
          width: "100%",
          fontSize: 14,
          padding: value ? "0 32px 0 10px" : "0 10px",
          minHeight: 36,
          boxSizing: "border-box",
        }}
      />
      {value && (
        <span
          style={{
            position: "absolute",
            left: 10 + textWidth + 4,
            top: "50%",
            transform: "translateY(-51%)",
            fontSize: 14,
            color: "var(--text-color)",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          ₽
        </span>
      )}
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          style={{
            position: "absolute",
            right: 6,
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--subtext-color)",
            fontSize: 22,
            lineHeight: 1,
          }}
          aria-label="Очистить"
        >
          ×
        </button>
      )}
    </div>
  );
}

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
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [manufacturersExpanded, setManufacturersExpanded] = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);

  // Локальные состояния для полей (до применения)
  const [priceMin, setPriceMin] = useState(
    searchParams.get("priceMin") || ""
  );
  const [priceMax, setPriceMax] = useState(
    searchParams.get("priceMax") || ""
  );
  const [selectedManufacturers, setSelectedManufacturers] = useState<string[]>(
    searchParams.get("manufacturer")?.split(",").filter(Boolean) || []
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
        setMinPrice(data.minPrice);
        setMaxPrice(data.maxPrice);
      })
      .finally(() => setLoadingData(false));
  }, [categorySlug]);

  // Синхронизируем локальное состояние с URL при навигации (например, сброс)
  useEffect(() => {
    setPriceMin(searchParams.get("priceMin") || "");
    setPriceMax(searchParams.get("priceMax") || "");
    setSelectedManufacturers(
      searchParams.get("manufacturer")?.split(",").filter(Boolean) || []
    );
  }, [searchParams]);

  // Переключить выбор производителя
  const toggleManufacturer = (m: string) => {
    setSelectedManufacturers((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );
  };

  // Форматирование цены с пробелами (1000 → "1 000")
  const formatPrice = (price: number): string => {
    return price.toLocaleString("ru-RU");
  };

  // Применить фильтры
  const applyFilters = () => {
    // Валидация: минимальная цена не может быть больше максимальной
    const minVal = priceMin.trim() ? Number(priceMin) : null;
    const maxVal = priceMax.trim() ? Number(priceMax) : null;
    if (minVal !== null && maxVal !== null && minVal > maxVal) {
      setPriceError("Минимальная цена не может быть больше максимальной");
      return;
    }
    setPriceError(null);

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

    if (selectedManufacturers.length > 0) {
      params.set("manufacturer", selectedManufacturers.join(","));
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
    setSelectedManufacturers([]);
    setPriceError(null);

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
  if (!loadingData && !hasPrices && manufacturers.length === 0 && !hasActiveFilters) {
    return null;
  }

  // Определяем, нужно ли показывать "Посмотреть все" / "Свернуть"
  const hasManyManufacturers = manufacturers.length > VISIBLE_MANUFACTURERS_COUNT;
  const visibleManufacturers = manufacturersExpanded
    ? manufacturers
    : manufacturers.slice(0, VISIBLE_MANUFACTURERS_COUNT);

  // Высота одного элемента списка (чекбокс + gap) ≈ 40px
  const manufacturerItemHeight = 45;
  const collapsedManufacturersHeight = VISIBLE_MANUFACTURERS_COUNT * manufacturerItemHeight;

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
        maxHeight: collapsed ? 60 : 2000,
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
              Цена
            </span>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <PriceInput
                value={priceMin}
                onChange={(v) => { setPriceMin(v); setPriceError(null); }}
                placeholder={minPrice !== null ? `от ${formatPrice(minPrice)} ₽` : "от"}
              />
              <span style={{ color: "var(--subtext-color)", flexShrink: 0 }}>—</span>
              <PriceInput
                value={priceMax}
                onChange={(v) => { setPriceMax(v); setPriceError(null); }}
                placeholder={maxPrice !== null ? `до ${formatPrice(maxPrice)} ₽` : "до"}
              />
            </div>
            {priceError && (
              <span style={{ fontSize: 13, color: "var(--error-color, #e53935)" }}>
                {priceError}
              </span>
            )}
          </div>

          {/* Фильтр по производителю */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text-color)" }}>
              Производитель
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
              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    maxHeight: hasManyManufacturers && manufacturersExpanded
                      ? collapsedManufacturersHeight
                      : "none",
                    overflowY: hasManyManufacturers && manufacturersExpanded
                      ? "auto"
                      : "visible",
                  }}
                >
                  {visibleManufacturers.map((m) => (
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
                        checked={selectedManufacturers.includes(m)}
                        onChange={() => toggleManufacturer(m)}
                        style={{ margin: 0 }}
                      />
                      <span>{m}</span>
                    </label>
                  ))}
                </div>
                {hasManyManufacturers && (
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setManufacturersExpanded(!manufacturersExpanded);
                    }}
                    style={{
                      fontSize: 14,
                      textAlign: "left",
                      color: "var(--link-color)",
                      textDecoration: "none",
                      textUnderlineOffset: 2,
                    }}
                  >
                    {manufacturersExpanded
                      ? "Свернуть"
                      : `Посмотреть все (${manufacturers.length})`}
                  </a>
                )}
              </>
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