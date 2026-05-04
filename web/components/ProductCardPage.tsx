"use client";

import { useState } from "react";
import { CatalogItem } from "@/lib/types";
import { getStrapiImageUrl } from "@/lib/utils";
import Button from "@/components/Button";
import ImageLightbox from "@/components/ImageLightbox";

export default function ProductCardPage({ item }: { item: CatalogItem }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handlePopupOpen = () => {
    const requestType = item.item_type === "service" ? "service" : "quote";
    window.dispatchEvent(
      new CustomEvent("open-popup", {
        detail: {
          request_type: requestType,
          page_url: window.location.href,
          documentId: item.documentId,
          item_title: item.item_title,
        },
      })
    );
  };

  const allImages = (item.item_images ?? []).map((img) =>
    getStrapiImageUrl(img.url)
  );
  const images = allImages.length > 0
    ? allImages
    : ["/img/ki_image-placeholder.webp"];

  const [activeIndex, setActiveIndex] = useState(0);
  const currentImage = images[activeIndex] ?? images[0];

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 36,
      }}
      className="product-card-page"
    >
      <div className="product-card-page__gallery">
        <div className="product-card-page__main-image-wrapper">
          <img
            src={currentImage}
            alt={item.item_title}
            className="product-card-page__main-image"
            onClick={() => openLightbox(activeIndex)}
            style={{ cursor: "zoom-in" }}
          />
        </div>

        {images.length > 1 && (
          <div className="product-card-page__thumbnails">
            {images.map((src, i) => (
              <div
                key={i}
                className={`product-card-page__thumbnail ${
                  i === activeIndex ? "product-card-page__thumbnail--active" : ""
                }`}
                onClick={() => setActiveIndex(i)}
              >
                <img src={src} alt={`${item.item_title} — фото ${i + 1}`} />
              </div>
            ))}
          </div>
        )}
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
            Оставить заявку
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

      {lightboxOpen && (
        <ImageLightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onNavigate={(i) => setLightboxIndex(i)}
        />
      )}

    </div>
  );
}