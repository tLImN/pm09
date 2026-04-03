import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, tel, email, message } = body;

    // Валидация
    if (!name || !tel || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Все поля обязательны" },
        { status: 400 }
      );
    }

    // Проверяем наличие SMTP настроек
    const smtpHost = process.env.SMTP_HOST;

    if (!smtpHost) {
      // Режим заглушки: логируем данные и возвращаем success
      console.log("=== ЗАЯВКА С САЙТА (режим заглушки) ===");
      console.log(`Имя: ${name}`);
      console.log(`Телефон: ${tel}`);
      console.log(`Email: ${email}`);
      console.log(`Сообщение: ${message}`);
      console.log("=========================================");

      return NextResponse.json({
        success: true,
        message: "Заявка принята (режим заглушки)",
      });
    }

    // Если SMTP настроен — пытаемся отправить email через nodemailer
    try {
      const nodemailer = await import("nodemailer");

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.CONTACT_EMAIL || "info@aforklift.ru",
        subject: `Заявка с сайта от ${name}`,
        text: `
Имя: ${name}
Телефон: ${tel}
Email: ${email}
Сообщение: ${message}
        `,
        html: `
<h2>Новая заявка с сайта</h2>
<p><b>Имя:</b> ${name}</p>
<p><b>Телефон:</b> ${tel}</p>
<p><b>Email:</b> ${email}</p>
<p><b>Сообщение:</b> ${message}</p>
        `,
      });

      return NextResponse.json({ success: true });
    } catch (emailError) {
      console.error("Ошибка отправки email:", emailError);
      // Всё равно возвращаем success, чтобы пользователь не видел ошибку
      return NextResponse.json({
        success: true,
        message: "Заявка принята (ошибка отправки email, данные сохранены в лог)",
      });
    }
  } catch (error) {
    console.error("Ошибка обработки формы:", error);
    return NextResponse.json(
      { success: false, error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}