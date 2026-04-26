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

      <style>{`
        .lightbox-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: lightbox-fade-in 0.2s ease;
        }

        @keyframes lightbox-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .lightbox-content {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .lightbox-image {
          max-width: 90vw;
          max-height: 85vh;
          object-fit: contain;
          border-radius: 4px;
          user-select: none;
        }

        .lightbox-close {
          position: fixed;
          top: 16px;
          right: 24px;
          background: none;
          border: none;
          color: #fff;
          font-size: 40px;
          cursor: pointer;
          line-height: 1;
          padding: 4px 12px;
          border-radius: 4px;
          transition: background 0.2s;
          z-index: 10000;
        }
        .lightbox-close:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .lightbox-arrow {
          position: fixed;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.15);
          border: none;
          color: #fff;
          font-size: 48px;
          cursor: pointer;
          padding: 8px 16px;
          border-radius: 4px;
          transition: background 0.2s;
          line-height: 1;
          z-index: 10000;
        }
        .lightbox-arrow:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        .lightbox-arrow-left {
          left: 16px;
        }
        .lightbox-arrow-right {
          right: 16px;
        }

        .lightbox-counter {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          color: #fff;
          font-size: 16px;
          background: rgba(0, 0, 0, 0.5);
          padding: 6px 16px;
          border-radius: 20px;
          user-select: none;
          z-index: 10000;
        }
      `}</style>
    </div>
  );
}