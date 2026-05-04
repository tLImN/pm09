"use client";

import { useEffect, useCallback } from "react";

interface ImageLightboxProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function ImageLightbox({
  images,
  currentIndex,
  onClose,
  onNavigate,
}: ImageLightboxProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && currentIndex > 0) onNavigate(currentIndex - 1);
      if (e.key === "ArrowRight" && currentIndex < images.length - 1)
        onNavigate(currentIndex + 1);
    },
    [currentIndex, images.length, onClose, onNavigate]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose} aria-label="Закрыть">
          ×
        </button>

        {images.length > 1 && currentIndex > 0 && (
          <button
            className="lightbox-arrow lightbox-arrow-left"
            onClick={() => onNavigate(currentIndex - 1)}
            aria-label="Предыдущее фото"
          >
            ‹
          </button>
        )}

        <img
          src={images[currentIndex]}
          alt={`Фото ${currentIndex + 1}`}
          className="lightbox-image"
        />

        {images.length > 1 && currentIndex < images.length - 1 && (
          <button
            className="lightbox-arrow lightbox-arrow-right"
            onClick={() => onNavigate(currentIndex + 1)}
            aria-label="Следующее фото"
          >
            ›
          </button>
        )}

        {images.length > 1 && (
          <div className="lightbox-counter">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

    </div>
  );
}