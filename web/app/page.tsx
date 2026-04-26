"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getHomePageData } from "@/lib/api";
//import { getStrapiImageUrl } from "@/lib/utils";
import { CatalogItem } from "@/lib/types";
import HeroBanner from "@/components/HeroBanner";
import DetailsItem from "@/components/DetailsItem";
import AssortmentSection from "@/components/AssortmentSection";
import Button from "@/components/Button";

export default function Home() {
  const [items, setItems] = useState<CatalogItem[]>([]);

  useEffect(() => {
    getHomePageData().then((data) => setItems(data.items));
  }, []);

  const handlePopupOpen = () => {
    window.dispatchEvent(new CustomEvent("open-popup"));
  };

  return (
    <>
      <HeroBanner
        title="Функциональные решения для вашего склада"
        subtitle="ООО «Альтернатива Форклифт» предлагаем проверенное оборудование от надёжных производителей, индивидуальный подбор решений и полный цикл сопровождения."
        backgroundImage="/img/banner-background.webp"
      >
        <Link href="/catalog">
          <Button>Перейти в каталог</Button>
        </Link>
      </HeroBanner>

      <section style={{ padding: "33px 100px" }}>
        <h2 style={{ textAlign: "center", fontSize: "2.1875rem", margin: "30px auto" }}>
          Ассортимент
        </h2>
        <AssortmentSection
          items={[
            {
              href: "./catalog/1-stellazhi-dlya-sklada",
              imageSrc: "/img/ki_assortment_stellazhi-dlya-sklada.webp",
              title: "Стеллажи для склада",
            },
            {
              href: "./catalog/pogruzchiki",
              imageSrc: "/img/ki_assortment_pogruzchiki.webp",
              title: "Погрузчики",
            },
            {
              href: "./catalog/shtabelery",
              imageSrc: "/img/ki_assortment_shtabelery.webp",
              title: "Штабелеры",
            },
            {
              href: "./catalog/gidravlicheskie-telezhki",
              imageSrc: "/img/ki_assortment_girdravlicheskiye-telezhki.webp",
              title: "Гидравлические тележки",
            },
          ]}
        />
      </section>

      <section style={{ padding: "33px 100px" }}>
        <h2 style={{ textAlign: "center", fontSize: "2.1875rem", margin: "30px auto" }}>
          Часто задаваемые вопросы
        </h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 35,
            padding: "30px",
            maxWidth: 1440,
            margin: "0 auto"
          }}
        >
          <DetailsItem question="Какие гарантии предоставляются на складскую технику?">
            Стандартный гарантийный срок — 1 год. При заключении договора на
            техническое обслуживание гарантия продлевается.
          </DetailsItem>
          <DetailsItem question="Какие варианты оплаты доступны?">
            Основной способ оплаты — 100 % безналичный расчёт по выставленному
            счёту. Для постоянных клиентов возможны индивидуальные условия.
          </DetailsItem>
          <DetailsItem question="Есть ли бесплатная доставка?">
            Да. Доставка оборудования по г. Владимиру и Владимирской области
            осуществляется бесплатно. Для других регионов стоимость
            рассчитывается индивидуально с учётом расстояния, габаритов и веса
            груза.
          </DetailsItem>
          <DetailsItem question="Предоставляете ли вы услуги по монтажу и настройке оборудования?">
            Да. Мы предлагаем полный цикл работ: выезд инженера для осмотра
            помещения; проектирование складского пространства; установка
            стеллажных систем и настройка погрузочной техники. Все работы
            выполняются сертифицированными специалистами.
          </DetailsItem>
          <DetailsItem question="Оказываете ли вы техническое обслуживание и ремонт?">
            Абсолютно. Наш сервисный центр обеспечивает: плановое и
            внеплановое ТО; диагностику и ремонт узлов и агрегатов; срочный
            выезд техника при поломке на складе клиента. Работаем как с
            оборудованием, приобретённым у нас, так и с техникой сторонних
            поставщиков.
          </DetailsItem>
          <span>
            Не нашли ответ на свой вопрос?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePopupOpen();
              }}
              style={{ cursor: "pointer" }}
            >
              Оставьте заявку
            </a>
            , и наш специалист свяжется и ответит на ваш вопрос.
          </span>
        </div>
      </section>
      <style>{`
        @media (max-width: 768px) {
          section {
            padding: 20px !important;
          }
          section > div:last-child {
            padding: 20px 0 !important;
          }
        }
      `}</style>
    </>
  );
}