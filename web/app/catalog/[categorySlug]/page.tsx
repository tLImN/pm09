import type { Metadata } from "next";
import { getCategoryBySlug } from "@/lib/api";
import CategoryPageClient from "@/components/CategoryPageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);
  const title = category?.category_title || "Категория";

  return {
    title,
  };
}

export default function CategoryPage() {
  return <CategoryPageClient />;
}