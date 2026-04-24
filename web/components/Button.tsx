import React from "react";

interface ButtonProps {
  variant?: "default" | "icon";
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
  onClick,
  type = "button",
  disabled = false,
  style,
  className = "",
  children,
  "aria-label": ariaLabel,
}: ButtonProps) {
  return (
    <button
      className={`${variant === "icon" ? "expand-button" : ""} ${className}`.trim()}
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={style}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}