"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { getCategoryBySlug, getCatalogItems } from "@/lib/api";
import { CatalogItem, Category } from "@/lib/types";
import { formatDescription } from "@/lib/utils";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const categorySlug = params.categorySlug as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [sortBy, setSortBy] = useState("title-asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);

  // Читаем фильтры из URL
  const priceMin = searchParams.get("priceMin") ? Number(searchParams.get("priceMin")) : undefined;
  const priceMax = searchParams.get("priceMax") ? Number(searchParams.get("priceMax")) : undefined;
  const manufacturer = searchParams.get("manufacturer") || undefined;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [cat, itemsData] = await Promise.all([
        getCategoryBySlug(categorySlug),
        getCatalogItems({
          category: categorySlug,
          sort: sortBy,
          page,
          pageSize,
          priceMin,
          priceMax,
          manufacturer,
        }),
      ]);
      setCategory(cat);

      const fetchedItems = itemsData.data || [];
      const fetchedTotal = itemsData.meta?.pagination?.total || 0;

      // Редирект: если в категории только один элемент и это услуга (service)
      if (fetchedTotal === 1 && fetchedItems.length === 1 && fetchedItems[0].item_type === "service" && !priceMin && !priceMax && !manufacturer) {
        setRedirecting(true);
        router.push(`/catalog/${categorySlug}/${fetchedItems[0].item_slug}`);
        return;
      }

      setItems(fetchedItems);
      setTotalPages(itemsData.meta?.pagination?.pageCount || 1);
      setTotal(fetchedTotal);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [categorySlug, sortBy, page, pageSize, router, priceMin, priceMax, manufacturer]);

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

  // description block
  const descriptionHtml = category?.category_description
    ? formatDescription(category.category_description)
    : "";

  return (
    <main style={{ maxWidth: 950, display: "flex", flexDirection: "column", gap: 20, width: "100%" }}>
      <h1 style={{ margin: 0, fontSize: 35, fontWeight: 600 }}>
        {category?.category_title || "Загрузка…"}
      </h1>
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <select value={sortBy} onChange={(e) => handleSortChange(e.target.value)}>
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
      {loading || redirecting ? (
        <p className="loading-status">Загрузка...</p>
      ) : items.length === 0 ? (
        <p className="loading-status">Товары не найдены</p>
      ) : (
        <div className="product-cards-container" style={{ display: "flex", flexDirection: "column", gap: 19, marginRight: "10px" }}>
          {items.map((item) => (
            <ProductCard key={item.id} item={item} categorySlug={categorySlug} />
          ))}
        </div>
      )}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* description block */}
      {descriptionHtml && (
        <>
          <article
            style={{ display: "flex", flexDirection: "column", gap: 10 }}
            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
          />
          <style>{`
              ul {
                list-style: disc;
                margin-left: 2em;
              }
            `}</style>
        </>
      )}
      <style>{`
        @media (max-width: 900px) {
          .product-cards-container {
            margin-right: 0 !important;
          }
        }
      `}</style>
    </main>
  );
}