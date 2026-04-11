"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getHomePageData } from "@/lib/api";
//import { getStrapiImageUrl } from "@/lib/utils";
import { CatalogItem } from "@/lib/types";
import DetailsItem from "@/components/DetailsItem";

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
      <section
        id="banner"
        style={{
          backgroundColor: "var(--text-color)",
          backgroundImage: "url(/img/banner-background.png)",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          height: 453,
          color: "var(--inverted-text-color)",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(26, 23, 27, 0.8)",
            height: "100%",
          }}
        >
          <div
            style={{
              padding: "30px 100px",
              maxWidth: 1440,
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "baseline",
              justifyContent: "center",
              gap: 30,
              height: "100%",
            }}
          >
            <h1 style={{ fontSize: "4rem", margin: 7, maxWidth: 884 }}>
              Функциональные решения для вашего склада
            </h1>
            <p
              style={{
                fontSize: "1.375rem",
                margin: 7,
                maxWidth: 1200,
              }}
            >
              ООО «Альтернатива Форклифт» предлагаем проверенное оборудование от
              надёжных производителей, индивидуальный подбор решений и полный цикл
              сопровождения.
            </p>
            <Link href="/catalog">
              <button>Перейти в каталог</button>
            </Link>
          </div>
        </div>
      </section>

      <section style={{ padding: "33px 100px" }}>
        <h2 style={{ textAlign: "center", fontSize: "2.1875rem", margin: "30px auto" }}>
          Ассортимент
        </h2>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 35,
            flexWrap: "wrap",
          }}
        >
          <Link href="./catalog/1-stellazhi-dlya-sklada" style={{ color: "var(--text-color)" }}>
            <div className="h-[336px] w-[366px] text-center flex flex-col gap-[24px] text-[1.625rem]">
              <div className="image-container"
                style={{
                  border: "1px solid var(--border-color)",
                  height: 257,
                  borderRadius: 5,
                  overflow: "clip",
                }}
              >
                <img
                  src="/img/stelazh-fl-900.jpg"
                  style={{
                    width: "100%",
                    height: "100%",
                    maxWidth: "fit-content",
                    maxHeight: "fit-content",
                    margin: "0 auto",
                    padding: 15,
                  }}
                />
              </div>
              <span>Стеллажи для склада</span>
            </div>
          </Link>
          <Link href="./catalog/pogruzchiki" style={{ color: "var(--text-color)" }}>
            <div className="h-[336px] w-[366px] text-center flex flex-col gap-[24px] text-[1.625rem]">
              <div className="image-container"
                style={{
                  border: "1px solid var(--border-color)",
                  height: 257,
                  borderRadius: 5,
                  overflow: "clip",
                }}
              >
                <img
                  src="/img/pogruzchik-teu-fb18.jpg"
                  style={{
                    width: "100%",
                    height: "100%",
                    maxWidth: "fit-content",
                    maxHeight: "fit-content",
                    margin: "0 auto",
                    padding: 15,
                  }}
                />
              </div>
              <span>Погрузчики</span>
            </div>
          </Link>
          <Link href="./catalog/shtabelery" style={{ color: "var(--text-color)" }}>
            <div className="h-[336px] w-[366px] text-center flex flex-col gap-[24px] text-[1.625rem]">
              <div className="image-container"
                style={{
                  border: "1px solid var(--border-color)",
                  height: 257,
                  borderRadius: 5,
                  overflow: "clip",
                }}
              >
                <img
                  src="/img/1766672410.png"
                  style={{
                    width: "100%",
                    height: "100%",
                    maxWidth: "fit-content",
                    maxHeight: "fit-content",
                    margin: "0 auto",
                    padding: 15,
                  }}
                />
              </div>
              <span>Штабелеры</span>
            </div>
          </Link>
        </div>
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
            padding: "33px 160px",
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
          #banner h1 {
            font-size: 2rem !important;
          }
          #banner > div > div {
            padding: 30px 20px !important;
          }
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