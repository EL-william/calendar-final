import React from "react";

type ButtonVariant = "primary" | "secondary" | "text";
type ButtonSize = "small" | "medium" | "large";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "medium",
  loading = false,
  className,
  children,
  disabled,
  ...props
}) => {
  return (
    <button
      className={[
        styles.button,
        styles[variant],
        styles[size],
        loading ? styles.loading : "",
        className || "",
      ]
        .filter(Boolean)
        .join(" ")}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className={styles.spinner} />}
      <span
        className={[styles.content, loading ? styles.hidden : ""]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </span>
    </button>
  );
};
