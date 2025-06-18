import React, { useState } from "react";
import { Button, Input } from "../../../../shared/ui";
import { Typography } from "../../../../shared/Typography/Typography";
import { CalendarEvent } from "../../../../entities/calendar";
import {
  parseEventFromText,
  convertToCalendarEvent,
} from "../../../../entities/calendar/utils/textParser";
import styles from "./TestTextParser.module.scss";

interface TestTextParserProps {
  onEventCreate: (event: Omit<CalendarEvent, "id">) => void;
}

export const TestTextParser: React.FC<TestTextParserProps> = ({
  onEventCreate,
}) => {
  const [text, setText] = useState("");
  const [result, setResult] = useState<string>("");

  const handleTest = () => {
    console.log("Testing text:", text);

    if (!text.trim()) {
      setResult("Введите текст для парсинга");
      return;
    }

    try {
      const parsed = parseEventFromText(text);
      console.log("Parsed result:", parsed);

      if (parsed) {
        const event = convertToCalendarEvent(parsed);
        console.log("Calendar event:", event);

        onEventCreate(event);
        setResult(
          `✅ Создано: "${parsed.title}" на ${parsed.startDate.toLocaleString()}`,
        );
        setText("");
      } else {
        setResult("❌ Не удалось распознать событие");
      }
    } catch (error) {
      console.error("Error parsing text:", error);
      setResult(
        `❌ Ошибка: ${error instanceof Error ? error.message : "Неизвестная ошибка"}`,
      );
    }
  };

  return (
    <div className={styles.container}>
      <Typography variant="caption">Тест парсера текста:</Typography>
      <div className={styles.inputGroup}>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Завтра встреча в 10:00"
          className={styles.input}
        />
        <Button
          variant="primary"
          size="small"
          onClick={handleTest}
          disabled={!text.trim()}
        >
          Создать
        </Button>
      </div>
      {result && (
        <Typography variant="small" className={styles.result}>
          {result}
        </Typography>
      )}
    </div>
  );
};
