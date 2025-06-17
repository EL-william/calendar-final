import React from "react";
import { Card } from "@/shared/ui";
import { RegisterForm } from "@/features/auth";
import styles from "./AuthPages.module.scss";

export const RegisterPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <Card padding="large" className={styles.card}>
        <RegisterForm />
      </Card>
    </div>
  );
};
