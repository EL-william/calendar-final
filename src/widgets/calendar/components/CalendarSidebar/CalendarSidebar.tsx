import React, { useState } from "react";
import { MiniCalendar } from "../MiniCalendar/MiniCalendar";
import { Button } from "@/shared/ui";
import { Typography } from "@/shared/Typography/Typography";
import { addMonths } from "@/entities/calendar";
import styles from "./CalendarSidebar.module.scss";

interface CalendarSidebarProps {
  isVisible: boolean;
  onToggle: () => void;
  selectedDate?: Date | null;
  onDateSelect: (date: Date) => void;
}

export const CalendarSidebar: React.FC<CalendarSidebarProps> = ({
  isVisible,
  onToggle,
  selectedDate,
  onDateSelect,
}) => {
  const [miniCalendarDate, setMiniCalendarDate] = useState(new Date());

  const handleMiniCalendarNavigate = (direction: "prev" | "next") => {
    setMiniCalendarDate((prev) =>
      addMonths(prev, direction === "next" ? 1 : -1),
    );
  };

  return (
    <>
      {/* Toggle Button */}
      <Button
        variant="text"
        size="small"
        onClick={onToggle}
        className={styles.toggleButton}
        title={isVisible ? "Скрыть календарь" : "Показать календарь"}
      >
        {isVisible ? "◀" : "▶"}
      </Button>

      {/* Sidebar */}
      <div className={`${styles.sidebar} ${isVisible ? styles.visible : ""}`}>
        <div className={styles.sidebarContent}>
          <div className={styles.sidebarHeader}>
            <Typography variant="caption" className={styles.sidebarTitle}>
              Календарь
            </Typography>
          </div>

          <MiniCalendar
            currentDate={miniCalendarDate}
            selectedDate={selectedDate}
            onDateSelect={onDateSelect}
            onNavigate={handleMiniCalendarNavigate}
          />
        </div>
      </div>
    </>
  );
};
