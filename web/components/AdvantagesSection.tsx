interface AdvantageItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const advantages: AdvantageItem[] = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    title: "15+ лет на рынке",
    description: "Проверенный опыт в сфере складского оборудования и логистических решений.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="var(--accent-color)" strokeWidth="0">
        <path d="M14,12A5,5,0,0,0,14,2H9A1,1,0,0,0,8,3V14H6a1,1,0,0,0,0,2H8v5a1,1,0,0,0,2,0V16h5a1,1,0,0,0,0-2H10V12ZM10,4h4a3,3,0,0,1,0,6H10Z"></path>
      </svg>
    ),
    title: "Гибкая оплата",
    description: "Удобный способ оплаты – рассрочка, лизинг, trade-in старой техники.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    title: "Инженерный подход",
    description: "Проектирование и подбор готовых инженерных решений под ваш склад.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    title: "Сертифицированные специалисты",
    description: "Монтаж и настройка оборудования силами аттестованных инженеров.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    title: "Собственный сервисный центр",
    description: "Плановое и внеплановое ТО, диагностика, срочный выезд при поломке.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Прямые контракты с производителями",
    description: "Актуальный ассортимент по конкурентным ценам без посредников.",
  },
];

export default function AdvantagesSection() {
  return (
    <section className="py-[33px] px-[100px] max-md:px-5 max-md:py-5">
      <h2 className="text-center text-[2.1875rem] my-[30px] mx-auto font-bold">
        Почему выбирают нас
      </h2>
      <div className="grid grid-cols-3 gap-[30px] p-[30px] max-w-[1440px] mx-auto max-lg:grid-cols-2 max-sm:grid-cols-1 max-md:px-0 max-md:py-5">
        {advantages.map((item, index) => (
          <div
            key={index}
            className="advantage-card flex flex-col items-center text-center gap-[16px] p-[30px] border border-[var(--border-color)] rounded-[5px] transition-all duration-300"
          >
            <div className="flex-shrink-0">{item.icon}</div>
            <h3 className="text-[1.25rem] font-bold">{item.title}</h3>
            <p className="text-[var(--subtext-color)] leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
      <style>{`
        .advantage-card:hover {
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          border-color: var(--accent-color);
        }
      `}</style>
    </section>
  );
}