import Link from "next/link";
import HeroBanner from "@/components/HeroBanner";
import DetailsItem from "@/components/DetailsItem";
import AssortmentSection from "@/components/AssortmentSection";
import Button from "@/components/Button";
import PopupTrigger from "@/components/PopupTrigger";

export default function Home() {
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

      <section className="py-[33px] px-[100px] max-md:px-5 max-md:py-5">
        <h2 className="text-center text-[2.1875rem] my-[30px] mx-auto font-bold">
          Часто задаваемые вопросы
        </h2>
        <div className="flex flex-col gap-[35px] p-[30px] max-w-[1440px] mx-auto max-md:px-0 max-md:py-5">
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
            <PopupTrigger>Оставьте заявку</PopupTrigger>
            , и наш специалист свяжется и ответит на ваш вопрос.
          </span>
        </div>
      </section>
    </>
  );
}