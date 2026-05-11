"use client";

import { Suspense, useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { searchCatalogItems, getCategories } from "@/lib/api";
import { CatalogItem, Category } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import Sidebar from "@/components/Sidebar";
import FilterPanel from "@/components/FilterPanel";
import SearchBar from "@/components/SearchBar";
import ViewModeToggle from "@/components/ViewModeToggle";
import Link from "next/link";

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "30px 20px" }}>
          <p className="loading-status">Загрузка...</p>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const categorySlug = searchParams.get("category") || undefined;

  // Фильтры из URL
  const priceMin = searchParams.get("priceMin")
    ? Number(searchParams.get("priceMin"))
    : undefined;
  const priceMax = searchParams.get("priceMax")
    ? Number(searchParams.get("priceMax"))
    : undefined;
  const manufacturer = useMemo(() => {
    const arr = searchParams.get("manufacturer")?.split(",").filter(Boolean) || [];
    return arr.length > 0 ? arr : undefined;
  }, [searchParams]);

  const [items, setItems] = useState<CatalogItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sortBy, setSortBy] = useState("title-asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Определяем режим по умолчанию при монтировании
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth <= 768) {
      setViewMode("grid");
      setPageSize(10);
    }
  }, []);

  // Загружаем категории один раз
  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const fetchData = useCallback(async () => {
    if (!query.trim()) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const result = await searchCatalogItems(query.trim(), {
        page,
        pageSize,
        category: categorySlug,
        sort: sortBy,
        priceMin,
        priceMax,
        manufacturer,
      });
      setItems(result.data || []);
      setTotalPages(result.meta?.pagination?.pageCount || 1);
      setTotal(result.meta?.pagination?.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [query, page, pageSize, categorySlug, sortBy, priceMin, priceMax, manufacturer]);

  // Сбрасываем страницу при изменении query или фильтров
  useEffect(() => {
    setPage(1);
  }, [query, categorySlug, priceMin, priceMax, manufacturer]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setPage(1);
  };

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setPage(1);
  };

  const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  const categoryTitle = categorySlug
    ? categories.find((c) => c.category_slug === categorySlug)?.category_title
    : undefined;

  return (
    <div
      style={{
        maxWidth: 1400,
        margin: "0 auto",
        padding: "30px 20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 40,
          marginBottom: 40,
        }}
        className="content-wrapper-aside"
      >
        <div
          className="sidebar-filters-column"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            width: 344,
            minWidth: 200,
            flexShrink: 0,
            height: "fit-content",
          }}
        >
          <Sidebar
            categories={categories}
            activeCategorySlug={categorySlug}
          />
          <Suspense fallback={null}>
            <FilterPanel categorySlug={categorySlug} />
          </Suspense>
        </div>

        <section
          style={{
            maxWidth: 950,
            display: "flex",
            flexDirection: "column",
            gap: 20,
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginRight: 10,
            }}
          >
            <h1 style={{ margin: 0, fontSize: 35, fontWeight: 600 }}>
              {categoryTitle
                ? `Поиск в «${categoryTitle}»`
                : "Результаты поиска"}
            </h1>
            <SearchBar categorySlug={categorySlug} />
          </div>

          {query && (
            <p
              style={{
                margin: 0,
                color: "var(--subtext-color)",
                fontSize: 16,
              }}
            >
              По запросу «<strong>{query}</strong>»
              {!loading && total > 0 && (
                <>
                  {" "}
                  — {startItem}–{endItem} из {total}{" "}
                  {total === 1
                    ? "результата"
                    : total < 5
                      ? "результата"
                      : "результатов"}
                </>
              )}
            </p>
          )}

          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              flexWrap: "wrap", 
              marginRight: 10,
            }}
          >
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="title-asc">Сортировать: по названию (А-Я)</option>
              <option value="title-desc">Сортировать: по названию (Я-А)</option>
              <option value="price-asc">Сортировать: сначала дешевле</option>
              <option value="price-desc">Сортировать: сначала дороже</option>
              <option value="newest">Сортировать: сначала новые</option>
              <option value="oldest">Сортировать: сначала старые</option>
            </select>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            >
              <option value={5}>Показывать: 5</option>
              <option value={10}>Показывать: 10</option>
              <option value={20}>Показывать: 20</option>
              <option value={50}>Показывать: 50</option>
            </select>
            {!loading && total > 0 && (
              <span style={{ fontSize: 14, color: "#666" }}>
                {startItem}–{endItem} из {total}
              </span>
            )}
            <ViewModeToggle viewMode={viewMode} onChange={setViewMode} />
          </div>

          {!query.trim() ? (
            <p className="loading-status">Введите поисковый запрос</p>
          ) : loading ? (
            <p className="loading-status">Загрузка...</p>
          ) : items.length === 0 ? (
            <div
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              <p className="loading-status">
                По запросу «{query}» ничего не найдено
              </p>
              <p style={{ color: "var(--subtext-color)", fontSize: 15 }}>
                Попробуйте изменить запрос или{" "}
                <Link
                  href="/catalog"
                  style={{
                    color: "var(--link-color)",
                  }}
                >
                  перейти в каталог
                </Link>
                .
              </p>
            </div>
          ) : (
            <div
              className={`product-cards-container product-cards-container--${viewMode}`}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 19,
                marginRight: "10px",
              }}
            >
              {items.map((item) => {
                const catSlug =
                  !categorySlug &&
                  item.item_category &&
                  item.item_category.length > 0
                    ? item.item_category[0].category_slug
                    : categorySlug;
                return (
                  <ProductCard
                    key={item.id}
                    item={item}
                    categorySlug={catSlug}
                  />
                );
              })}
            </div>
          )}

          {totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}

        </section>
      </div>

    </div>
  );
}