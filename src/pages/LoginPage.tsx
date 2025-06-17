import React from "react";
import { Card } from "@/shared/ui";
import { LoginForm } from "@/features/auth";
import styles from "./AuthPages.module.scss";

export const LoginPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <Card padding="large" className={styles.card}>
        <LoginForm />
      </Card>
    </div>
  );
};
