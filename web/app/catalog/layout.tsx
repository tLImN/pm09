"use client";

import { Suspense, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { getCategories } from "@/lib/api";
import { Category } from "@/lib/types";
import Sidebar from "@/components/Sidebar";
import FilterPanel from "@/components/FilterPanel";

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const pathname = usePathname();

  // Определяем активный slug из URL
  // /catalog → undefined
  // /catalog/pogruzchiki → "pogruzchiki"
  // /catalog/pogruzchiki/dizelnye → "dizelnye" (категория)
  // /catalog/pogruzchiki/dizelnye/produkt-slug → "dizelnye" (товар → категория)
  const pathAfterCatalog = pathname.split("/catalog/")[1] || "";
  const pathSegments = pathAfterCatalog.split("/").filter(Boolean);
  // Если 2+ сегментов — это страница товара/услуги
  // Если 1 сегмент — это категория
  // Если 0 сегментов — главная страница каталога
  const isProductPage = pathSegments.length >= 2;
  const activeCategorySlug = pathSegments[0] || undefined;

  // Загружаем категории один раз при монтировании layout
  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

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
        <Sidebar categories={categories} activeCategorySlug={activeCategorySlug} />
        {!isProductPage && (
          <Suspense fallback={null}>
            <FilterPanel categorySlug={activeCategorySlug} />
          </Suspense>
        )}
      </div>
      {children}
      <style>{`
        @media (max-width: 1366px) {
          .sidebar-filters-column {
            margin-left: 10px;
          }
        }
        @media (max-width: 900px) {
          .content-wrapper-aside {
            flex-direction: column !important;
          }
          .sidebar-filters-column {
            width: 100% !important;
            min-width: 0 !important;
            margin-left: 0;
          }
        }
      `}</style>
    </div>
    </div>
  );
}