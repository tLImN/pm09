"use client";

import { useState, useEffect } from "react";
import Button from "@/components/Button";

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

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 300);
  };

  useEffect(() => {
    const handleOpen = () => {
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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setFormData({ name: "", tel: "", email: "", message: "", contact_method: "phone" });
        setAgreed(false);
        setTimeout(() => {
          setStatus("idle");
          handleClose();
        }, 2000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (!isOpen && !isClosing) return null;

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
      }}
    >
      <div
        className="popup"
        style={{
          width: 600,
          maxWidth: "90vw",
          padding: "20px 40px",
          borderRadius: 5,
          marginTop: "20vh",
          border: "1px solid var(--border-color)",
          backgroundColor: "var(--inverted-text-color)",
          transition: "transform 0.3s ease, opacity 0.3s ease",
          transform: isClosing ? "translateY(-20px)" : isOpening ? "translateY(20px)" : "translateY(0)",
          opacity: isClosing ? 0 : isOpening ? 0 : 1,
        }}
      >
        <form onSubmit={handleSubmit}>
          <span
            className="popup-header"
            style={{
              fontWeight: 700,
              fontSize: 35,
              textAlign: "center",
              display: "block",
              marginBottom: 30,
            }}
          >
            Оставить заявку
          </span>
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
            />
            <div style={{ display: "flex", gap: 20, alignItems: "center", marginTop: 5 }}>
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
              placeholder="Сообщение (добавьте выбранные товары и услуги)"
              required
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

          {status === "success" && (
            <p style={{ color: "green", textAlign: "center", marginBottom: 10 }}>
              Заявка отправлена!
            </p>
          )}
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
      </div>
    </div>
  );
}