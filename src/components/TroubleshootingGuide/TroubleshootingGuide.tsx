import React from "react";
import { Typography } from "../../shared/Typography/Typography";
import styles from "./TroubleshootingGuide.module.scss";

export const TroubleshootingGuide: React.FC = () => {
  return (
    <div className={styles.guide}>
      <Typography variant="h3" className={styles.title}>
        🚨 Решение ошибки 404 "Not Found"
      </Typography>

      <div className={styles.section}>
        <Typography variant="h3" className={styles.sectionTitle}>
          💡 Причины ошибки 404:
        </Typography>
        <ul className={styles.list}>
          <li>
            <Typography variant="body">
              <strong>Бэкенд не запущен</strong> - сервер вообще недоступен
            </Typography>
          </li>
          <li>
            <Typography variant="body">
              <strong>Неправильный URL</strong> - эндпоинт находится по другому
              пути
            </Typography>
          </li>
          <li>
            <Typography variant="body">
              <strong>Неправильный порт</strong> - сервер запущен на другом
              порту
            </Typography>
          </li>
          <li>
            <Typography variant="body">
              <strong>Эндпоинт не реализован</strong> - бэкенд код не готов
            </Typography>
          </li>
        </ul>
      </div>

      <div className={styles.section}>
        <Typography variant="h3" className={styles.sectionTitle}>
          🔧 Пошаговое решение:
        </Typography>
        <ol className={styles.stepsList}>
          <li>
            <Typography variant="body">
              <strong>Проверьте бэкенд:</strong>
              <br />• Запущен ли сервер на <code>localhost:8080</code>?
              <br />• Открывается ли <code>http://localhost:8080</code> в
              браузере?
            </Typography>
          </li>
          <li>
            <Typography variant="body">
              <strong>Уточните у бэкенд коллег:</strong>
              <br />
              • Точный URL эндпоинта регистрации
              <br />
              • На каком порту запущен сервер
              <br />• Готов ли эндпоинт <code>/register</code>
            </Typography>
          </li>
          <li>
            <Typography variant="body">
              <strong>Проверьте возможные пути:</strong>
              <br />• <code>http://localhost:8080/register</code>
              <br />• <code>http://localhost:8080/api/register</code>
              <br />• <code>http://localhost:8080/api/v1/register</code>
              <br />• <code>http://localhost:8080/auth/api/v1/register</code>
            </Typography>
          </li>
          <li>
            <Typography variant="body">
              <strong>Используйте диагностику:</strong>
              <br />
              • Нажмите "🩺 Полная диагностика" выше
              <br />• Тестируйте конкретные URL в поле "Тест эндпоинта"
            </Typography>
          </li>
        </ol>
      </div>

      <div className={styles.section}>
        <Typography variant="h3" className={styles.sectionTitle}>
          💬 Вопросы для бэкенд коллег:
        </Typography>
        <div className={styles.questions}>
          <Typography variant="body">
            Скопируйте и отправьте эти вопросы вашим бэкенд коллегам:
          </Typography>
          <div className={styles.questionsBox}>
            <Typography variant="body">
              Привет! У меня ошибка 404 при подключении к API регистрации.
              <br />
              <br />
              Можете уточнить:
              <br />
              1. На каком порту запущен сервер? (у меня настроено
              localhost:8080)
              <br />
              2. Точный URL для эндпоинта регистрации?
              <br />
              3. Готов ли эндпоинт /register для тестирования?
              <br />
              4. Нужны ли специальные headers или настройки CORS?
              <br />
              <br />
              Спасибо! 🙏
            </Typography>
          </div>
        </div>
      </div>

      <div className={styles.commonUrls}>
        <Typography variant="h3" className={styles.sectionTitle}>
          🔗 Частые варианты URL:
        </Typography>
        <div className={styles.urlGrid}>
          <div className={styles.urlItem}>
            <code>http://localhost:3000/api/register</code>
          </div>
          <div className={styles.urlItem}>
            <code>http://localhost:8000/api/register</code>
          </div>
          <div className={styles.urlItem}>
            <code>http://localhost:8080/register</code>
          </div>
          <div className={styles.urlItem}>
            <code>http://localhost:8080/api/register</code>
          </div>
        </div>
      </div>
    </div>
  );
};
