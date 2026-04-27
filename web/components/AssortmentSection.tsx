"use client";

import { useState, useRef, useCallback, useId, useEffect } from "react";
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
  const [isMobile, setIsMobile] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Определяем мобильное устройство
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // На мобильных устройствах показываем адаптивную сетку
  if (isMobile) {
    return (
      <div className="assortment-grid-mobile grid grid-cols-2 gap-4 px-4 max-w-[600px] mx-auto max-[360px]:grid-cols-1">
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

  if (!useCarousel) {
    // Обычный flex-ряд без карусели (для десктопа)
    return (
      <div className="flex justify-center gap-[35px] flex-wrap">
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
    <div className="carousel-wrapper flex items-center gap-[15px] justify-center max-md:gap-[10px]">

      {/* Карусель */}
      <div
        className="assortment-carousel overflow-x-hidden overflow-y-visible max-w-[1400px] py-5 px-[50px] mask-[linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)]"
        ref={scrollContainerRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Лента с карточками — непрерывная CSS-анимация */}
        <div
          className={`carousel-track flex gap-[35px] ${isPaused ? "carousel-track--paused" : ""}`}
        >
          {duplicatedItems.map((item, index) => (
            <div key={index} className="shrink-0">
              <AssortmentCard
                href={item.href}
                imageSrc={item.imageSrc}
                title={item.title}
              />
            </div>
          ))}
        </div>
      </div>

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
      `}</style>
    </div>
  );
}
