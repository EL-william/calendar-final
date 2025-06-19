import React, { useState } from "react";
import { Button } from "../../shared/ui";
import { Typography } from "../../shared/Typography/Typography";
import { testApiConnection, checkServerHealth } from "../../shared/api/testApi";
import styles from "./ApiTester.module.scss";

export const ApiTester: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const clearResults = () => {
    setResults([]);
  };

  const handleTestConnection = async () => {
    setIsLoading(true);
    addResult("🔍 Начинаем тест подключения к API...");

    try {
      // Сначала проверяем доступность сервера
      const serverOk = await checkServerHealth();
      if (serverOk) {
        addResult("✅ Сервер доступен!");
      } else {
        addResult("❌ Сервер недоступен или health endpoint не работает");
      }

      // Тестируем API регистрации
      const apiOk = await testApiConnection();
      if (apiOk) {
        addResult("✅ API регистрации работает!");
      } else {
        addResult("❌ API регистрации не работает");
      }
    } catch (error) {
      addResult(`❌ Общая ошибка: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestForm = () => {
    addResult("📝 Тестируем форму регистрации...");
    addResult("💡 Попробуйте зарегистрировать нового пользователя через форму");
  };

  return (
    <div className={styles.tester}>
      <Typography variant="h3" className={styles.title}>
        🧪 Тестер API подключения
      </Typography>

      <div className={styles.info}>
        <Typography variant="caption">
          <strong>API URL:</strong> http://localhost:8080/auth/api/v1
        </Typography>
        <Typography variant="caption">
          <strong>Эндпоинт:</strong> POST /register
        </Typography>
      </div>

      <div className={styles.buttons}>
        <Button
          variant="primary"
          size="medium"
          onClick={handleTestConnection}
          disabled={isLoading}
        >
          {isLoading ? "Тестируем..." : "🔍 Тест API"}
        </Button>

        <Button variant="secondary" size="medium" onClick={handleTestForm}>
          📝 Тест формы
        </Button>

        <Button variant="text" size="medium" onClick={clearResults}>
          🗑️ Очистить
        </Button>
      </div>

      <div className={styles.results}>
        <Typography variant="caption" className={styles.resultsTitle}>
          Результаты тестов:
        </Typography>
        <div className={styles.resultsList}>
          {results.length === 0 ? (
            <Typography variant="small" className={styles.noResults}>
              Нажмите "Тест API" для проверки подключения
            </Typography>
          ) : (
            results.map((result, index) => (
              <div key={index} className={styles.resultItem}>
                <Typography variant="small">{result}</Typography>
              </div>
            ))
          )}
        </div>
      </div>

      <div className={styles.instructions}>
        <Typography variant="h3">📋 Инструкции для тестирования:</Typography>
        <ol className={styles.stepsList}>
          <li>
            <Typography variant="body">
              <strong>Убедитесь, что бэкенд запущен</strong> на
              http://localhost:8080
            </Typography>
          </li>
          <li>
            <Typography variant="body">
              <strong>Нажмите "Тест API"</strong> для проверки подключения
            </Typography>
          </li>
          <li>
            <Typography variant="body">
              <strong>Попробуйте зарегистрироваться</strong> через форму
              регистрации
            </Typography>
          </li>
          <li>
            <Typography variant="body">
              <strong>Проверьте консоль браузера</strong> для детальных логов
            </Typography>
          </li>
        </ol>
      </div>
    </div>
  );
};
