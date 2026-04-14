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
        padding: "20px 76px",
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
        <div className="footer-column" style={{ width: 398 }}>
          <h3 style={{ fontSize: 26, margin: "1em 0" }}>Информация</h3>
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
        <div className="footer-column" style={{ width: 398 }}>
          <h3 style={{ fontSize: 26, margin: "1em 0" }}>Каталог</h3>
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
              <Link href="/catalog" style={{ color: "var(--inverted-text-color)" }}>
                Стеллажи для склада
              </Link>
            </li>
            <li>
              <Link href="/catalog" style={{ color: "var(--inverted-text-color)" }}>
                Спецтехника
              </Link>
            </li>
            <li>
              <Link href="/catalog" style={{ color: "var(--inverted-text-color)" }}>
                Услуги
              </Link>
            </li>
          </ul>
        </div>
        <div className="footer-column" style={{ width: 398 }}>
          <h3 style={{ fontSize: 26, margin: "1em 0"}}>Наши контакты</h3>
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
        style={{
          display: "block",
          maxWidth: 1300,
          margin: "20px auto 0",
          textAlign: "left",
        }}
      >
        © «Альтернатива Форклифт» {new Date().getFullYear()}
      </span>
      <style>{`
        footer a:hover {
          text-decoration: underline;
        }
        #copyright {
          color: #a09aa4;
          font-size: 0.95rem;
          padding-top: 1rem;
        }
        @media (max-width: 768px) {
          footer {
            padding: 20px 20px !important;
          }
          #footer-columns {
            flex-direction: column !important;
            gap: 30px !important;
          }
          .footer-column {
            width: 100% !important;
          }
        }
      `}</style>
    </footer>
  );
}