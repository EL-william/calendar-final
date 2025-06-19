import React, { useState } from "react";
import { Card, Button } from "@/shared/ui";
import { LoginForm } from "@/features/auth";
import { ApiTester } from "../components/ApiTester/ApiTester";
import styles from "./AuthPages.module.scss";

export const LoginPage: React.FC = () => {
  const [showApiTester, setShowApiTester] = useState(false);

  return (
    <div className={styles.container}>
      <Card padding="large" className={styles.card}>
        <LoginForm />
      </Card>

      {/* Кнопка для показа API тестера */}
      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        <Button
          variant="text"
          size="small"
          onClick={() => setShowApiTester(!showApiTester)}
        >
          {showApiTester ? "Скрыть API тестер" : "🧪 Показать API тестер"}
        </Button>
      </div>

      {/* API тестер */}
      {showApiTester && <ApiTester />}
    </div>
  );
};
