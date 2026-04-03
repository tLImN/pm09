"use client";

import { CatalogItem } from "@/lib/types";
import { getStrapiImageUrl } from "@/lib/utils";

export default function ProductCardPage({ item }: { item: CatalogItem }) {
  const handlePopupOpen = () => {
    window.dispatchEvent(new CustomEvent("open-popup"));
  };

  const imageUrl =
    item.item_images?.[0]?.url
      ? getStrapiImageUrl(item.item_images[0].url)
      : "/img/no-picture.jpg";

  return (
    <div
      style={{
        paddingRight: 20,
        display: "flex",
        gap: 36,
      }}
      className="product-card-page"
    >
      <div
        style={{
          minWidth: 406,
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
          <button onClick={handlePopupOpen} style={{ width: "fit-content" }}>
            Уточнить цену
          </button>
          <span style={{ color: "var(--subtext-color)" }}>
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
      `}</style>
    </div>
  );
}