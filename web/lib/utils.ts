import { StrapiBlock, StrapiBlockChild } from "./types";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export function getStrapiImageUrl(path: string): string {
  if (!path) return "/img/1766672410.png";
  if (path.startsWith("http")) return path;
  return `${STRAPI_URL}${path}`;
}

export function formatDescription(blocks?: StrapiBlock[]): string {
  if (!blocks || !Array.isArray(blocks)) return "";
  return blocks
    .map((block) => {
      if (block.type === "paragraph") {
        const text = block.children
          ?.map((child) => child.text)
          .join("") || "";
        return `<p>${text}</p>`;
      }
      if (block.type === "list") {
        const items = block.children
          ?.map((child: StrapiBlockChild) => {
            if (child.children && child.children.length > 0) {
              const text = child.children
                .map((c: StrapiBlockChild) => c.text || "")
                .join("");
              return `<li>${text}</li>`;
            }
            return `<li>${child.text || ""}</li>`;
          })
          .join("") || "";
        return `<ul>${items}</ul>`;
      }
      if (block.type === "heading") {
        const text = block.children
          ?.map((child) => child.text)
          .join("") || "";
        const level = block.level ? block.level + 1 : 3;
        return `<h${level}>${text}</h${level}>`;
      }
      if (block.type === "list-item") {
        const text = block.children
          ?.map((child) => child.text)
          .join("") || "";
        return `<li>${text}</li>`;
      }
      return "";
    })
    .join("");
}

export function sortItems<T extends { item_title: string; createdAt?: string }>(
  items: T[],
  sortBy: string
): T[] {
  const sorted = [...items];
  switch (sortBy) {
    case "title-asc":
      return sorted.sort((a, b) =>
        a.item_title.localeCompare(b.item_title, "ru")
      );
    case "title-desc":
      return sorted.sort((a, b) =>
        b.item_title.localeCompare(a.item_title, "ru")
      );
    case "newest":
      return sorted.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
    case "oldest":
      return sorted.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });
    default:
      return sorted;
  }
}