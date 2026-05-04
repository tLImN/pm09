import Link from "next/link";
import Image from "next/image";

interface AssortmentCardProps {
  href: string;
  imageSrc: string;
  title: string;
}

export default function AssortmentCard({ href, imageSrc, title }: AssortmentCardProps) {
  return (
    <Link href={href} style={{ color: "var(--text-color)" }}>
      <div className="assortment-card text-center flex flex-col gap-[16px] md:gap-[24px] text-[1.1rem] sm:text-[1.3rem] md:text-[1.625rem]">
        <div
          className="assortment-card__image-container relative"
          style={{
            border: "1px solid var(--border-color)",
            aspectRatio: "366 / 270",
            borderRadius: 5,
            overflow: "clip",
          }}
        >
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-contain p-[4px]"
            sizes="(max-width: 768px) 50vw, 366px"
          />
        </div>
        <span>{title}</span>
      </div>
    </Link>
  );
}
