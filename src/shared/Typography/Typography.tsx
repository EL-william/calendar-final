import React from "react";
import styles from "./Typography.module.scss";

type TypographyVariant = "h1" | "h2" | "h3" | "body" | "caption" | "small";

interface TypographyProps {
  variant: TypographyVariant;
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export const Typography: React.FC<TypographyProps> = ({
  variant,
  children,
  className,
  as,
}) => {
  const Component = as || getDefaultComponent(variant);

  return (
    <Component
      className={[styles[variant], className || ""].filter(Boolean).join(" ")}
    >
      {children}
    </Component>
  );
};

function getDefaultComponent(
  variant: TypographyVariant,
): keyof JSX.IntrinsicElements {
  switch (variant) {
    case "h1":
      return "h1";
    case "h2":
      return "h2";
    case "h3":
      return "h3";
    case "body":
      return "p";
    case "caption":
      return "span";
    case "small":
      return "small";
    default:
      return "p";
  }
}
