import React from "react";
import Link from "next/link";

interface ButtonProps {
  variant?: "default" | "icon";
  size?: "default" | "small";
  outlined?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  "aria-label"?: string;
  href?: string;
}

export default function Button({
  variant = "default",
  size = "default",
  outlined = false,
  onClick,
  type = "button",
  disabled = false,
  style,
  className = "",
  children,
  "aria-label": ariaLabel,
  href,
}: ButtonProps) {
  const sizeStyles: React.CSSProperties =
    size === "small"
      ? { fontSize: 14, padding: "8px 16px", minHeight: 0 }
      : {};

  const classes = `${variant === "icon" ? "expand-button" : ""} ${outlined ? "btn-outlined" : ""} ${className}`.trim();
  const combinedStyle = { ...sizeStyles, ...style };

  if (href) {
    return (
      <Link
        href={href}
        className={`btn-link${classes ? ` ${classes}` : ""}`}
        style={combinedStyle}
        onClick={onClick}
        aria-label={ariaLabel}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={combinedStyle}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
