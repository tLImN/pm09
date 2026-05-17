import "./globals.css";
import "@/styles/layout.css";
import "@/styles/components.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PopupForm from "@/components/PopupForm";

export const metadata: Metadata = {
  title: {
    default: "Альтернатива Форклифт — складское оборудование и техника",
    template: "%s — Альтернатива Форклифт",
  },
  description:
    "ООО «Альтернатива Форклифт» — надёжный поставщик складского оборудования и техники. Стеллажи, погрузчики, штабелеры, гидравлические тележки. Доставка по Владимиру и области.",
  openGraph: {
    title: "Альтернатива Форклифт — складское оборудование и техника",
    description:
      "Проверенное оборудование от надёжных производителей, индивидуальный подбор решений и полный цикл сопровождения.",
    locale: "ru_RU",
    type: "website",
    siteName: "Альтернатива Форклифт",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head></head>
      <body className="min-h-screen flex flex-col overflow-y-scroll">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <PopupForm />
      </body>
    </html>
  );
}