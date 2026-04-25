import Link from "next/link";
import { CatalogItem } from "@/lib/types";
import { getStrapiImageUrl } from "@/lib/utils";
import Button from "@/components/Button";

export default function ProductCard({
  item,
  categorySlug,
}: {
  item: CatalogItem;
  categorySlug?: string;
}) {
  const imageUrl =
    item.item_images?.[0]?.url
      ? getStrapiImageUrl(item.item_images[0].url)
      : "/img/ki_image-placeholder.webp";

  const href = categorySlug
    ? `/catalog/${categorySlug}/${item.item_slug}`
    : `/catalog/item/${item.item_slug}`;

  return (
    <div
      className="product-card"
      style={{
        border: "1px solid var(--border-color)",
        borderRadius: 5,
        paddingRight: 20,
        height: 180,
        display: "flex",
        gap: 18,
      }}
    >
      <div
        className="image-container"
        style={{
          maxHeight: 180,
          width: 231,
          margin: 0,
          outline: "1px solid var(--border-color)",
          borderBottomLeftRadius: 5,
          borderTopLeftRadius: 5,
          flexShrink: 0,
          overflow: "hidden"
        }}
      >
        <Link href={href}><img
          src={imageUrl}
          alt={item.item_title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        /></Link>
      </div>
      <div
        className="card-info-wrapper"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          padding: "10px 0",
          justifyContent: "space-between",
          flexGrow: 1,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <Link href={href}
            style={{
              fontSize: 26,
              fontWeight: 600,
              margin: 0,
              lineHeight: 1.2,
              color: "var(--text-color)"
            }}
          >
            {item.item_title}
          </Link>
          {item.item_manufacturer && (
            <p style={{ margin: 0, color: "var(--subtext-color)" }}>
              Страна производителя: {item.item_manufacturer}
            </p>
          )}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 20,
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {item.item_price && item.item_price > 0 && (
              <span style={{ fontSize: 20, fontWeight: 600 }}>
                от {Number(item.item_price).toLocaleString("ru-RU")} ₽
              </span>
            )}
            <span style={{ color: "var(--subtext-color)" }}>
              Позвоните, чтобы уточнить цену
            </span>
          </div>
          <Link href={href}>
            <Button>Подробнее</Button>
          </Link>
        </div>
      </div>
      <style>{`
        @media (max-width: 876px) {
          .product-card {
            flex-direction: column !important;
            height: auto !important;
            padding-right: 0 !important;
          }
          .card-info-wrapper {
            margin-left: 10px;
            margin-right: 10px;
          }
          .product-card .image-container {
            width: 100% !important;
            height: 200px !important;
            border-bottom-left-radius: 0 !important;
            border-top-right-radius: 5px !important;
          }
        }
      `}</style>
    </div>
  );
}