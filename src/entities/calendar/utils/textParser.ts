import { CalendarEvent } from "../types";

// Регулярные выражения для парсинга русского текста
const TIME_PATTERNS = [
  /в\s+(\d{1,2}):(\d{2})/g, // "в 10:30"
  /в\s+(\d{1,2})\s+(?:часов|час)/g, // "в 10 часов"
  /(\d{1,2}):(\d{2})/g, // "10:30"
  /(\d{1,2})\s+(?:часов|час)/g, // "10 часов"
];

const DATE_PATTERNS = {
  today: /(?:сегодня|сёдня)/i,
  tomorrow: /(?:завтра|завтро)/i,
  dayAfterTomorrow: /(?:послезавтра|после\s+завтра)/i,
  yesterday: /(?:вчера)/i,
  monday: /(?:в\s+)?понедельник/i,
  tuesday: /(?:в\s+)?вторник/i,
  wednesday: /(?:в\s+)?среду/i,
  thursday: /(?:в\s+)?четверг/i,
  friday: /(?:в\s+)?пятницу/i,
  saturday: /(?:в\s+)?субботу/i,
  sunday: /(?:в\s+)?воскресенье/i,
  date: /(\d{1,2})\s+(?:числа|\.|\s)?\s*(\w+)?/g, // "15 марта", "20 числа"
};

const MONTHS = {
  январь: 0,
  января: 0,
  янв: 0,
  февраль: 1,
  февраля: 1,
  фев: 1,
  март: 2,
  марта: 2,
  мар: 2,
  апрель: 3,
  апреля: 3,
  апр: 3,
  май: 4,
  мая: 4,
  июнь: 5,
  июня: 5,
  июн: 5,
  июль: 6,
  июля: 6,
  июл: 6,
  август: 7,
  августа: 7,
  авг: 7,
  сентябрь: 8,
  сентября: 8,
  сен: 8,
  октябрь: 9,
  октября: 9,
  окт: 9,
  ноябрь: 10,
  ноября: 10,
  ноя: 10,
  декабрь: 11,
  декабря: 11,
  дек: 11,
};

const DURATION_PATTERNS = [
  /(?:на\s+)?(\d+)\s+(?:часа?|ч)/g, // "на 2 часа", "2ч"
  /(?:до\s+)?(\d{1,2}):(\d{2})/g, // "до 12:00"
];

export interface ParsedEvent {
  title: string;
  startDate: Date;
  endDate: Date;
  isAllDay: boolean;
  confidence: number; // 0-1, насколько уверены в парсинге
}

export function parseEventFromText(
  text: string,
  baseDate: Date = new Date(),
): ParsedEvent | null {
  const cleanText = text.trim().toLowerCase();

  if (!cleanText) return null;

  // Парсим дату
  const parsedDate = parseDate(cleanText, baseDate);

  // Парсим время
  const timeInfo = parseTime(cleanText);

  // Извлекаем название события (убираем распознанные части)
  const title = extractTitle(text, parsedDate, timeInfo);

  if (!title) return null;

  // Создаем даты
  const startDate = new Date(parsedDate);
  let endDate = new Date(parsedDate);

  if (timeInfo) {
    startDate.setHours(timeInfo.startHour, timeInfo.startMinute, 0, 0);

    if (timeInfo.endHour !== undefined && timeInfo.endMinute !== undefined) {
      endDate.setHours(timeInfo.endHour, timeInfo.endMinute, 0, 0);
    } else if (timeInfo.duration) {
      endDate = new Date(
        startDate.getTime() + timeInfo.duration * 60 * 60 * 1000,
      );
    } else {
      // По умолчанию 1 час
      endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
    }
  } else {
    // Событие на весь день
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
  }

  return {
    title: title.trim(),
    startDate,
    endDate,
    isAllDay: !timeInfo,
    confidence: calculateConfidence(cleanText, parsedDate, timeInfo, title),
  };
}

