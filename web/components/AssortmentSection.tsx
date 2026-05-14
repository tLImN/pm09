"use client";

import { useState, useRef, useEffect } from "react";
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
  const [isMobile, setIsMobile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // === Единое состояние позиции ===
  const positionRef = useRef(0); // текущая позиция в пикселях

  // === Состояние drag ===
  const dragActiveRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartPosRef = useRef(0);
  const didDragRef = useRef(false);
  const dragHistoryRef = useRef<{ x: number; t: number }[]>([]);

  // === Состояние инерции ===
  // Положительная скорость = движение влево (auto-scroll направление)
  // Отрицательная = движение вправо
  const momentumRef = useRef(0);

  // Определяем мобильное устройство
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Ширина одной карточки + gap
  const cardWidth = 401; // 366px карточка + 35px gap
  const singleSetWidth = items.length * cardWidth;
  const autoSpeed = singleSetWidth / (animationDuration * 1000); // px/ms

  // === Единый RAF-цикл ===
  useEffect(() => {
    if (!useCarousel) return;

    let animId: number;
    let prevTime: number | null = null;

    const tick = (now: number) => {
      if (prevTime !== null) {
        const dt = now - prevTime;

        if (!dragActiveRef.current) {
          // Определяем скорость для этого кадра
          const mv = momentumRef.current;
          let speed: number;

          if (Math.abs(mv) > autoSpeed) {
            // Есть значительная инерция — используем её и затухаем
            speed = mv;
            // Затухание с учётом dt (нормализуем к 16.67мс)
            const factor = Math.pow(0.97, dt / 16.67);
            const newMv = mv * factor;
            // Если затухли до autoSpeed или пересекли ноль — обнуляем
            if (Math.abs(newMv) <= autoSpeed) {
              momentumRef.current = 0;
            } else {
              momentumRef.current = newMv;
            }
          } else if (mv < 0 && Math.abs(mv) > 0.001) {
            // Малая отрицательная инерция (после drag вправо) — затухаем к 0
            speed = mv;
            const factor = Math.pow(0.97, dt / 16.67);
            const newMv = mv * factor;
            if (Math.abs(newMv) < 0.001) {
              momentumRef.current = 0;
            } else {
              momentumRef.current = newMv;
            }
          } else {
            // Нет инерции — авто-прокрутка
            speed = autoSpeed;
            momentumRef.current = 0;
          }

          positionRef.current = (positionRef.current + speed * dt + singleSetWidth) % singleSetWidth;
        }

        // Применяем позицию к DOM
        if (trackRef.current) {
          trackRef.current.style.transform = `translateX(${-positionRef.current}px)`;
        }
      }

      prevTime = now;
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [useCarousel, singleSetWidth, autoSpeed]);

  // === Обработчики drag (десктоп + тач) ===
  useEffect(() => {
    const container = carouselRef.current;
    if (!useCarousel || !container) return;

    // --- общая логика старта/движения/финиша ---
    const startDrag = (clientX: number) => {
      dragActiveRef.current = true;
      didDragRef.current = false;
      dragStartXRef.current = clientX;
      dragStartPosRef.current = positionRef.current;
      dragHistoryRef.current = [{ x: clientX, t: Date.now() }];
      momentumRef.current = 0;
    };

    const moveDrag = (clientX: number) => {
      if (!dragActiveRef.current) return;

      const dx = clientX - dragStartXRef.current;

      if (!didDragRef.current && Math.abs(dx) < 5) return;

      if (!didDragRef.current) {
        didDragRef.current = true;
        setIsDragging(true);
      }

      const newPos = dragStartPosRef.current - dx;
      positionRef.current = ((newPos % singleSetWidth) + singleSetWidth) % singleSetWidth;

      dragHistoryRef.current.push({ x: clientX, t: Date.now() });
      if (dragHistoryRef.current.length > 10) {
        dragHistoryRef.current.shift();
      }
    };

    const endDrag = () => {
      if (!dragActiveRef.current) return;

      dragActiveRef.current = false;
      setIsDragging(false);

      if (didDragRef.current) {
        const hist = dragHistoryRef.current;
        if (hist.length >= 2) {
          const recent = hist.slice(-5);
          const dt = (recent[recent.length - 1].t - recent[0].t) || 1;
          const dx = recent[recent.length - 1].x - recent[0].x;
          const velocity = -dx / dt;
          if (Math.abs(velocity) > 0.001) {
            momentumRef.current = velocity;
          }
        }
      }
    };

    // --- Mouse-обработчики ---
    let onMouseMoveRef: ((e: MouseEvent) => void) | null = null;
    let onMouseUpRef: (() => void) | null = null;

    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      startDrag(e.clientX);

      onMouseMoveRef = (ev: MouseEvent) => {
        ev.preventDefault();
        moveDrag(ev.clientX);
      };
      onMouseUpRef = () => {
        endDrag();
        if (onMouseMoveRef) document.removeEventListener("mousemove", onMouseMoveRef);
        if (onMouseUpRef) document.removeEventListener("mouseup", onMouseUpRef);
        onMouseMoveRef = null;
        onMouseUpRef = null;
      };

      document.addEventListener("mousemove", onMouseMoveRef, { passive: false });
      document.addEventListener("mouseup", onMouseUpRef);
    };

    // --- Touch-обработчики ---
    let onTouchMoveRef: ((e: TouchEvent) => void) | null = null;
    let onTouchEndRef: (() => void) | null = null;

    const onTouchStart = (e: TouchEvent) => {
      startDrag(e.touches[0].clientX);

      onTouchMoveRef = (ev: TouchEvent) => {
        ev.preventDefault(); // предотвращает нативную прокрутку страницы
        moveDrag(ev.touches[0].clientX);
      };
      onTouchEndRef = () => {
        endDrag();
        document.removeEventListener("touchmove", onTouchMoveRef!);
        document.removeEventListener("touchend", onTouchEndRef!);
        onTouchMoveRef = null;
        onTouchEndRef = null;
      };

      document.addEventListener("touchmove", onTouchMoveRef, { passive: false });
      document.addEventListener("touchend", onTouchEndRef);
    };

    // Предотвращение перехода по ссылке при drag
    const preventDragClick = (e: MouseEvent) => {
      if (didDragRef.current) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    container.addEventListener("mousedown", onMouseDown);
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("click", preventDragClick, { capture: true });

    return () => {
      container.removeEventListener("mousedown", onMouseDown);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("click", preventDragClick, { capture: true });
      if (onMouseMoveRef) document.removeEventListener("mousemove", onMouseMoveRef);
      if (onMouseUpRef) document.removeEventListener("mouseup", onMouseUpRef);
      if (onTouchMoveRef) document.removeEventListener("touchmove", onTouchMoveRef);
      if (onTouchEndRef) document.removeEventListener("touchend", onTouchEndRef);
    };
  }, [useCarousel, isMobile, singleSetWidth]);

  // На мобильных устройствах показываем адаптивную сетку
  if (isMobile) {
    return (
      <div className="assortment-grid-mobile grid grid-cols-2 gap-2 px-4 max-w-[600px] mx-auto max-[315px]:grid-cols-1">
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
        className={`assortment-carousel overflow-x-hidden overflow-y-visible max-w-[1400px] py-5 px-[50px] mask-[linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)] ${isDragging ? "carousel--dragging" : ""}`}
        ref={carouselRef}
      >
        {/* Лента с карточками — JS-управляемая позиция */}
        <div
          className="carousel-track flex gap-[35px]"
          ref={trackRef}
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

    </div>
  );
}