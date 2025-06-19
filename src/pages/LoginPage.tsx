import React, { useState } from "react";
import { Card, Button } from "@/shared/ui";
import { LoginForm } from "@/features/auth";
import { ApiTester } from "../components/ApiTester/ApiTester";
import { TroubleshootingGuide } from "../components/TroubleshootingGuide/TroubleshootingGuide";
import styles from "./AuthPages.module.scss";

export const LoginPage: React.FC = () => {
  const [showApiTester, setShowApiTester] = useState(false);
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);

  return (
    <div className={styles.container}>
      <Card padding="large" className={styles.card}>
        <LoginForm />
      </Card>

      {/* Кнопки для отладки */}
      <div
        style={{
          textAlign: "center",
          marginTop: "1rem",
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="text"
          size="small"
          onClick={() => setShowApiTester(!showApiTester)}
        >
          {showApiTester ? "Скрыть API тестер" : "🧪 API тестер"}
        </Button>

        <Button
          variant="text"
          size="small"
          onClick={() => setShowTroubleshooting(!showTroubleshooting)}
        >
          {showTroubleshooting ? "Скрыть решение 404" : "🚨 Решение ошибки 404"}
        </Button>
      </div>

      {/* Troubleshooting Guide */}
      {showTroubleshooting && <TroubleshootingGuide />}

      {/* API тестер */}
      {showApiTester && <ApiTester />}
    </div>
  );
};
