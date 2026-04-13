import { ReactNode } from "react";

interface HeroBannerProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  children?: ReactNode;
}

export default function HeroBanner({
  title,
  subtitle,
  backgroundImage,
  children,
}: HeroBannerProps) {
  return (
    <>
      <section
        id="banner"
        style={{
          position: "relative",
          backgroundColor: "var(--text-color)",
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          minHeight: 453,
          color: "var(--inverted-text-color)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(26, 23, 27, 0.8)",
          }}
        />
        <div
          style={{
            position: "relative",
            padding: "30px",
            maxWidth: 1440,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "baseline",
            justifyContent: "center",
            gap: 30,
            minHeight: 453,
          }}
        >
            <h1 style={{ fontSize: "4rem", margin: 0, maxWidth: 884, lineHeight: 1.2 }}>
              {title}
            </h1>
            {subtitle && (
              <p
                style={{
                  fontSize: "1.375rem",
                  margin: 0,
                  maxWidth: 1440,
                  lineHeight: 1.5,
                }}
              >
                {subtitle}
              </p>
            )}
            {children}
          </div>
      </section>
      <style>{`
        @media (max-width: 768px) {
          #banner h1 {
            font-size: 2rem !important;
          }
          #banner > div:last-child {
            padding: 30px 20px !important;
          }
        }
      `}</style>
    </>
  );
}