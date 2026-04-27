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
    <section
      id="banner"
      className="relative min-h-[453px] bg-[var(--text-color)] text-[var(--inverted-text-color)] bg-center bg-cover bg-fixed"
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
    >
      <div className="absolute inset-0 bg-[rgba(26,23,27,0.8)]" />
      <div className="relative p-[30px] max-w-[1440px] mx-auto flex flex-col items-baseline justify-center gap-[30px] min-h-[453px] max-md:p-5">
        <h1 className="text-[4rem] m-0 max-w-[884px] leading-[1.2] max-md:text-[2rem]">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[1.375rem] m-0 max-w-[1440px] leading-[1.5]">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
