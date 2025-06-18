import React, { useState, useRef } from "react";
import { Input, Button } from "../../../../shared/ui";
import { Typography } from "../../../../shared/Typography/Typography";
import { CalendarEvent } from "../../../../entities/calendar";
import {
  parseEventFromText,
  convertToCalendarEvent,
} from "../../../../entities/calendar/utils/textParser";
import styles from "./TextEventInput.module.scss";

interface TextEventInputProps {
  onEventCreate: (event: Omit<CalendarEvent, "id">) => void;
  onClose: () => void;
  placeholder?: string;
}

export const TextEventInput: React.FC<TextEventInputProps> = ({
  onEventCreate,
  onClose,
  placeholder = "Например: 'Завтра встреча с Иваном в 10:00'",
}) => {
  const [text, setText] = useState("");
  const [preview, setPreview] = useState<string>("");
  const [confidence, setConfidence] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setText(value);
    setError("");

    if (value.trim()) {
      const parsed = parseEventFromText(value);
      if (parsed) {
        setPreview(generatePreview(parsed));
        setConfidence(parsed.confidence);
      } else {
        setPreview("");
        setConfidence(0);
      }
    } else {
      setPreview("");
      setConfidence(0);
    }
  };

  const generatePreview = (parsed: any): string => {
    const date = parsed.startDate.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year:
        parsed.startDate.getFullYear() !== new Date().getFullYear()
          ? "numeric"
          : undefined,
    });

    if (parsed.isAllDay) {
      return `"${parsed.title}" - ${date} (весь день)`;
    } else {
      const startTime = parsed.startDate.toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const endTime = parsed.endDate.toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return `"${parsed.title}" - ${date} с ${startTime} до ${endTime}`;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      setError("Введите описание события");
      return;
    }

    const parsed = parseEventFromText(text);
    if (!parsed) {
      setError(
        "Не удалось распознать событие. Попробуйте другую формулировку.",
      );
      return;
    }

    if (parsed.confidence < 0.3) {
      setError(
        "Недостаточно информации для создания события. Уточните дату и время.",
      );
      return;
    }

    const calendarEvent = convertToCalendarEvent(parsed);
    onEventCreate(calendarEvent);
    setText("");
    setPreview("");
    setConfidence(0);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  const examples = [
    "Завтра встреча с командой в 15:00",
    "В пятницу презентация проекта в 14:30",
    "Сегодня звонок клиенту в 11:00 на 2 часа",
    "В понедельник день рождения",
    "20 декабря корпоратив в 18:00",
  ];

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.header}>
          <Typography variant="h3" className={styles.title}>
            Создать событие из текста
          </Typography>
          <Button
            type="button"
            variant="text"
            size="small"
            onClick={onClose}
            className={styles.closeButton}
          >
            ✕
          </Button>
        </div>

        <div className={styles.inputSection}>
          <Input
            ref={inputRef}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            error={error}
            className={styles.textInput}
            autoFocus
          />

          {preview && (
            <div className={styles.preview}>
              <Typography variant="caption" className={styles.previewLabel}>
                Предварительный просмотр:
              </Typography>
              <Typography variant="body" className={styles.previewText}>
                {preview}
              </Typography>
              <div className={styles.confidence}>
                <div
                  className={styles.confidenceBar}
                  style={{ width: `${confidence * 100}%` }}
                />
                <Typography variant="small" className={styles.confidenceText}>
                  Уверенность: {Math.round(confidence * 100)}%
                </Typography>
              </div>
            </div>
          )}
        </div>

        <div className={styles.examples}>
          <Typography variant="caption" className={styles.examplesTitle}>
            Примеры:
          </Typography>
          <div className={styles.examplesList}>
            {examples.map((example, index) => (
              <button
                key={index}
                type="button"
                className={styles.exampleButton}
                onClick={() => setText(example)}
              >
                <Typography variant="small">{example}</Typography>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.actions}>
          <Button type="button" variant="text" onClick={onClose}>
            Отмена
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!text.trim() || confidence < 0.3}
          >
            Создать событие
          </Button>
        </div>
      </form>
    </div>
  );
};
