import React from "react";

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
}: ButtonProps) {
  const sizeStyles: React.CSSProperties =
    size === "small"
      ? { fontSize: 14, padding: "8px 16px", minHeight: 0 }
      : {};

  const outlinedStyles: React.CSSProperties = outlined
    ? {
        backgroundColor: "transparent",
        color: "var(--text-color)",
        border: "1px solid var(--border-color)",
      }
    : {};

  return (
    <button
      className={`${variant === "icon" ? "expand-button" : ""} ${className}`.trim()}
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ ...sizeStyles, ...outlinedStyles, ...style }}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
