"use client";

import { useState, useEffect } from "react";
import Button from "@/components/Button";
import { getContactPage } from "@/lib/api";

export default function PopupForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    tel: "",
    email: "",
    message: "",
    contact_method: "phone",
  });
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [requestType, setRequestType] = useState("callback");
  const [pageUrl, setPageUrl] = useState("");
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [itemTitle, setItemTitle] = useState<string | null>(null);
  const [companyPhone, setCompanyPhone] = useState<string>("+7 (905) 617-98-52");
  const [workingHours, setWorkingHours] = useState<string>("пн–пт, 9:00–18:00");

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      setAgreed(false);
      setStatus("idle");
      setFormData({ name: "", tel: "", email: "", message: "", contact_method: "phone" });
      setItemTitle(null);
      setDocumentId(null);
      setRequestType("callback");
      setPageUrl("");
    }, 300);
  };

  // Загружаем телефон компании один раз
  useEffect(() => {
    getContactPage().then((data) => {
      if (data?.phone) setCompanyPhone(data.phone);
      if (data?.working_hours) setWorkingHours(data.working_hours);
    });
  }, []);

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const detail = (e as CustomEvent).detail || {};
      setRequestType(detail.request_type || "callback");
      setPageUrl(detail.page_url || window.location.href);
      setDocumentId(detail.documentId || null);
      setItemTitle(detail.item_title || null);
      setIsOpen(true);
      setIsClosing(false);
      setIsOpening(true);
      setTimeout(() => {
        setIsOpening(false);
      }, 0);
    };
    window.addEventListener("open-popup", handleOpen);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("open-popup", handleOpen);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/send-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          request_type: requestType,
          page_url: pageUrl,
          documentId: documentId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setFormData({ name: "", tel: "", email: "", message: "", contact_method: "phone" });
        setAgreed(false);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (!isOpen && !isClosing) return null;

  const requestTypeLabel =
    requestType === "service" ? "Услуга" :
    requestType === "quote" ? "Товар" : null;

  return (
    <div
      className="popup-container"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: `rgba(0,0,0,${isClosing ? 0 : isOpening ? 0 : 0.5})`,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        zIndex: 1000,
        transition: "background-color 0.2s ease, opacity 0.2s ease",
        opacity: isClosing ? 0 : isOpening ? 0 : 1,
        overflowY: "auto",
      }}
    >
      <div
        className="popup-form"
        style={{
          width: "100%",
          maxWidth: 600,
          padding: "20px 40px",
          borderRadius: 5,
          marginTop: "20vh",
          marginBottom: "20px",
          border: "1px solid var(--border-color)",
          backgroundColor: "var(--inverted-text-color)",
          transition: "transform 0.3s ease, opacity 0.3s ease",
          transform: isClosing ? "translateY(-20px)" : isOpening ? "translateY(20px)" : "translateY(0)",
          opacity: isClosing ? 0 : isOpening ? 0 : 1,
          maxHeight: "85vh",
          overflowY: "auto",
          position: "relative",
        }}
      >
        {status === "success" ? (
          /* Блок подтверждения после отправки */
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="56"
              height="56"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--accent-color)"
              strokeWidth="2"
              strokeLinecap="inherit"
              strokeLinejoin="round"
              style={{ display: "block", margin: "0 auto 20px" }}
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <p style={{ fontSize: 20, fontWeight: 600, margin: "0 0 12px" }}>
              Заявка отправлена!
            </p>
            <p style={{ color: "var(--subtext-color)", margin: "0 0 16px", lineHeight: 1.5 }}>
              Наш специалист свяжется с вами в течение 30 минут
              в рабочее время ({workingHours}).
            </p>
            <p style={{ fontSize: 14, marginTop: 30 }}>
              Если у вас срочный вопрос — позвоните:{" "}
              <a
                href={`tel:${companyPhone.replace(/[\s\-\(\)]/g, "")}`}
                style={{ color: "var(--accent-color)", fontWeight: 500 }}
              >
                {companyPhone}
              </a>
            </p>
          </div>
        ) : (
          <>
          <span
            className="popup-header"
            style={{
              fontWeight: 700,
              fontSize: 35,
              textAlign: "center",
              display: "block",
              marginBottom: itemTitle ? 5 : 30,
            }}
          >
            Оставить заявку
          </span>

          {/* Название товара/услуги */}
          {itemTitle && requestTypeLabel && (
            <p style={{
              textAlign: "center",
              margin: "0 0 20px",
              color: "var(--subtext-color)",
              fontSize: 15,
            }}>
              {requestTypeLabel}: <strong>{itemTitle}</strong>
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <fieldset
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 11,
                padding: 0,
                border: "none",
                margin: 0,
              }}
            >
              <input
                name="name"
                type="text"
                placeholder="Имя"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                title="Введите ваше имя"
              />
              <input
                name="tel"
                type="tel"
                placeholder="Телефон"
                required
                value={formData.tel}
                onChange={(e) =>
                  setFormData({ ...formData, tel: e.target.value })
                }
                pattern="[\+]?[0-9\s\-\(\)]{7,15}"
                title="Введите номер телефона, например: +7 (905) 617-98-52"
              />
              <div className="popup-contact-method" style={{ display: "flex", gap: 20, alignItems: "center", marginTop: 5 }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>Как с вами связаться?</span>
                <label style={{ display: "flex", gap: 5, alignItems: "center", cursor: "pointer", fontSize: 14 }}>
                  <input
                    type="radio"
                    name="contact_method"
                    value="phone"
                    checked={formData.contact_method === "phone"}
                    onChange={() =>
                      setFormData({ ...formData, contact_method: "phone" })
                    }
                    style={{ margin: 0 }}
                  />
                  Звонок
                </label>
                <label style={{ display: "flex", gap: 5, alignItems: "center", cursor: "pointer", fontSize: 14 }}>
                  <input
                    type="radio"
                    name="contact_method"
                    value="email"
                    checked={formData.contact_method === "email"}
                    onChange={() =>
                      setFormData({ ...formData, contact_method: "email" })
                    }
                    style={{ margin: 0 }}
                  />
                  Email
                </label>
              </div>
              {formData.contact_method === "email" && (
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              )}
              <textarea
                name="message"
                placeholder="Дополнительная информация: объём, условия, сроки и др."
                autoComplete="off"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                rows={4}
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: 16,
                  padding: '10px 15px',
                  border: '1px solid var(--border-color)',
                  borderRadius: 5,
                  fontWeight: 500,
                  width: '100%',
                  resize: 'vertical',
                  outline: 'none',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                }}
              />
            </fieldset>
            <label
              style={{
                display: "flex",
                gap: 13,
                marginTop: 20,
                marginBottom: 20,
                alignItems: "flex-start",
              }}
            >
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                required
                style={{ marginTop: 0 }}
              />
              <span style={{ fontSize: 14 }}>
                Нажимая кнопку «Отправить», я даю свое согласие на{" "}
                <a href="/licenses">обработку моих персональных данных</a>.
              </span>
            </label>

            {status === "error" && (
              <p style={{ color: "red", textAlign: "center", marginBottom: 10 }}>
                Ошибка отправки. Попробуйте позже.
              </p>
            )}

            <Button
              type="submit"
              disabled={!agreed || status === "loading"}
              style={{
                width: "100%",
                opacity: agreed ? 1 : 0.6,
              }}
            >
              {status === "loading" ? "Отправка..." : "Отправить"}
            </Button>
          </form>
          </>
        )}
      </div>

    </div>
  );
}