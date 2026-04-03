"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { getCategories } from "@/lib/api";
import { Category } from "@/lib/types";
import Sidebar from "@/components/Sidebar";

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
  const activeCategorySlug = pathname.split("/catalog/")[1] || undefined;

  // Загружаем категории один раз при монтировании layout
  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "30px 0",
        gap: 40,
        marginBottom: 40,
      }}
      className="content-wrapper-aside"
    >
      <Sidebar categories={categories} activeCategorySlug={activeCategorySlug} />
      {children}
      <style>{`
        @media (max-width: 768px) {
          .content-wrapper-aside {
            flex-direction: column !important;
            padding: 20px !important;
          }
        }
      `}</style>
    </div>
  );
}