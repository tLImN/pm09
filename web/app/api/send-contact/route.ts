import { NextResponse } from "next/server";

const STRAPI_URL =
  process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, tel, email, message, contact_method, request_type, page_url, documentId } = body;

    // Валидация обязательных полей
    if (!name || !tel || !contact_method) {
      return NextResponse.json(
        { success: false, error: "Заполните все обязательные поля" },
        { status: 400 }
      );
    }

    // Если выбран email как способ связи — email обязателен
    if (contact_method === "email" && !email) {
      return NextResponse.json(
        { success: false, error: "Укажите email для связи" },
        { status: 400 }
      );
    }

    // Отправляем заявку в Strapi
    try {
      const strapiRes = await fetch(`${STRAPI_URL}/api/incoming-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            request_date: new Date().toISOString(),
            name,
            phone: tel,
            ...(email ? { email } : {}),
            message: message || "",
            contact_method,
            request_type: request_type || "callback",
            page_url: page_url || "",
            ...(documentId ? { item: documentId } : {}),
          },
        }),
      });

      if (!strapiRes.ok) {
        const errorData = await strapiRes.json().catch(() => null);
        const errorMessage = errorData?.error?.message || JSON.stringify(errorData);
        console.error("Ошибка Strapi API:", strapiRes.status, errorMessage, errorData);
        return NextResponse.json(
          { success: false, error: `Ошибка при сохранении заявки: ${errorMessage}` },
          { status: strapiRes.status }
        );
      }

      return NextResponse.json({ success: true });
    } catch (strapiError) {
      console.error("Ошибка отправки в Strapi:", strapiError);
      return NextResponse.json(
        { success: false, error: "Ошибка сервера" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Ошибка обработки формы:", error);
    return NextResponse.json(
      { success: false, error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}