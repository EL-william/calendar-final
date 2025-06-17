import React from "react";
import styles from "./Card.module.scss";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "small" | "medium" | "large";
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  padding = "medium",
}) => {
  return (
    <div
      className={[styles.card, styles[padding], className || ""]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
};
