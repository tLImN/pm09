"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getCatalogItems } from "@/lib/api";
import { CatalogItem } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import JsonLdBreadcrumbs from "@/components/JsonLdBreadcrumbs";

export default function CatalogPage() {
  return (
    <Suspense fallback={<p className="loading-status">Загрузка...</p>}>
      <CatalogInner />
    </Suspense>
  );
}

function CatalogInner() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [sortBy, setSortBy] = useState("title-asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Читаем фильтры из URL
  const priceMin = searchParams.get("priceMin") ? Number(searchParams.get("priceMin")) : undefined;
  const priceMax = searchParams.get("priceMax") ? Number(searchParams.get("priceMax")) : undefined;
  const manufacturer = searchParams.get("manufacturer") || undefined;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const itemsData = await getCatalogItems({
        sort: sortBy,
        page,
        pageSize,
        priceMin,
        priceMax,
        manufacturer,
        itemType: "product",
      });
      setItems(itemsData.data || []);
      setTotalPages(itemsData.meta?.pagination?.pageCount || 1);
      setTotal(itemsData.meta?.pagination?.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [sortBy, page, pageSize, priceMin, priceMax, manufacturer]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Сбрасываем страницу при изменении фильтров в URL
  useEffect(() => {
    setPage(1);
  }, [priceMin, priceMax, manufacturer]);

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

  return (
    <>
      <JsonLdBreadcrumbs
        items={[
          { name: "Главная", url: "/" },
          { name: "Каталог", url: "/catalog" },
        ]}
      />
    <section style={{ maxWidth: 950, display: "flex", flexDirection: "column", gap: 20, width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginRight: 10 }}>
        <h1 style={{ margin: 0, fontSize: 35, fontWeight: 600 }}>Каталог</h1>
        <SearchBar />
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
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
      </div>
      {loading ? (
        <p className="loading-status">Загрузка...</p>
      ) : items.length === 0 ? (
        <p className="loading-status">Товары не найдены</p>
      ) : (
        <div className="product-cards-container" style={{ display: "flex", flexDirection: "column", gap: 19, marginRight: "10px" }}>
          {items.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      )}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </section>
    </>
  );
}
