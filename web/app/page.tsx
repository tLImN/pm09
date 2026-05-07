export const dynamic = "force-dynamic";

import Link from "next/link";
import HeroBanner from "@/components/HeroBanner";
import AdvantagesSection from "@/components/AdvantagesSection";
import DetailsItem from "@/components/DetailsItem";
import AssortmentSection from "@/components/AssortmentSection";
import Button from "@/components/Button";
import PopupTrigger from "@/components/PopupTrigger";
import { getFaqPage } from "@/lib/api";
import { FaqItem } from "@/lib/types";

const FALLBACK_FAQ_ITEMS: FaqItem[] = [
  {
    id: 1,
    question: "Какие гарантии предоставляются на складскую технику?",
    answer:
      "Стандартный гарантийный срок — 1 год. При заключении договора на техническое обслуживание гарантия продлевается.",
  },
  {
    id: 2,
    question: "Какие варианты оплаты доступны?",
    answer:
      "Основной способ оплаты — 100 % безналичный расчёт по выставленному счёту. Для постоянных клиентов возможны индивидуальные условия.",
  },
  {
    id: 3,
    question: "Есть ли бесплатная доставка?",
    answer:
      "Да. Доставка оборудования по г. Владимиру и Владимирской области осуществляется бесплатно. Для других регионов стоимость рассчитывается индивидуально с учётом расстояния, габаритов и веса груза.",
  },
  {
    id: 4,
    question:
      "Предоставляете ли вы услуги по монтажу и настройке оборудования?",
    answer:
      "Да. Мы предлагаем полный цикл работ: выезд инженера для осмотра помещения; проектирование складского пространства; установка стеллажных систем и настройка погрузочной техники. Все работы выполняются сертифицированными специалистами.",
  },
  {
    id: 5,
    question: "Оказываете ли вы техническое обслуживание и ремонт?",
    answer:
      "Абсолютно. Наш сервисный центр обеспечивает: плановое и внеплановое ТО; диагностику и ремонт узлов и агрегатов; срочный выезд техника при поломке на складе клиента. Работаем как с оборудованием, приобретённым у нас, так и с техникой сторонних поставщиков.",
  },
];

export default async function Home() {
  const faqData = await getFaqPage();
  const faqItems = faqData?.faq_items?.length
    ? faqData.faq_items
    : FALLBACK_FAQ_ITEMS;

  return (
    <>
      <HeroBanner
        title="Функциональные решения для вашего склада"
        subtitle="ООО «Альтернатива Форклифт» предлагаем проверенное оборудование от надёжных производителей, индивидуальный подбор решений и полный цикл сопровождения."
        backgroundImage="/img/banner-background.webp"
      >
        <Button href="/catalog">Перейти в каталог</Button>
      </HeroBanner>

      <section className="py-[33px] px-[100px] max-md:px-5 max-md:py-5">
        <h2 className="text-center text-[2.1875rem] my-[30px] mx-auto font-bold">
          Ассортимент
        </h2>
        <AssortmentSection
          items={[
            {
              href: "/catalog/1-stellazhi-dlya-sklada",
              imageSrc: "/img/ki_assortment_stellazhi-dlya-sklada.webp",
              title: "Стеллажи для склада",
            },
            {
              href: "/catalog/pogruzchiki",
              imageSrc: "/img/ki_assortment_pogruzchiki.webp",
              title: "Погрузчики",
            },
            {
              href: "/catalog/shtabelery",
              imageSrc: "/img/ki_assortment_shtabelery.webp",
              title: "Штабелеры",
            },
            {
              href: "/catalog/gidravlicheskie-telezhki",
              imageSrc: "/img/ki_assortment_girdravlicheskiye-telezhki.webp",
              title: "Гидравлические тележки",
            },
          ]}
        />
      </section>

      <AdvantagesSection />

      <section className="py-[33px] px-[100px] max-md:px-5 max-md:py-5">
        <h2 className="text-center text-[2.1875rem] my-[30px] mx-auto font-bold">
          Часто задаваемые вопросы
        </h2>
        <div className="flex flex-col gap-[35px] p-[30px] max-w-[1440px] mx-auto max-md:px-0 max-md:py-5">
          {faqItems.map((item) => (
            <DetailsItem key={item.id} question={item.question}>
              {item.answer}
            </DetailsItem>
          ))}
          <span>
            Не нашли ответ на свой вопрос?{" "}
            <PopupTrigger>Оставьте заявку</PopupTrigger>
            , и наш специалист свяжется и ответит на ваш вопрос.
          </span>
        </div>
      </section>
    </>
  );
}