function parseDate(text: string, baseDate: Date): Date {
  const result = new Date(baseDate);

  // Проверяем относительные даты
  if (DATE_PATTERNS.today.test(text)) {
    return result;
  }

  if (DATE_PATTERNS.tomorrow.test(text)) {
    result.setDate(result.getDate() + 1);
    return result;
  }

  if (DATE_PATTERNS.dayAfterTomorrow.test(text)) {
    result.setDate(result.getDate() + 2);
    return result;
  }

  if (DATE_PATTERNS.yesterday.test(text)) {
    result.setDate(result.getDate() - 1);
    return result;
  }

  // Проверяем дни недели
  const today = result.getDay(); // 0 = воскресенье
  const dayMap = [
    { pattern: DATE_PATTERNS.monday, target: 1 },
    { pattern: DATE_PATTERNS.tuesday, target: 2 },
    { pattern: DATE_PATTERNS.wednesday, target: 3 },
    { pattern: DATE_PATTERNS.thursday, target: 4 },
    { pattern: DATE_PATTERNS.friday, target: 5 },
    { pattern: DATE_PATTERNS.saturday, target: 6 },
    { pattern: DATE_PATTERNS.sunday, target: 0 },
  ];

  for (const { pattern, target } of dayMap) {
    if (pattern.test(text)) {
      let daysToAdd = target - today;
      if (daysToAdd <= 0) daysToAdd += 7; // Следующая неделя
      result.setDate(result.getDate() + daysToAdd);
      return result;
    }
  }

  // Проверяем конкретные даты
  const dateMatch = text.match(/(\d{1,2})\s+(\w+)/);
  if (dateMatch) {
    const day = parseInt(dateMatch[1]);
    const monthText = dateMatch[2].toLowerCase();

    if (MONTHS.hasOwnProperty(monthText)) {
      const month = MONTHS[monthText as keyof typeof MONTHS];
      result.setDate(day);
      result.setMonth(month);

      // Если дата уже прошла в этом году, берем следующий год
      if (result < baseDate) {
        result.setFullYear(result.getFullYear() + 1);
      }

      return result;
    }
  }

  return result; // Возвращаем сегодня, если ничего не найдено
}

function parseTime(text: string): TimeInfo | null {
  let startHour: number | undefined;
  let startMinute: number | undefined;
  let endHour: number | undefined;
  let endMinute: number | undefined;
  let duration: number | undefined;

  // Ищем время начала
  for (const pattern of TIME_PATTERNS) {
    pattern.lastIndex = 0; // Сброс регекса
    const match = pattern.exec(text);
    if (match) {
      startHour = parseInt(match[1]);
      startMinute = match[2] ? parseInt(match[2]) : 0;
      break;
    }
  }

  if (startHour === undefined) return null;

  // Ищем время окончания или длительность
  const durationMatch = text.match(/на\s+(\d+)\s+(?:часа?|ч)/);
  if (durationMatch) {
    duration = parseInt(durationMatch[1]);
  }

  const endTimeMatch = text.match(/до\s+(\d{1,2}):?(\d{2})?/);
  if (endTimeMatch) {
    endHour = parseInt(endTimeMatch[1]);
    endMinute = endTimeMatch[2] ? parseInt(endTimeMatch[2]) : 0;
  }

  return {
    startHour,
    startMinute: startMinute || 0,
    endHour,
    endMinute,
    duration,
  };
}

function extractTitle(
  originalText: string,
  date: Date,
  timeInfo: TimeInfo | null,
): string {
  let title = originalText;

  // Убираем распознанные части даты
  title = title.replace(
    /(?:сегодня|завтра|послезавтра|вчера|в\s+(?:понедельник|вторник|среду|четверг|пятницу|субботу|воскресенье))/gi,
    "",
  );
  title = title.replace(
    /\d{1,2}\s+(?:января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)/gi,
    "",
  );

  // Убираем время
  if (timeInfo) {
    title = title.replace(/в\s+\d{1,2}:?\d{0,2}\s*(?:часов|час)?/gi, "");
    title = title.replace(/до\s+\d{1,2}:?\d{0,2}/gi, "");
    title = title.replace(/на\s+\d+\s+(?:часа?|ч)/gi, "");
  }

  // Очищаем от лишних пробелов и предлогов
  title = title.replace(/\s+/g, " ").trim();
  title = title.replace(/^(?:в|на|с|до|у|о|об)\s+/i, "");

  return title;
}

function calculateConfidence(
  text: string,
  date: Date,
  timeInfo: TimeInfo | null,
  title: string,
): number {
  let confidence = 0.5; // Базовая уверенность

  // Увеличиваем уверенность за найденное время
  if (timeInfo) confidence += 0.3;

  // Увеличиваем за ясные временные указатели
  if (/(?:сегодня|завтра|вчера)/i.test(text)) confidence += 0.2;
  if (
    /(?:понедельник|вторник|среда|четверг|пятница|суббота|воскресенье)/i.test(
      text,
    )
  )
    confidence += 0.1;

  // Снижаем за слишком короткий или подозрительный заголовок
  if (title.length < 3) confidence -= 0.3;
  if (title.length > 100) confidence -= 0.2;

  return Math.max(0, Math.min(1, confidence));
}

interface TimeInfo {
  startHour: number;
  startMinute: number;
  endHour?: number;
  endMinute?: number;
  duration?: number;
}

// Функция для конвертации ParsedEvent в CalendarEvent
export function convertToCalendarEvent(
  parsedEvent: ParsedEvent,
): Omit<CalendarEvent, "id"> {
  return {
    title: parsedEvent.title,
    startDate: parsedEvent.startDate,
    endDate: parsedEvent.endDate,
    isAllDay: parsedEvent.isAllDay,
    color: "#4285f4", // Цвет по умолчанию
    description: `Создано из текста (уверенность: ${Math.round(parsedEvent.confidence * 100)}%)`,
  };
}
