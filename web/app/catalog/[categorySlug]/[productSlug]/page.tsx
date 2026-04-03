import { getCatalogItemBySlug, getRelatedItems, getCategories } from "@/lib/api";
import { formatDescription } from "@/lib/utils";
//import Sidebar from "@/components/Sidebar";
import ProductCardPage from "@/components/ProductCardPage";
import ProductCard from "@/components/ProductCard";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ categorySlug: string; productSlug: string }>;
}) {
  const { categorySlug, productSlug } = await params;

  const [item, categories] = await Promise.all([
    getCatalogItemBySlug(productSlug),
    getCategories(),
  ]);

  if (!item) {
    notFound();
  }

  const relatedItems = item.item_category
    ? await getRelatedItems(item.item_category[0].id, item.id)
    : [];

  const descriptionHtml = item.item_description
    ? formatDescription(item.item_description)
    : "";

  return (
    // <div
    //   style={{
    //     display: "flex",
    //     justifyContent: "center",
    //     padding: "30px 0",
    //     gap: 40,
    //     marginBottom: 40,
    //   }}
    //   className="content-wrapper-aside"
    // >
    //   <Sidebar categories={categories} activeCategorySlug={categorySlug} />
      <main style={{ maxWidth: 950, display: "flex", flexDirection: "column", gap: 20 }}>
        <ProductCardPage item={item} />

        {descriptionHtml && (
          <>
            <h2
              style={{
                textAlign: "left",
                fontSize: 26,
                fontWeight: 600,
                margin: 0,
              }}
            >
              Описание
            </h2>
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

        {relatedItems.length > 0 && (
          <>
            <h2
              style={{
                textAlign: "left",
                fontSize: 26,
                fontWeight: 600,
                margin: 0,
              }}
            >
              Товары из этой категории
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 19 }}>
              {relatedItems.map((relItem) => (
                <ProductCard
                  key={relItem.id}
                  item={relItem}
                  categorySlug={categorySlug}
                />
              ))}
            </div>
          </>
        )}
      </main>
      /* <style>{`
        @media (max-width: 768px) {
          .content-wrapper-aside {
            flex-direction: column !important;
            padding: 20px !important;
          }
        }
      `}</style> */
    // </div>
  );
}