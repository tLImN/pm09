import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

const PREVIEW_SECRET = process.env.STRAPI_PREVIEW_SECRET || "strapi-preview-secret";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const url = searchParams.get("url");

  if (secret !== PREVIEW_SECRET) {
    return new Response("Invalid token", { status: 401 });
  }

  if (!url) {
    return new Response("Missing url parameter", { status: 400 });
  }

  const draft = await draftMode();
  draft.enable();

  redirect(url);
}