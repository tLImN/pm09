import Link from "next/link";
import { getContactPage } from "@/lib/api";

export default async function Footer() {
  const contact = await getContactPage();

  const phone = contact?.phone || "+7 (905) 617-98-52";
  const email = contact?.email || "info@aforklift.ru";
  const address =
    contact?.address ||
    "600033, Владимирская область, город Владимир, Мещёрская ул., д. 4, офис 36";

  return (
    <footer
      style={{
        backgroundColor: "var(--text-color)",
        color: "var(--inverted-text-color)",
        padding: "20px 0",
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
      <div
        id="footer-columns"
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 47,
        }}
      >
        <div className="footer-column" style={{ flex: 1 }}>
          <span style={{ fontSize: 26, fontWeight: 700, display: "block", margin: "1em 0" }}>Информация</span>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              display: "flex",
              flexDirection: "column",
              marginLeft: 0,
              gap: 10,
            }}
          >
            <li>
              <Link href="/about" style={{ color: "var(--inverted-text-color)" }}>
                О нас
              </Link>
            </li>
            <li>
              <Link href="/contacts" style={{ color: "var(--inverted-text-color)" }}>
                Контакты
              </Link>
            </li>
            <li>
              <Link href="/licenses" style={{ color: "var(--inverted-text-color)" }}>
                Политика обработки персональных данных
              </Link>
            </li>
          </ul>
        </div>
        <div className="footer-column" style={{ flex: 1 }}>
          <span style={{ fontSize: 26, fontWeight: 700, display: "block", margin: "1em 0" }}>Каталог</span>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              display: "flex",
              flexDirection: "column",
              marginLeft: 0,
              gap: 10,
            }}
          >
            <li>
              <Link href="/catalog/1-stellazhi-dlya-sklada" style={{ color: "var(--inverted-text-color)" }}>
                Стеллажи для склада
              </Link>
            </li>
            <li>
              <Link href="/catalog/2-spectehnika" style={{ color: "var(--inverted-text-color)" }}>
                Спецтехника
              </Link>
            </li>
            <li>
              <Link href="/catalog/3-uslugi" style={{ color: "var(--inverted-text-color)" }}>
                Услуги
              </Link>
            </li>
          </ul>
        </div>
        <div className="footer-column" style={{ flex: 1 }}>
          <span style={{ fontSize: 26, fontWeight: 700, display: "block", margin: "1em 0" }}>Наши контакты</span>
          <address
            style={{
              fontStyle: "normal",
            }}
          >
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                display: "flex",
                flexDirection: "column",
                marginLeft: 0,
                gap: 10,
              }}
            >
              <li>
                <a
                  href={`tel:${phone.replace(/[\s\-\(\)]/g, "")}`}
                  style={{ color: "var(--inverted-text-color)" }}
                >
                  {phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  style={{ color: "var(--inverted-text-color)" }}
                >
                  {email}
                </a>
              </li>
              <li>{address}</li>
            </ul>
          </address>
        </div>
      </div>
      <span
        id="copyright"
        className="block text-left mt-5"
      >
        © «Альтернатива Форклифт» {new Date().getFullYear()}<br />
        Информация на сайте имеет исключительно информационный характер и не может быть определена как публичная оферта ни при каких обстоятельствах.
      </span>
      </div>
    </footer>
  );
}