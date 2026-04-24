"use client";

import { useState, useRef, useCallback, useId } from "react";
import AssortmentCard from "./AssortmentCard";

interface AssortmentItem {
  href: string;
  imageSrc: string;
  title: string;
}

interface AssortmentSectionProps {
  items: AssortmentItem[];
  carouselThreshold?: number;
  animationDuration?: number; // секунды на один полный цикл
}

export default function AssortmentSection({
  items,
  carouselThreshold = 3,
  animationDuration = 30,
}: AssortmentSectionProps) {
  const useCarousel = items.length > carouselThreshold;
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Ширина одной карточки + gap
  const cardWidth = 401; // 366px карточка + 35px gap

  // Вычисляем сдвиг для одной копи элементов (ширина оригинальных карточек)
  const singleSetWidth = items.length * cardWidth;

  // Генерируем уникальный ID для keyframes (стабильный для SSR)
  const id = useId();
  const animationName = `scroll_${id.replace(/:/g, '')}`;

  const scrollLeft = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" });
    }
  }, [cardWidth]);

  const scrollRight = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
    }
  }, [cardWidth]);

  if (!useCarousel) {
    // Обычный flex-ряд без карусели
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 35,
          flexWrap: "wrap",
        }}
      >
        {items.map((item, index) => (
          <AssortmentCard
            key={index}
            href={item.href}
            imageSrc={item.imageSrc}
            title={item.title}
          />
        ))}
      </div>
    );
  }

  // Непрерывная карусель с автопрокруткой
  // Дублируем элементы для эффекта бесконечной прокрутки
  const duplicatedItems = [...items, ...items, ...items];

  return (
    <div
      className="carousel-wrapper"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 15,
        justifyContent: "center",
      }}
    >

      {/* <button
        onClick={scrollLeft}
        className="carousel-btn carousel-btn--prev"
        aria-label="Прокрутить назад"
        style={{
          flexShrink: 0,
          width: 44,
          height: 44,
          borderRadius: "50%",
          border: "none",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          cursor: "pointer",
          fontSize: 20,
          color: "var(--text-color)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
          zIndex: 2,
        }}
      >
        ‹
      </button> */}

      {/* Карусель */}
      <div
        className="assortment-carousel"
        ref={scrollContainerRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        style={{
          overflowX: "hidden",
          overflowY: "visible",
          maxWidth: 1400,
          padding: "20px 50px",
          maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        {/* Лента с карточками — непрерывная CSS-анимация */}
        <div
          className={`carousel-track ${isPaused ? "carousel-track--paused" : ""}`}
          style={{
            display: "flex",
            gap: 35,
          }}
        >
          {duplicatedItems.map((item, index) => (
            <div key={index} style={{ flexShrink: 0 }}>
              <AssortmentCard
                href={item.href}
                imageSrc={item.imageSrc}
                title={item.title}
              />
            </div>
          ))}
        </div>
      </div>

      {/* <button
        onClick={scrollRight}
        className="carousel-btn carousel-btn--next"
        aria-label="Прокрутить вперёд"
        style={{
          flexShrink: 0,
          width: 44,
          height: 44,
          borderRadius: "50%",
          border: "none",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          cursor: "pointer",
          fontSize: 20,
          color: "var(--text-color)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
          zIndex: 2,
        }}
      >
        ›
      </button> */}

      <style>{`
        @keyframes ${animationName} {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-${singleSetWidth}px);
          }
        }

        .carousel-track {
          animation: ${animationName} ${animationDuration}s linear infinite;
          will-change: transform;
        }

        .carousel-track--paused {
          animation-play-state: paused;
        }

        .carousel-btn:hover {
          background-color: rgba(255, 255, 255, 1) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
        }

        .carousel-btn:active {
          transform: scale(0.95) !important;
        }

        @media (max-width: 768px) {
          .carousel-wrapper {
            gap: 10px !important;
          }
          .carousel-btn {
            width: 36px !important;
            height: 36px !important;
            font-size: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}
