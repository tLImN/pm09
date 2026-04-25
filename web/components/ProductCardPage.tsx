"use client";

import { CatalogItem } from "@/lib/types";
import { getStrapiImageUrl } from "@/lib/utils";
import Button from "@/components/Button";

export default function ProductCardPage({ item }: { item: CatalogItem }) {
  const handlePopupOpen = () => {
    window.dispatchEvent(new CustomEvent("open-popup"));
  };

  const imageUrl =
    item.item_images?.[0]?.url
      ? getStrapiImageUrl(item.item_images[0].url)
      : "/img/ki_image-placeholder.webp";

  return (
    <div
      style={{
        display: "flex",
        gap: 36,
      }}
      className="product-card-page"
    >
      <div
        style={{
          height: 406,
          border: "1px solid var(--border-color)",
          borderRadius: 5,
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
          overflow: "hidden"
        }}
      >
        <img
          src={imageUrl}
          alt={item.item_title}
          style={{
            width: "100%",
            maxWidth: 406,
            zIndex: -1,
            height: "fit-content",
            objectFit: "cover",
            margin: "0 auto"
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 40,
          justifyContent: "flex-start",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 35,
              fontWeight: 600,
            }}
          >
            {item.item_title}
          </h1>
          {item.item_manufacturer && (
            <p style={{ margin: 0 }}>Производитель: {item.item_manufacturer}</p>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
          {item.item_price && item.item_price > 0 && (
            <span style={{ fontSize: 35, fontWeight: 600 }}>
              от {Number(item.item_price).toLocaleString("ru-RU")} ₽
            </span>
          )}
          <Button onClick={handlePopupOpen} style={{ width: "fit-content" }}>
            Уточнить цену
          </Button>
          <span style={{ 
            color: "var(--subtext-color)",
            paddingRight: 20 
            }}>
            С подробной информацией об условиях сотрудничества можете
            ознакомиться в разделе «Доставка и оплата».
          </span>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .product-card-page {
            flex-direction: column !important;
            gap: 20px !important;
          }
          .product-card-page > div:first-child {
            min-width: auto !important;
            width: 100% !important;
            height: auto !important;
          }
        }
        @media (max-width: 1000px) {
          .product-card-page > div:first-child {
            flex-shrink: 0.2 !important;
          }
        }
      `}</style>
    </div>
  );
}