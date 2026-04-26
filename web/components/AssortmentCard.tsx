import Link from "next/link";

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
          className="assortment-card__image-container"
          style={{
            border: "1px solid var(--border-color)",
            aspectRatio: "366 / 270",
            borderRadius: 5,
            overflow: "clip",
          }}
        >
          <img
            src={imageSrc}
            alt={title}
            style={{
              width: "110%",
              height: "110%",
              objectFit: "contain",
              margin: "-2% auto",
              padding: "4px",
            }}
          />
        </div>
        <span>{title}</span>
      </div>
      <style>{`
        .assortment-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
          margin-bottom: 10px;
          width: 100%;
        }
        .assortment-card:hover {
          transform: scale(1.03);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          border-radius: 15px;
        }
        .assortment-card__image-container {
          transition: border-color 0.3s ease;
        }
        .assortment-card:hover .assortment-card__image-container {
          border-color: var(--accent-color, #007bff);
        }
        @media (min-width: 769px) {
          .assortment-card {
            width: 366px;
            height: 336px;
          }
          .assortment-card__image-container {
            height: 270px !important;
            aspect-ratio: auto !important;
          }
        }
      `}</style>
    </Link>
  );
}
