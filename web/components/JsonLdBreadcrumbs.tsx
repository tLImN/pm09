/**
 * Невидимый компонент — рендерит JSON-LD разметку BreadcrumbList для SEO.
 * Пользователь не видит этот блок, его читают только поисковые роботы.
 */
export default function JsonLdBreadcrumbs({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  if (items.length === 0) return null;

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://aforklift.ru";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}