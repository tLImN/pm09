import Link from "next/link";
import { CatalogItem } from "@/lib/types";
import { getStrapiImageUrl } from "@/lib/utils";
import Button from "@/components/Button";

export default function ProductCard({
  item,
  categorySlug,
}: {
  item: CatalogItem;
  categorySlug?: string;
}) {
  const imageUrl =
    item.item_images?.[0]?.url
      ? getStrapiImageUrl(item.item_images[0].url)
      : "/img/ki_image-placeholder.webp";

  const href = categorySlug
    ? `/catalog/${categorySlug}/${item.item_slug}`
    : `/catalog/item/${item.item_slug}`;

  return (
    <article
      className="product-card flex gap-[18px] h-[190px] border border-[var(--border-color)] rounded-[5px] pr-[20px] transition-shadow duration-200 hover:shadow-lg overflow-y-hidden"
    >
      <div
        className="image-container self-stretch w-[231px] shrink-0 overflow-hidden outline outline-[var(--border-color)] rounded-l-[5px]"
      >
        <Link href={href}>
          <img
            src={imageUrl}
            alt={item.item_title}
            loading="lazy"
            className="w-[110%] h-[110%] object-contain"
            style={{ margin: "-2% -1%" }}
          />
        </Link>
      </div>
      <div className="card-info-wrapper flex flex-col gap-[8px] py-[10px] justify-between grow">
        <div className="flex flex-col gap-[5px]">
          <Link
            href={href}
            className="text-[26px] font-semibold leading-[1.2] line-clamp-2 no-underline"
            style={{ color: "var(--text-color)" }}
          >
            {item.item_title}
          </Link>
          {item.item_manufacturer && (
            <p className="product-card__manufacturer m-0 text-[var(--subtext-color)]">
              Производитель: {item.item_manufacturer}
            </p>
          )}
        </div>
        <div className="product-card-bottom flex gap-[20px] justify-between">
          <div className="flex flex-col gap-[3px] self-end">
            {item.item_price && item.item_price > 0 && (
              <span className="text-[20px] font-semibold">
                от {Number(item.item_price).toLocaleString("ru-RU")} ₽
              </span>
            )}
            <span className="product-card__call-price text-[var(--subtext-color)] line-clamp-2">
              Позвоните, чтобы рассчитать цену
            </span>
          </div>
          <Button href={href} className="self-end shrink-0">Подробнее</Button>
        </div>
      </div>
    </article>
  );
}