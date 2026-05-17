import type { Metadata } from "next";
import CatalogPageClient from "@/components/CatalogPageClient";

export const metadata: Metadata = {
  title: "Каталог",
};

export default function CatalogPage() {
  return <CatalogPageClient />;
}